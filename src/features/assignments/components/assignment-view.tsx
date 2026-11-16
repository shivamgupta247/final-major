"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  SendIcon,
  LoaderIcon,
  LightbulbIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FileIcon,
  BookOpenIcon,
  PlayIcon,
  CodeIcon,
  RotateCcwIcon,
  ColumnsIcon,
  CheckCircle2Icon,
  EyeIcon,
  XIcon,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAssignment } from "@/lib/assignments-data";
import { api } from "../../../../convex/_generated/api";
import { SubmissionResult } from "./submission-result";

// ─── Helper to bundle HTML, CSS, JS into an iframe preview document ──────────

function generatePreviewDoc(files: { name: string; content: string }[]) {
  const htmlFile = files.find((f) => f.name.endsWith(".html"));
  const cssFile = files.find((f) => f.name.endsWith(".css"));
  const jsFile = files.find((f) => f.name.endsWith(".js"));

  let html = htmlFile?.content || "<p style='font-family:sans-serif;padding:20px;color:#888'>No HTML file found.</p>";

  // Inject or append CSS
  if (cssFile && cssFile.content.trim()) {
    const styleTag = `<style>\n${cssFile.content}\n</style>`;
    if (html.includes("</head>")) {
      html = html.replace("</head>", `${styleTag}\n</head>`);
    } else {
      html = `${styleTag}\n${html}`;
    }
  }

  // Inject JS before </body> or at bottom
  if (jsFile && jsFile.content.trim()) {
    const scriptTag = `<script>\ntry {\n${jsFile.content}\n} catch (err) { console.error(err); }\n</script>`;
    if (html.includes("</body>")) {
      html = html.replace("</body>", `${scriptTag}\n</body>`);
    } else {
      html = `${html}\n${scriptTag}`;
    }
  }

  return html;
}

// ─── Live Preview Component ──────────────────────────────────────────────────

const LivePreviewPanel = ({
  files,
  previewKey,
  onRefresh,
}: {
  files: { name: string; content: string }[];
  previewKey: number;
  onRefresh: () => void;
}) => {
  const previewDoc = useMemo(() => generatePreviewDoc(files), [files, previewKey]);

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      <div className="flex items-center justify-between px-3 py-1.5 bg-sidebar border-b">
        <div className="flex items-center gap-2">
          <PlayIcon className="size-3.5 text-green-500 fill-green-500" />
          <span className="text-xs font-semibold">Interactive Output</span>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            (Live test your clicks & changes here)
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-[11px] gap-1 px-2"
          onClick={onRefresh}
        >
          <RotateCcwIcon className="size-3" />
          Reload Preview
        </Button>
      </div>
      <div className="flex-1 bg-white relative">
        <iframe
          key={previewKey}
          title="Assignment Live Preview"
          srcDoc={previewDoc}
          sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
};

// ─── Code Editor Panel ────────────────────────────────────────────────────────

const CodeEditorPanel = ({
  files,
  onFileChange,
}: {
  files: { name: string; content: string }[];
  onFileChange: (index: number, content: string) => void;
}) => {
  const [activeFile, setActiveFile] = useState(0);

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      {/* File tabs */}
      <div className="flex items-center bg-sidebar border-b overflow-x-auto">
        {files.map((file, i) => (
          <button
            key={file.name}
            onClick={() => setActiveFile(i)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-r transition-colors whitespace-nowrap cursor-pointer",
              activeFile === i
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <FileIcon className="size-3" />
            {file.name}
          </button>
        ))}
      </div>

      {/* Code textarea */}
      <div className="flex-1 relative">
        <textarea
          value={files[activeFile]?.content ?? ""}
          onChange={(e) => onFileChange(activeFile, e.target.value)}
          className="w-full h-full p-4 font-mono text-xs md:text-sm bg-[#1e1e1e] text-[#d4d4d4] resize-none outline-none leading-relaxed selection:bg-blue-600/40"
          spellCheck={false}
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
};

// ─── Instructions Panel (With Gradual Hint Unlocking & Penalties) ─────────────

const InstructionsPanel = ({
  assignment,
  unlockedHints,
  onUnlockHint,
}: {
  assignment: NonNullable<ReturnType<typeof getAssignment>>;
  unlockedHints: number[];
  onUnlockHint: (hintIndex: number) => void;
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      <div className="flex items-center gap-2 px-4 py-2 bg-sidebar border-b shrink-0">
        <BookOpenIcon className="size-4 text-primary" />
        <span className="text-sm font-semibold">Instructions & Rules</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Assignment info */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
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
          <Badge variant="outline" className="text-xs">
            {assignment.type === "bug-fix" ? "🐛 Bug Fix" : "🔍 Code Review"}
          </Badge>
          {assignment.bugCount && (
            <Badge variant="outline" className="text-xs">
              {assignment.bugCount} bugs to find
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            Max: {assignment.maxScore} pts
          </Badge>
        </div>

        {/* Instructions markdown-ish content */}
        <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
          {assignment.instructions.split("\n").map((line, i) => {
            if (line.startsWith("## "))
              return (
                <h2 key={i} className="text-base font-bold mt-4 mb-2">
                  {line.replace("## ", "")}
                </h2>
              );
            if (line.startsWith("### "))
              return (
                <h3 key={i} className="text-sm font-semibold mt-3 mb-1">
                  {line.replace("### ", "")}
                </h3>
              );
            if (line.startsWith("- "))
              return (
                <li key={i} className="ml-4 text-sm">
                  {line.replace("- ", "")}
                </li>
              );
            if (line.trim() === "") return <br key={i} />;
            return (
              <p key={i} className="text-sm mb-1">
                {line}
              </p>
            );
          })}
        </div>

        {/* Hints Accordion with Point Penalty Warning */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between p-3 bg-amber-500/10 hover:bg-amber-500/15 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <LightbulbIcon className="size-4 text-amber-500" />
              <div className="text-left">
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 block">
                  Need a Hint? ({unlockedHints.length}/{assignment.hints.length} Used)
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Using a hint deducts -1 point from final score.
                </span>
              </div>
            </div>
            {expanded ? (
              <ChevronUpIcon className="size-4 text-amber-500" />
            ) : (
              <ChevronDownIcon className="size-4 text-amber-500" />
            )}
          </button>

          {expanded && (
            <div className="p-3 space-y-2 border-t bg-amber-500/5">
              {assignment.hints.map((hint, i) => {
                const isUnlocked = unlockedHints.includes(i);
                return (
                  <div
                    key={i}
                    className="p-2.5 rounded-md border bg-background/80 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <LightbulbIcon className="size-3" /> Hint {i + 1}
                      </span>
                      {isUnlocked ? (
                        <span className="text-[10px] text-amber-600 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded">
                          Unlocked (-1 pt)
                        </span>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-[10px] px-2 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                          onClick={() => onUnlockHint(i)}
                        >
                          Unlock Hint (-1 pt)
                        </Button>
                      )}
                    </div>
                    {isUnlocked ? (
                      <p className="text-xs text-foreground/90 font-medium">
                        {hint}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        Hint is locked to preserve your full score. Click unlock if you are stuck!
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Reference Solution Modal ─────────────────────────────────────────────────

const SolutionModal = ({
  solutions,
  onClose,
}: {
  solutions?: { name: string; content: string }[];
  onClose: () => void;
}) => {
  const [activeSol, setActiveSol] = useState(0);

  if (!solutions || solutions.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-background border rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-sidebar shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2Icon className="size-5 text-green-500" />
            <div>
              <h2 className="text-sm font-bold">Reference Solution</h2>
              <p className="text-[11px] text-muted-foreground">
                Study how the errors were fixed and compare with your own logic.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="size-7" onClick={onClose}>
            <XIcon className="size-4" />
          </Button>
        </div>

        {/* Tab selection if multiple solution files */}
        {solutions.length > 1 && (
          <div className="flex items-center bg-muted/40 border-b px-2">
            {solutions.map((f, i) => (
              <button
                key={f.name}
                onClick={() => setActiveSol(i)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium border-b-2 transition-colors",
                  activeSol === i
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}

        {/* Solution Code Display */}
        <div className="flex-1 overflow-auto p-4 bg-[#1e1e1e]">
          <pre className="font-mono text-xs md:text-sm text-[#d4d4d4] leading-relaxed whitespace-pre-wrap">
            {solutions[activeSol]?.content}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t bg-sidebar flex justify-end">
          <Button size="sm" onClick={onClose}>
            Close Solution
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Assignment View (Main) ───────────────────────────────────────────────────

export const AssignmentView = ({
  assignmentId,
}: {
  assignmentId: string;
}) => {
  const router = useRouter();
  const { user } = useUser();
  const assignment = getAssignment(assignmentId);

  const hasHtml = useMemo(
    () => assignment?.files.some((f) => f.name.endsWith(".html")) ?? false,
    [assignment]
  );

  const [files, setFiles] = useState(
    () => assignment?.files.map((f) => ({ ...f })) ?? []
  );
  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">(
    hasHtml ? "split" : "code"
  );
  const [previewKey, setPreviewKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);
  const [result, setResult] = useState<{
    score: number;
    maxScore: number;
    feedback: string;
  } | null>(null);

  const createSubmission = useMutation(api.assignments.createSubmission);

  // Check for best previous score
  const bestSubmission = useQuery(
    api.assignments.getBestSubmission,
    assignment && user?.id
      ? { assignmentId: assignment.id, userId: user.id }
      : "skip"
  );

  const handleUnlockHint = (hintIndex: number) => {
    if (!unlockedHints.includes(hintIndex)) {
      setUnlockedHints((prev) => [...prev, hintIndex]);
      toast.warning("Hint unlocked! -1 point will be deducted from final evaluation.");
    }
  };

  const handleFileChange = useCallback(
    (index: number, content: string) => {
      setFiles((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], content };
        return next;
      });
    },
    []
  );

  const handleRefreshPreview = () => {
    setPreviewKey((k) => k + 1);
    toast.info("Preview refreshed");
  };

  const handleSubmit = async () => {
    if (!assignment || !user?.id) return;

    setIsSubmitting(true);
    setResult(null);

    const hintsCount = unlockedHints.length;
    const penaltyPoints = Math.min(assignment.maxScore, hintsCount * 1.0);

    try {
      // 1. Create submission record in Convex
      const submissionId = await createSubmission({
        assignmentId: assignment.id,
        userId: user.id,
        maxScore: assignment.maxScore,
        hintsUsed: hintsCount,
        penalty: penaltyPoints,
        submittedFiles: files,
      });

      // 2. Send to evaluation API
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: assignment.id,
          submissionId,
          submittedFiles: files,
          hintsUsed: hintsCount,
          penalty: penaltyPoints,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Evaluation failed");
      }

      setResult({
        score: data.score,
        maxScore: data.maxScore,
        feedback: data.feedback,
      });

      toast.success(
        `Final Score: ${data.score}/${data.maxScore}! (Hints used: ${hintsCount})`
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Submission failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (!assignment) return;
    setFiles(assignment.files.map((f) => ({ ...f })));
    setResult(null);
    setPreviewKey((k) => k + 1);
    toast.info("Code reset to original.");
  };

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold">Assignment not found</p>
          <Button asChild>
            <Link href="/assignments">← Back to Assignments</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-sidebar overflow-hidden">
      {/* Header */}
      <nav className="flex items-center justify-between px-3 md:px-4 py-2 bg-sidebar border-b shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => router.push("/assignments")}
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <div>
            <h1 className="text-sm font-bold flex items-center gap-2">
              {assignment.title}
            </h1>
            <p className="text-[10px] text-muted-foreground">
              {assignment.language} · {assignment.estimatedTime} ·{" "}
              {assignment.maxScore} points
              {unlockedHints.length > 0 && (
                <span className="text-amber-500 font-medium ml-2">
                  (Hints used: {unlockedHints.length} &rarr; -{unlockedHints.length} pts)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* View Mode controls (Split / Code / Preview) */}
        {hasHtml && (
          <div className="hidden sm:flex items-center border rounded-lg bg-background p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode("split")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer",
                viewMode === "split"
                  ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ColumnsIcon className="size-3.5" />
              Split View
            </button>
            <button
              onClick={() => setViewMode("code")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer",
                viewMode === "code"
                  ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CodeIcon className="size-3.5" />
              Code Only
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer",
                viewMode === "preview"
                  ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <PlayIcon className="size-3.5 text-green-500 fill-green-500" />
              Preview Only
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* View Solution Button */}
          {assignment.solutions && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSolutionModal(true)}
              className="gap-1.5 text-xs text-green-600 dark:text-green-400 border-green-500/30 hover:bg-green-500/10"
            >
              <EyeIcon className="size-3.5" />
              View Solution
            </Button>
          )}

          {bestSubmission?.status === "completed" && (
            <Badge
              variant="outline"
              className="text-xs border-green-500/50 text-green-600 hidden md:inline-flex"
            >
              Best: {bestSubmission.score}/{assignment.maxScore}
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset Code
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-1.5"
          >
            {isSubmitting ? (
              <>
                <LoaderIcon className="size-3.5 animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <SendIcon className="size-3.5" />
                Submit
              </>
            )}
          </Button>
        </div>
      </nav>

      {/* Main content — 2-3 column layout */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        {/* Left — Instructions */}
        <div className="w-full md:w-[340px] lg:w-[380px] shrink-0 border-r p-2 h-1/3 md:h-full overflow-hidden">
          <InstructionsPanel
            assignment={assignment}
            unlockedHints={unlockedHints}
            onUnlockHint={handleUnlockHint}
          />
        </div>

        {/* Right — Code Editor + Live Preview + Result */}
        <div className="flex-1 flex flex-col p-2 gap-2 min-h-0 overflow-hidden">
          {/* Main workspace */}
          <div
            className={cn(
              "flex-1 min-h-0",
              result ? "h-[55%]" : "h-full"
            )}
          >
            {hasHtml && viewMode === "split" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-full">
                <div className="h-full min-h-0">
                  <CodeEditorPanel files={files} onFileChange={handleFileChange} />
                </div>
                <div className="h-full min-h-0">
                  <LivePreviewPanel
                    files={files}
                    previewKey={previewKey}
                    onRefresh={handleRefreshPreview}
                  />
                </div>
              </div>
            ) : viewMode === "preview" && hasHtml ? (
              <div className="h-full">
                <LivePreviewPanel
                  files={files}
                  previewKey={previewKey}
                  onRefresh={handleRefreshPreview}
                />
              </div>
            ) : (
              <div className="h-full">
                <CodeEditorPanel files={files} onFileChange={handleFileChange} />
              </div>
            )}
          </div>

          {/* Result panel */}
          {result && (
            <div className="h-[45%] min-h-[220px]">
              <SubmissionResult
                score={result.score}
                maxScore={result.maxScore}
                feedback={result.feedback}
                onClose={() => setResult(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Reference Solution Modal */}
      {showSolutionModal && (
        <SolutionModal
          solutions={assignment.solutions}
          onClose={() => setShowSolutionModal(false)}
        />
      )}
    </div>
  );
};
