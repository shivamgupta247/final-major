import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    ownerId: v.string(),
    updatedAt: v.number(),
    importStatus: v.optional(
      v.union(
        v.literal("importing"),
        v.literal("completed"),
        v.literal("failed"),
      ),
    ),
    exportStatus: v.optional(
      v.union(
        v.literal("exporting"),
        v.literal("completed"),
        v.literal("failed"),
        v.literal("cancelled"),
      ),
    ),
    exportRepoUrl: v.optional(v.string()),
    settings: v.optional(
      v.object({
        installCommand: v.optional(v.string()),
        devCommand: v.optional(v.string()),
        rootDirectory: v.optional(v.string()),
      })
    ),
  }).index("by_owner", ["ownerId"]),

  files: defineTable({
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string(),
    type: v.union(v.literal("file"), v.literal("folder")),
    content: v.optional(v.string()), // Text files only
    storageId: v.optional(v.id("_storage")), // Binary files only
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_parent", ["parentId"])
    .index("by_project_parent", ["projectId", "parentId"]),

  conversations: defineTable({
    projectId: v.id("projects"),
    title: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("by_project", ["projectId"]),

  messages: defineTable({
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
        v.literal("cancelled"),
      )
    ),
    model: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_project", ["projectId"])
    .index("by_project_status", ["projectId", "status"]),

  submissions: defineTable({
    assignmentId: v.string(),
    userId: v.string(),
    score: v.optional(v.number()),
    maxScore: v.number(),
    feedback: v.optional(v.string()),
    hintsUsed: v.optional(v.number()),
    penalty: v.optional(v.number()),
    submittedFiles: v.array(
      v.object({
        name: v.string(),
        content: v.string(),
      })
    ),
    status: v.union(
      v.literal("evaluating"),
      v.literal("completed"),
      v.literal("error")
    ),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_assignment_user", ["assignmentId", "userId"]),
});
