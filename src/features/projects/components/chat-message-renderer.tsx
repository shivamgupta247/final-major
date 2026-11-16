"use client";

import { memo } from "react";
import { BotIcon, UserIcon, LoaderIcon, AlertCircleIcon, XCircleIcon } from "lucide-react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";

interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  status?: "processing" | "done" | "completed" | "error" | "cancelled" | null;
}

interface MessageRendererProps {
  message: Message;
}

export const MessageRenderer = memo(({ message }: MessageRendererProps) => {
  const isUser = message.role === "user";
  const isProcessing = message.status === "processing";
  const isError = message.status === "error";
  const isCancelled = message.status === "cancelled";

  if (isUser) {
    return (
      <div className="flex gap-2.5 justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <div className="shrink-0 mt-1">
          <div className="size-6 rounded-full bg-muted flex items-center justify-center">
            <UserIcon className="size-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex gap-2.5">
      <div className="shrink-0 mt-1">
        <div
          className={cn(
            "size-6 rounded-full flex items-center justify-center",
            isProcessing
              ? "bg-primary/10"
              : isError
              ? "bg-destructive/10"
              : "bg-primary/10"
          )}
        >
          {isProcessing ? (
            <LoaderIcon className="size-3.5 text-primary animate-spin" />
          ) : isError ? (
            <AlertCircleIcon className="size-3.5 text-destructive" />
          ) : (
            <BotIcon className="size-3.5 text-primary" />
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        {/* Status label */}
        {isCancelled && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <XCircleIcon className="size-3" />
            Cancelled
          </p>
        )}

        {/* Content */}
        {message.content ? (
          <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
            <Streamdown
              shikiTheme={["one-dark-pro", "one-light"]}
              className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_pre]:bg-accent [&_pre]:rounded-md [&_pre]:text-xs [&_code:not(pre_code)]:bg-accent [&_code:not(pre_code)]:px-1 [&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:text-xs"
            >
              {message.content}
            </Streamdown>
          </div>
        ) : isProcessing ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Thinking</span>
            <span className="flex gap-0.5">
              <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
});

MessageRenderer.displayName = "MessageRenderer";

