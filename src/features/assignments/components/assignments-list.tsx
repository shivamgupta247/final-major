"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BugIcon,
  SearchIcon,
  ClockIcon,
  TrophyIcon,
  ArrowLeftIcon,
  FilterIcon,
} from "lucide-react";
import { Poppins } from "next/font/google";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { ASSIGNMENTS, type Assignment } from "@/lib/assignments-data";
import { api } from "../../../../convex/_generated/api";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ─── Assignment Card ──────────────────────────────────────────────────────────

const AssignmentCard = ({
  assignment,
  bestScore,
}: {
  assignment: Assignment;
  bestScore?: number | null;
}) => {
  const router = useRouter();
  const isCompleted = bestScore !== undefined && bestScore !== null;
  const scorePercent = isCompleted
    ? Math.round((bestScore / assignment.maxScore) * 100)
    : 0;

  return (
    <button
      onClick={() => router.push(`/assignments/${assignment.id}`)}
      className={cn(
        "w-full text-left p-5 rounded-xl border transition-all hover:shadow-md cursor-pointer",
        "bg-background hover:bg-accent/50",
        isCompleted && scorePercent >= 80 && "border-green-500/30 bg-green-500/5"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {assignment.type === "bug-fix" ? (
            <BugIcon className="size-5 text-red-500 shrink-0" />
          ) : (
            <SearchIcon className="size-5 text-blue-500 shrink-0" />
          )}
          <h3 className="font-semibold text-sm leading-tight">
            {assignment.title}
          </h3>
        </div>
        {isCompleted && (
          <div className="flex items-center gap-1 shrink-0">
            <TrophyIcon
              className={cn(
                "size-4",
                scorePercent >= 80
                  ? "text-yellow-500"
                  : scorePercent >= 50
                    ? "text-gray-400"
                    : "text-orange-400"
              )}
            />
            <span className="text-xs font-bold">
              {bestScore}/{assignment.maxScore}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {assignment.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 flex-wrap">
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-medium",
            assignment.difficulty === "beginner" &&
              "border-green-500/50 text-green-600",
            assignment.difficulty === "intermediate" &&
              "border-yellow-500/50 text-yellow-600",
            assignment.difficulty === "advanced" &&
              "border-red-500/50 text-red-600"
          )}
        >
          {assignment.difficulty}
        </Badge>
        <Badge variant="outline" className="text-[10px] font-medium">
          {assignment.type === "bug-fix" ? "🐛 Bug Fix" : "🔍 Code Review"}
        </Badge>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <ClockIcon className="size-3" />
          {assignment.estimatedTime}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {assignment.language}
        </span>
      </div>

      {/* Progress bar for completed */}
      {isCompleted && (
        <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              scorePercent >= 80
                ? "bg-green-500"
                : scorePercent >= 50
                  ? "bg-yellow-500"
                  : "bg-orange-500"
            )}
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      )}
    </button>
  );
};

// ─── Main Assignments List ────────────────────────────────────────────────────

export const AssignmentsList = () => {
  const { user } = useUser();
  const [filter, setFilter] = useState<"all" | "bug-fix" | "code-review">(
    "all"
  );
  const [diffFilter, setDiffFilter] = useState<
    "all" | "beginner" | "intermediate" | "advanced"
  >("all");

  const submissions = useQuery(
    api.assignments.getUserSubmissions,
    user?.id ? { userId: user.id } : "skip"
  );

  const getBestScore = (assignmentId: string): number | null => {
    if (!submissions) return null;
    const matching = submissions.filter(
      (s) =>
        s.assignmentId === assignmentId && s.status === "completed"
    );
    if (matching.length === 0) return null;
    return Math.max(...matching.map((s) => s.score ?? 0));
  };

  const filtered = ASSIGNMENTS.filter((a) => {
    if (filter !== "all" && a.type !== filter) return false;
    if (diffFilter !== "all" && a.difficulty !== diffFilter) return false;
    return true;
  });

  const totalCompleted = ASSIGNMENTS.filter(
    (a) => getBestScore(a.id) !== null
  ).length;

  return (
    <div className="min-h-screen bg-sidebar flex flex-col items-center p-6 md:p-12">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="size-8">
              <Link href="/">
                <ArrowLeftIcon className="size-4" />
              </Link>
            </Button>
            <div>
              <h1
                className={cn("text-2xl md:text-3xl font-bold", font.className)}
              >
                📋 Assignments
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Debug, review, and learn — one challenge at a time
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-background rounded-lg p-3 border text-center">
            <p className="text-2xl font-bold">{ASSIGNMENTS.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="bg-background rounded-lg p-3 border text-center">
            <p className="text-2xl font-bold text-green-500">
              {totalCompleted}
            </p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="bg-background rounded-lg p-3 border text-center">
            <p className="text-2xl font-bold text-yellow-500">
              {ASSIGNMENTS.length - totalCompleted}
            </p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <FilterIcon className="size-4 text-muted-foreground" />
          <div className="flex gap-1">
            {(["all", "bug-fix", "code-review"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setFilter(f)}
              >
                {f === "all"
                  ? "All"
                  : f === "bug-fix"
                    ? "🐛 Bug Fix"
                    : "🔍 Review"}
              </Button>
            ))}
          </div>
          <div className="w-px h-5 bg-border mx-1" />
          <div className="flex gap-1">
            {(["all", "beginner", "intermediate", "advanced"] as const).map(
              (d) => (
                <Button
                  key={d}
                  variant={diffFilter === d ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setDiffFilter(d)}
                >
                  {d === "all" ? "All Levels" : d}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Assignment Cards */}
        <div className="flex flex-col gap-3">
          {filtered.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              bestScore={getBestScore(assignment.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No assignments match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
