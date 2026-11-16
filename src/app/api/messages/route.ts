import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { inngest } from "@/inngest/client";
import { executeProcessMessage } from "@/inngest/functions";
import { convex } from "@/lib/convex-client";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const INTERNAL_KEY = process.env.POLARIS_CONVEX_INTERNAL_KEY!;

const requestSchema = z.object({
  conversationId: z.string(),
  message: z.string().min(1),
  model: z.string().optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!INTERNAL_KEY) {
    return NextResponse.json({ error: "Internal key not configured" }, { status: 500 });
  }

  // Parse body
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }

  const { conversationId, message, model } = parsed.data;

  // Verify conversation exists
  const conversation = await convex.query(api.messages.getConversationById, {
    internalKey: INTERNAL_KEY,
    conversationId: conversationId as Id<"conversations">,
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const projectId = conversation.projectId;

  // Cancel any currently-processing messages
  const processingMessages = await convex.query(api.messages.getProcessingMessages, {
    internalKey: INTERNAL_KEY,
    projectId,
  });

  await Promise.all(
    processingMessages.map(async (msg) => {
      await inngest.send({ name: "message/cancel", data: { messageId: msg._id } });
      await convex.mutation(api.messages.updateMessageStatus, {
        internalKey: INTERNAL_KEY,
        messageId: msg._id,
        status: "cancelled",
      });
    })
  );

  // Create user message
  await convex.mutation(api.messages.createMessage, {
    internalKey: INTERNAL_KEY,
    conversationId: conversationId as Id<"conversations">,
    projectId,
    role: "user",
    content: message,
    status: "done",
  });

  // Create assistant placeholder
  const assistantMessageId = await convex.mutation(api.messages.createMessage, {
    internalKey: INTERNAL_KEY,
    conversationId: conversationId as Id<"conversations">,
    projectId,
    role: "assistant",
    content: "",
    status: "processing",
  });

  const selectedModel = model ?? "groq/openai/gpt-oss-120b";

  // Fire Inngest event
  const event = await inngest.send({
    name: "message/sent",
    data: {
      messageId: assistantMessageId,
      conversationId,
      projectId,
      message,
      model: selectedModel,
    },
  });

  // If Inngest dev server was bypassed (e.g. Device Guard blocked inngest.exe or server is offline),
  // execute directly in the background so the user is never stuck waiting!
  if (event.ids.includes("bypass-no-inngest-server")) {
    executeProcessMessage({
      messageId: assistantMessageId,
      conversationId,
      projectId,
      message,
      model: selectedModel,
    }).catch((err) => {
      console.error("[ai-chat] Direct execution error:", err);
    });
  }

  return NextResponse.json({
    success: true,
    eventId: event.ids[0],
    messageId: assistantMessageId,
  });
}
