import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─────────────────────────────────────────────────────────────────────────────
// Submissions
// ─────────────────────────────────────────────────────────────────────────────

export const createSubmission = mutation({
  args: {
    assignmentId: v.string(),
    userId: v.string(),
    maxScore: v.number(),
    hintsUsed: v.optional(v.number()),
    penalty: v.optional(v.number()),
    submittedFiles: v.array(
      v.object({
        name: v.string(),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("submissions", {
      assignmentId: args.assignmentId,
      userId: args.userId,
      maxScore: args.maxScore,
      hintsUsed: args.hintsUsed ?? 0,
      penalty: args.penalty ?? 0,
      submittedFiles: args.submittedFiles,
      status: "evaluating",
      createdAt: Date.now(),
    });
  },
});

export const updateSubmission = mutation({
  args: {
    submissionId: v.id("submissions"),
    score: v.number(),
    feedback: v.string(),
    status: v.union(
      v.literal("evaluating"),
      v.literal("completed"),
      v.literal("error")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, {
      score: args.score,
      feedback: args.feedback,
      status: args.status,
    });
  },
});

export const getSubmission = query({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.submissionId);
  },
});

export const getUserSubmissions = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getBestSubmission = query({
  args: {
    assignmentId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_assignment_user", (q) =>
        q.eq("assignmentId", args.assignmentId).eq("userId", args.userId)
      )
      .order("desc")
      .collect();

    if (submissions.length === 0) return null;

    // Return the one with the highest score
    const completed = submissions.filter((s) => s.status === "completed");
    if (completed.length === 0) return submissions[0]; // return latest evaluating

    return completed.reduce((best, s) =>
      (s.score ?? 0) > (best.score ?? 0) ? s : best
    );
  },
});
