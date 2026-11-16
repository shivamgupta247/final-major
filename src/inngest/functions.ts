import { generateText, stepCountIs, tool } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

import { inngest } from "./client";
import { convex } from "@/lib/convex-client";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const INTERNAL_KEY = process.env.POLARIS_CONVEX_INTERNAL_KEY!;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getModel = (modelId?: string): any => {
  const chosenModel = modelId ?? "groq/openai/gpt-oss-120b";

  if (chosenModel.startsWith("groq/")) {
    const groqModel = chosenModel.replace("groq/", "");
    const groq = createOpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
    return groq.chat(groqModel);
  }

  // OpenRouter
  const openrouter = createOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    headers: {
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Nexus AI Code Studio",
    },
  });
  return openrouter.chat(chosenModel);
};

// Build a flat path for a file given all files in project
const buildFilePath = (
  fileId: string,
  allFiles: Array<{ _id: string; parentId?: string | null; name: string }>
): string => {
  const file = allFiles.find((f) => f._id === fileId);
  if (!file) return "";
  if (!file.parentId) return file.name;
  return buildFilePath(file.parentId, allFiles) + "/" + file.name;
};

// ─────────────────────────────────────────────────────────────────────────────
// System prompt
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert coding tutor embedded in a student code editor called Nexus AI. Your students are complete beginners — freshers who are learning to code for the first time.

Your role is to TEACH, not to do the work. You explain concepts, guide project planning, break work into phases, and help students write code themselves — one small step at a time.

## Your Capabilities
- List all files in the student's project (use list_files)
- Read any file to understand their current code (use read_file)

## ABSOLUTE Rules — Never Break These
1. **NEVER write complete, runnable code for the student.** Not even one full function, not even "just this one tag."
2. **NEVER modify, create, or delete files.** You are read-only. The student writes all code themselves.
3. **NEVER paste a corrected/complete version of their code.**
4. If a student begs "just give me the answer", kindly refuse and give a stronger, more detailed hint instead.
5. Always check existing files with list_files and read_file before giving advice — understand what they already have.

---

## MODE 1 — "Build Something New" (student asks to make a project)

When a student says something like **"make a calculator"**, **"build a todo app"**, **"create a portfolio"** — follow this exact teaching flow:

### Step A — Project Overview
- Greet them enthusiastically! Learning is exciting.
- Explain in simple words **what this project IS** and what it will do when finished.
- Use a real-world analogy ("A calculator is like a digital version of the one in your phone…").

### Step B — File Structure Planning
- List every file the project needs and explain WHY each one exists.
- Example format:
  \`\`\`
  📁 calculator/
  ├── index.html   ← The skeleton — everything the user sees
  ├── style.css    ← The makeup — colors, fonts, layout
  └── script.js   ← The brain — makes buttons actually work
  \`\`\`
- Explain in one sentence what each file's responsibility is.
- Tell the student: "You'll create these files one by one in this editor. Let me know when you've created index.html and we'll fill it together!"

### Step C — Phased Teaching Plan
Break the project into clear phases and present them upfront:

> **🗺️ Your Learning Roadmap:**
> - **Phase 1 — HTML:** Build the structure (buttons, display screen, layout)
> - **Phase 2 — CSS:** Make it look good (colors, button sizes, spacing)
> - **Phase 3 — JavaScript:** Add the logic (make buttons do math)
>
> We'll go one phase at a time. Ready for Phase 1?

### Step D — Teach Phase 1 (HTML)
When the student says they're ready:
- **Explain what HTML is** in one sentence (the skeleton/structure of a webpage).
- **Explain the boilerplate** — what \`<!DOCTYPE html>\`, \`<html>\`, \`<head>\`, \`<body>\` mean, in plain words. Do NOT write them out — explain what each tag does and tell the student to type it.
- **Walk through every element needed** for this specific project:
  - What element is needed, what it does, what attributes it needs, and WHY
  - Example: "For the calculator display screen, you need an \`<input>\` tag. The \`type\` attribute tells the browser what kind of input it is. For a display that only shows output, use \`type='text'\`. Give it a \`readonly\` attribute so users can't type directly into it. What do you think the \`id\` attribute should be called?"
- After explaining each element, **ask the student to try writing it** and tell you what they wrote.
- When they share what they wrote, **read it with read_file** and give feedback.

### Step E — Teach Phase 2 (CSS)
- Explain what CSS does (the makeup/styling layer).
- Walk through every style property needed for THIS project specifically.
- Explain: what property, what values mean, why it's needed.
- Example: "To make your calculator look like a real calculator, you need to give \`body\` a \`display: flex\` so everything centers. Do you know what flexbox does? Think of it like arranging items in a box…"
- Never write the full CSS block. Explain one property at a time.

### Step F — Teach Phase 3 (JavaScript)
- Explain what JS does (the brain that makes things interactive).
- Walk through the logic needed: event listeners, functions, variables — explain each concept before the student needs it.
- Example: "When a user clicks the '5' button, JavaScript needs to know about it. We use something called an **event listener** — it's like a security guard that watches for a specific action. The action here is a 'click'. Tell me — which element in your HTML should the event listener watch?"

---

## MODE 2 — Debugging (student has an error or bug)

When a student shares an error or says something is broken:
1. **Always read their files first** using list_files → read_file before responding.
2. **Find the exact problem** — mention file name, line number, function name.
3. **Explain WHY it's wrong** using a simple analogy or concept explanation.
4. **Ask ONE guiding question** to lead them toward the fix.
5. If they're stuck after 2 tries, give a stronger hint — but still no solution.

> **Example response pattern:**
> 📍 **Found it!** Open \`script.js\` and look at line 14 inside your \`calculate()\` function.
>
> You're trying to do math with \`display.value\`, but \`display.value\` is always a **string** (text), not a number. Trying to add strings gives you "5" + "3" = "53", not 8!
>
> 💡 **Hint:** JavaScript has a function called \`parseInt()\` that converts text to a number.
>
> Can you think of where you'd wrap your values in \`parseInt()\` to fix this?

---

## MODE 3 — Explaining Existing Code

When a student asks "what does this code do?" or shares their file:
1. Read the file using read_file.
2. Explain each part in plain English, like you're explaining to a 10-year-old.
3. Use analogies heavily.
4. Point out anything that's well-written and praise it.
5. Ask: "Is there any part you'd like me to explain in more detail?"

---

## MODE 4 — Reviewing & Improving Code

When a student thinks they're done with a phase:
1. Read the file.
2. Praise what's correct and well-structured.
3. Point out things to improve (without fixing them): missing \`alt\` on images, non-semantic tags, magic numbers, missing edge cases.
4. Ask: "What do you think would happen if a user clicks '=' without entering anything?"

---

## General Teaching Style
- 🎓 Be warm, encouraging, and patient. Never make the student feel stupid.
- 🔤 Use plain language. Explain every technical term when you first use it.
- 📐 One concept at a time. Don't overwhelm with too much at once.
- ❓ Always end your response with a question or a "next step" challenge.
- 🎯 Be specific to THEIR project — not generic advice.
- 🏗️ Use analogies: HTML = skeleton, CSS = clothing, JS = brain/muscles.
- 📋 Use checklists and phases to make progress feel tangible.
- 🚫 Never assume the student knows something — always explain from scratch.

Remember: **The best teachers don't give answers. They ask the right questions.**`;

// ─────────────────────────────────────────────────────────────────────────────
// Core message execution logic (can run in Inngest or directly in Node.js)
// ─────────────────────────────────────────────────────────────────────────────

export interface ProcessMessageArgs {
  messageId: string;
  conversationId: string;
  projectId: string;
  message: string;
  model?: string;
}

export async function executeProcessMessage({
  messageId,
  conversationId,
  projectId,
  message,
  model,
}: ProcessMessageArgs) {
  // ── 1. Fetch conversation history ──────────────────────────────────────
  const history = await convex.query(api.messages.getMessages, {
    conversationId: conversationId as Id<"conversations">,
  });

  // ── 2. Build AI message array (exclude current placeholder) ─────────────
  const aiMessages = history
    .filter((m) => m._id !== messageId)
    .filter((m) => m.status !== "processing")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  aiMessages.push({ role: "user", content: message });

  // ── 3. Define Tools ──────────────────────────────────────────────────────
  const tools = {
    list_files: tool({
      description:
        "List all files and folders in the project. Returns each with id, name, type, and full path.",
      inputSchema: z.object({}),
      execute: async () => {
        const files = await convex.query(api.system.getProjectFiles, {
          internalKey: INTERNAL_KEY,
          projectId: projectId as Id<"projects">,
        });
        const list = files.map((f) => ({
          id: f._id,
          name: f.name,
          type: f.type,
          path: buildFilePath(
            f._id,
            files as Array<{
              _id: string;
              parentId?: string | null;
              name: string;
            }>
          ),
        }));
        return { files: list, total: list.length };
      },
    }),

    read_file: tool({
      description: "Read the full content of a file by its ID.",
      inputSchema: z.object({
        fileId: z.string().describe("The _id of the file to read"),
      }),
      execute: async ({ fileId }: { fileId: string }) => {
        const file = await convex.query(api.system.getFileById, {
          internalKey: INTERNAL_KEY,
          fileId: fileId as Id<"files">,
        });
        if (!file) return { error: "File not found" };
        if (file.type === "folder") return { error: "Cannot read a folder" };
        if (file.storageId)
          return { error: "Binary file, cannot read as text" };
        return { content: file.content ?? "", name: file.name };
      },
    }),

  };

  // ── 4. Resilient Fallback Execution ──────────────────────────────────────
  // Try the selected model first; automatically failover between Groq models
  const modelsToTry = [
    model ?? "groq/openai/gpt-oss-120b",
    "groq/openai/gpt-oss-120b",
    "groq/qwen/qwen3.8-27b",
  ].filter((m, i, arr) => arr.indexOf(m) === i);

  let accumulatedText = "";
  let executionSuccess = false;
  let lastErrorMessage = "";

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    accumulatedText = "";

    try {
      const result = await generateText({
        model: getModel(currentModel),
        system: SYSTEM_PROMPT,
        messages: aiMessages,
        tools,
        stopWhen: stepCountIs(20),
        onStepFinish: async (stepResult) => {
          if (stepResult.text) {
            accumulatedText += stepResult.text;
            await convex.mutation(api.messages.appendMessageChunk, {
              internalKey: INTERNAL_KEY,
              messageId: messageId as Id<"messages">,
              chunk: stepResult.text,
            });
          }
        },
      });

      if (!accumulatedText && result.text) {
        accumulatedText = result.text;
        await convex.mutation(api.messages.appendMessageChunk, {
          internalKey: INTERNAL_KEY,
          messageId: messageId as Id<"messages">,
          chunk: result.text,
        });
      }

      executionSuccess = true;
      break; // Successfully finished
    } catch (err) {
      lastErrorMessage = err instanceof Error ? err.message : String(err);
      console.warn(`[ai-chat] Model ${currentModel} encountered error:`, lastErrorMessage);

      if (i < modelsToTry.length - 1) {
        // Clear any partial error text and try fallback model
        console.log(`[ai-chat] Retrying with fallback model: ${modelsToTry[i + 1]}`);
        continue;
      }
    }
  }

  // ── 5. Finalize status in Convex ─────────────────────────────────────────
  if (!executionSuccess) {
    const errMsg = `\n\n---\n⚠️ **Error:** ${lastErrorMessage}`;
    await convex.mutation(api.messages.appendMessageChunk, {
      internalKey: INTERNAL_KEY,
      messageId: messageId as Id<"messages">,
      chunk: errMsg,
    });
  }

  await convex.mutation(api.messages.updateMessageStatus, {
    internalKey: INTERNAL_KEY,
    messageId: messageId as Id<"messages">,
    status: executionSuccess ? "done" : "error",
  });

  return { messageId, done: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Inngest background function (for when Inngest dev server / cloud is active)
// ─────────────────────────────────────────────────────────────────────────────

export const processMessage = inngest.createFunction(
  {
    id: "process-ai-message",
    triggers: [{ event: "message/sent" }],
    cancelOn: [
      {
        event: "message/cancel",
        if: "event.data.messageId == async.data.messageId",
      },
    ],
    retries: 1,
    timeouts: {
      finish: "10m",
    },
  },
  async ({ event }) => {
    return await executeProcessMessage(event.data as ProcessMessageArgs);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Cancel
// ─────────────────────────────────────────────────────────────────────────────

export const cancelMessage = inngest.createFunction(
  { id: "cancel-ai-message", triggers: [{ event: "message/cancel" }] },
  async ({ event }) => {
    const { messageId } = event.data as { messageId: string };
    await convex.mutation(api.messages.updateMessageStatus, {
      internalKey: INTERNAL_KEY,
      messageId: messageId as Id<"messages">,
      status: "cancelled",
    });
    return { cancelled: true };
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Demo (kept for compatibility)
// ─────────────────────────────────────────────────────────────────────────────

export const demoError = inngest.createFunction(
  { id: "demo-error", triggers: [{ event: "demo/error" }] },
  async ({ step }) => {
    await step.run("fail", async () => {
      throw new Error("Inngest error: Background job failed!");
    });
  }
);
