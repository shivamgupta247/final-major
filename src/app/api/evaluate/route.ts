import { NextResponse } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { getAssignment } from "@/lib/assignments-data";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function getModel(modelName: string = "openai/gpt-oss-120b") {
  const groq = createOpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });
  return groq.chat(modelName);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      assignmentId,
      submissionId,
      submittedFiles,
      hintsUsed = 0,
      penalty = 0,
    }: {
      assignmentId: string;
      submissionId: string;
      submittedFiles: { name: string; content: string }[];
      hintsUsed?: number;
      penalty?: number;
    } = body;

    const assignment = getAssignment(assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Build evaluation prompt
    const evaluationPrompt = buildEvaluationPrompt(
      assignment,
      submittedFiles
    );

    // Call Groq for evaluation (with fallback)
    const modelsToTry = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b"];
    let text = "";
    let evalError: unknown = null;

    for (const modelId of modelsToTry) {
      try {
        const response = await generateText({
          model: getModel(modelId),
          system: `You are a strict but fair coding assignment evaluator. You evaluate student code submissions and provide scores and detailed feedback.

IMPORTANT: Respond ONLY with valid JSON in this exact format — no markdown, no code fences, no extra text:
{
  "score": <number 0-${assignment.maxScore}>,
  "feedback": "<overall feedback string>",
  "details": [
    {
      "criterion": "<what was checked>",
      "passed": <true/false>,
      "comment": "<explanation>"
    }
  ]
}`,
          prompt: evaluationPrompt,
        });
        text = response.text;
        evalError = null;
        break;
      } catch (err) {
        evalError = err;
        console.warn(`[evaluate] Model ${modelId} failed:`, err);
      }
    }

    if (!text && evalError) {
      throw evalError;
    }

    // Parse the AI response
    let evaluation: {
      score: number;
      feedback: string;
      details: { criterion: string; passed: boolean; comment: string }[];
    };

    let submissionIdToUpdate = submissionId;
    try {
      const cleanText = text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/gi, "")
        .trim();
      evaluation = JSON.parse(cleanText);
    } catch {
      // Regex extraction fallback if JSON parsing directly fails
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          evaluation = JSON.parse(jsonMatch[0]);
        } catch {
          evaluation = {
            score: 0,
            feedback: "Evaluation could not parse output. Please retry your submission.",
            details: [],
          };
        }
      } else {
        evaluation = {
          score: 0,
          feedback: "Evaluation completed with unparseable format. Please retry.",
          details: [],
        };
      }
    }

    // Ensure raw score is within bounds
    const rawScore = Math.max(
      0,
      Math.min(assignment.maxScore, Math.round(evaluation.score))
    );

    // Apply hint penalty (if any)
    const finalScore = Math.max(0, Math.round((rawScore - penalty) * 10) / 10);
    evaluation.score = finalScore;

    // Build formatted feedback
    const formattedFeedback = formatFeedback(evaluation, rawScore, penalty, hintsUsed);

    // Update submission in Convex
    await convex.mutation(api.assignments.updateSubmission, {
      submissionId: submissionId as Id<"submissions">,
      score: finalScore,
      feedback: formattedFeedback,
      status: "completed",
    });

    return NextResponse.json({
      score: finalScore,
      rawScore,
      penalty,
      hintsUsed,
      maxScore: assignment.maxScore,
      feedback: formattedFeedback,
    });
  } catch (error) {
    console.error("[evaluate] Error:", error);

    // Try to update submission as error if submissionId was provided
    try {
      const body = await req.clone().json();
      if (body.submissionId) {
        await convex.mutation(api.assignments.updateSubmission, {
          submissionId: body.submissionId as Id<"submissions">,
          score: 0,
          feedback: "❌ Evaluation failed. Please try submitting again.",
          status: "error",
        });
      }
    } catch {
      // Ignore secondary errors
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Evaluation failed",
      },
      { status: 500 }
    );
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildEvaluationPrompt(
  assignment: NonNullable<ReturnType<typeof getAssignment>>,
  submittedFiles: { name: string; content: string }[]
): string {
  const originalFiles = assignment.files
    .map((f) => `--- ORIGINAL ${f.name} ---\n${f.content}`)
    .join("\n\n");

  const studentFiles = submittedFiles
    .map((f) => `--- STUDENT'S ${f.name} ---\n${f.content}`)
    .join("\n\n");

  const criteria = assignment.evaluationCriteria
    .map((c, i) => `${i + 1}. ${c}`)
    .join("\n");

  return `## Assignment: ${assignment.title}
Type: ${assignment.type}
Max Score: ${assignment.maxScore}

## Instructions Given to Student:
${assignment.instructions}

## Evaluation Criteria (check each):
${criteria}

## Original Code (with bugs/issues):
${originalFiles}

## Student's Submitted Code:
${studentFiles}

## Your Task:
1. Compare the student's code against the ORIGINAL buggy code.
2. Check each evaluation criterion — did the student fix/identify it?
3. For code-review type assignments, check the review.txt file for the student's written analysis.
4. Award points based on how many criteria are met.
5. Be encouraging but honest in feedback.
6. Score: Each criterion met = ${(assignment.maxScore / assignment.evaluationCriteria.length).toFixed(1)} points.`;
}

function formatFeedback(
  evaluation: {
    score: number;
    feedback: string;
    details: { criterion: string; passed: boolean; comment: string }[];
  },
  rawScore?: number,
  penalty: number = 0,
  hintsUsed: number = 0
): string {
  let fb = `## 📊 Evaluation Results\n\n`;

  if (penalty > 0) {
    fb += `> 💡 **Hints Penalty Applied:** Used ${hintsUsed} hint${hintsUsed > 1 ? "s" : ""} (-${penalty} pts). Raw: ${rawScore} pts → Final: ${evaluation.score} pts.\n\n`;
  }

  fb += `${evaluation.feedback}\n\n`;
  fb += `### Detailed Breakdown:\n\n`;

  for (const detail of evaluation.details) {
    const icon = detail.passed ? "✅" : "❌";
    fb += `${icon} **${detail.criterion}**\n`;
    fb += `   ${detail.comment}\n\n`;
  }

  return fb;
}
