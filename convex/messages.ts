import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ─────────────────────────────────────────────────────────────────────────────
// Conversations
// ─────────────────────────────────────────────────────────────────────────────

export const getOrCreateConversation = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    // Return the most-recent conversation for this project, or create one
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("conversations", {
      projectId: args.projectId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});

export const getProjectConversation = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .first();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Messages — client-facing queries / mutations
// ─────────────────────────────────────────────────────────────────────────────

export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();
  },
});

export const createUserMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    projectId: v.id("projects"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      projectId: args.projectId,
      role: "user",
      content: args.content,
      status: "done",
      createdAt: Date.now(),
    });

    // Touch conversation updatedAt
    await ctx.db.patch(args.conversationId, { updatedAt: Date.now() });

    return id;
  },
});

export const createAssistantPlaceholder = mutation({
  args: {
    conversationId: v.id("conversations"),
    projectId: v.id("projects"),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      projectId: args.projectId,
      role: "assistant",
      content: "",
      status: "processing",
      model: args.model,
      createdAt: Date.now(),
    });
  },
});

export const clearConversation = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const msgs = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();
    for (const msg of msgs) {
      await ctx.db.delete(msg._id);
    }
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Internal mutations called by Inngest (via convex-client / system key)
// ─────────────────────────────────────────────────────────────────────────────

const validateInternalKey = (key: string) => {
  const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;
  if (!internalKey) throw new Error("POLARIS_CONVEX_INTERNAL_KEY not set");
  if (key !== internalKey) throw new Error("Invalid internal key");
};

export const getConversationById = query({
  args: {
    internalKey: v.string(),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);
    return await ctx.db.get(args.conversationId);
  },
});

export const getProcessingMessages = query({
  args: {
    internalKey: v.string(),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);
    return await ctx.db
      .query("messages")
      .withIndex("by_project_status", (q) =>
        q.eq("projectId", args.projectId).eq("status", "processing")
      )
      .collect();
  },
});

export const appendMessageChunk = mutation({
  args: {
    internalKey: v.string(),
    messageId: v.id("messages"),
    chunk: v.string(),
  },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);
    const msg = await ctx.db.get(args.messageId);
    if (!msg) throw new Error("Message not found");
    await ctx.db.patch(args.messageId, {
      content: msg.content + args.chunk,
    });
  },
});

export const updateMessageStatus = mutation({
  args: {
    internalKey: v.string(),
    messageId: v.id("messages"),
    status: v.union(
      v.literal("processing"),
      v.literal("done"),
      v.literal("completed"),
      v.literal("error"),
      v.literal("cancelled")
    ),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);
    await ctx.db.patch(args.messageId, {
      status: args.status,
      ...(args.content !== undefined ? { content: args.content } : {}),
    });
  },
});

export const createMessage = mutation({
  args: {
    internalKey: v.string(),
    conversationId: v.id("conversations"),
    projectId: v.id("projects"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    status: v.optional(
      v.union(
        v.literal("processing"),
        v.literal("done"),
        v.literal("completed"),
        v.literal("error"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);
    return await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      projectId: args.projectId,
      role: args.role,
      content: args.content,
      status: args.status ?? "done",
      createdAt: Date.now(),
    });
  },
});
