"use client";

import {
  TrophyIcon,
  XIcon,
  PartyPopperIcon,
  TargetIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubmissionResultProps {
  score: number;
  maxScore: number;
  feedback: string;
  onClose: () => void;
}

export const SubmissionResult = ({
  score,
  maxScore,
  feedback,
  onClose,
}: SubmissionResultProps) => {
  const percent = Math.round((score / maxScore) * 100);

  const grade =
    percent >= 90
      ? { label: "Outstanding! 🌟", color: "text-green-500", bg: "bg-green-500" }
      : percent >= 70
        ? { label: "Great Job! 🎉", color: "text-blue-500", bg: "bg-blue-500" }
        : percent >= 50
          ? { label: "Good Effort! 👍", color: "text-yellow-500", bg: "bg-yellow-500" }
          : { label: "Keep Trying! 💪", color: "text-orange-500", bg: "bg-orange-500" };

  return (
    <div className="h-full border rounded-lg overflow-hidden bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-sidebar border-b shrink-0">
        <div className="flex items-center gap-2">
          <TrophyIcon className={cn("size-4", grade.color)} />
          <span className="text-sm font-semibold">Results</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={onClose}
        >
          <XIcon className="size-3.5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Score display */}
        <div className="flex items-center gap-4">
          {/* Circular score */}
          <div className="relative size-20 shrink-0">
            <svg className="size-20 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="currentColor"
                className="text-muted/30"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="currentColor"
                className={grade.color}
                strokeWidth="6"
                strokeDasharray={`${(percent / 100) * 213.6} 213.6`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn("text-lg font-bold", grade.color)}>
                {score}/{maxScore}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              {percent >= 70 ? (
                <PartyPopperIcon className={cn("size-5", grade.color)} />
              ) : (
                <TargetIcon className={cn("size-5", grade.color)} />
              )}
              <h3 className={cn("text-lg font-bold", grade.color)}>
                {grade.label}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              You scored {percent}% — {percent >= 70
                ? "well done!"
                : "review the feedback below and try again!"}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", grade.bg)}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Feedback */}
        <div className="space-y-2">
          {feedback.split("\n").map((line, i) => {
            if (line.startsWith("## "))
              return (
                <h2
                  key={i}
                  className="text-sm font-bold mt-3 mb-1 border-b pb-1"
                >
                  {line.replace("## ", "")}
                </h2>
              );
            if (line.startsWith("### "))
              return (
                <h3 key={i} className="text-xs font-semibold mt-2 mb-1">
                  {line.replace("### ", "")}
                </h3>
              );
            if (line.startsWith("✅"))
              return (
                <p
                  key={i}
                  className="text-xs text-green-600 dark:text-green-400 flex items-start gap-1"
                >
                  <span className="shrink-0">✅</span>
                  <span>{line.replace("✅ ", "")}</span>
                </p>
              );
            if (line.startsWith("❌"))
              return (
                <p
                  key={i}
                  className="text-xs text-red-500 flex items-start gap-1"
                >
                  <span className="shrink-0">❌</span>
                  <span>{line.replace("❌ ", "")}</span>
                </p>
              );
            if (line.trim().startsWith("   "))
              return (
                <p
                  key={i}
                  className="text-xs text-muted-foreground ml-6"
                >
                  {line.trim()}
                </p>
              );
            if (line.trim() === "") return <div key={i} className="h-1" />;
            return (
              <p key={i} className="text-xs">
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};
