"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  BotIcon,
  SendIcon,
  SquareIcon,
  Trash2Icon,
  ChevronDownIcon,
  WandSparklesIcon,
  LoaderIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Id } from "../../../../convex/_generated/dataModel";
import {
  useProjectConversation,
  useGetOrCreateConversation,
  useMessages,
  useSendMessage,
  useClearConversation,
} from "../hooks/use-messages";
import { MessageRenderer } from "./chat-message-renderer";

// ─── Model options ─────────────────────────────────────────────────────────────

const MODELS = [
  {
    id: "groq/openai/gpt-oss-120b",
    label: "GPT OSS 120B (Groq - 100% Free, Unlimited)",
    provider: "groq",
  },
  {
    id: "groq/qwen/qwen3.8-27b",
    label: "Qwen 3.8 27B Code (Groq - 100% Free, Fast)",
    provider: "groq",
  },
  {
    id: "openrouter/free",
    label: "OpenRouter Auto (Free)",
    provider: "openrouter",
  },
  {
    id: "nvidia/nemotron-3-ultra-550b-a55b:free",
    label: "NVIDIA Nemotron 550B (Free)",
    provider: "openrouter",
  },
];

// ─── Chat Panel ────────────────────────────────────────────────────────────────

interface ChatPanelProps {
  projectId: Id<"projects">;
}

export const ChatPanel = ({ projectId }: ChatPanelProps) => {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [createdConversationId, setCreatedConversationId] =
    useState<Id<"conversations"> | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const conversation = useProjectConversation(projectId);
  const getOrCreate = useGetOrCreateConversation();
  const conversationId = conversation?._id ?? createdConversationId;
  const messages = useMessages(conversationId);
  const clearConversation = useClearConversation();
  const { send, cancel, isLoading } = useSendMessage();

  // ── Bootstrap conversation if none exists ───────────────────────────────
  useEffect(() => {
    if (conversation === null) {
      getOrCreate({ projectId }).then((id) => {
        setCreatedConversationId(id);
      });
    }
  }, [conversation, projectId, getOrCreate]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    setIsAtBottom(scrollHeight - scrollTop - clientHeight < 60);
  }, []);

  // ── Textarea auto-resize ────────────────────────────────────────────────
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  }, [input]);

  // ── Send message ────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!input.trim() || !conversationId || isLoading) return;

    const msg = input.trim();
    setInput("");

    try {
      await send({
        conversationId,
        message: msg,
        model: selectedModel,
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send message"
      );
    }
  }, [input, conversationId, isLoading, send, selectedModel]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStop = async () => {
    await cancel(projectId);
  };

  const handleClear = async () => {
    if (!conversationId) return;
    await clearConversation({ conversationId });
  };

  const isProcessing =
    messages?.some((m) => m.status === "processing") ?? false;

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-background border-l">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-sidebar shrink-0">
        <div className="flex items-center gap-2">
          <WandSparklesIcon className="size-4 text-primary" />
          <span className="text-sm font-semibold">Learning Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleClear}
                disabled={!messages?.length}
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
              >
                <Trash2Icon className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear conversation</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-6 min-h-0"
      >
        {(!messages || messages.length === 0) && (
          <EmptyState onSelectSuggestion={(text) => setInput(text)} />
        )}

        {messages?.map((message) => (
          <MessageRenderer key={message._id} message={message} />
        ))}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll-to-bottom button */}
      {!isAtBottom && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-md"
            onClick={scrollToBottom}
          >
            <ChevronDownIcon className="size-4" />
          </Button>
        </div>
      )}

      {/* Input area */}
      <div className="shrink-0 border-t bg-sidebar px-3 pt-2 pb-3 space-y-2">
        {/* Model selector */}
        <div className="flex items-center gap-2">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="h-6 text-xs border-0 bg-transparent px-1 w-fit gap-1 focus:ring-0 shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-xs">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Textarea + Send */}
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your tutor — describe your error or concept…"
            className="min-h-[40px] max-h-[200px] resize-none text-sm rounded-lg border bg-background py-2 px-3 focus-visible:ring-1"
            rows={1}
            disabled={isLoading && !isProcessing}
          />
          <div className="flex flex-col gap-1">
            {isProcessing ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="size-9 shrink-0"
                    onClick={handleStop}
                  >
                    <SquareIcon className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Stop generation</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="size-9 shrink-0"
                    onClick={handleSend}
                    disabled={!input.trim() || !conversationId}
                  >
                    {isLoading ? (
                      <LoaderIcon className="size-3.5 animate-spin" />
                    ) : (
                      <SendIcon className="size-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send (Enter)</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Tutor reads your code but won&apos;t write it for you — learn by doing!
        </p>
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  onSelectSuggestion: (text: string) => void;
}

const EmptyState = ({ onSelectSuggestion }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-4 text-center px-4">
    <div className="rounded-full bg-primary/10 p-4">
      <BotIcon className="size-8 text-primary" />
    </div>
    <div className="space-y-1">
      <h3 className="font-semibold text-sm">AI Learning Tutor</h3>
      <p className="text-xs text-muted-foreground max-w-[200px]">
        Share your code or error — I&apos;ll guide you to the fix, not give it to you!
      </p>
    </div>
    <div className="flex flex-col gap-2 w-full max-w-[240px]">
      {[
        "I want to make a calculator, how should I start?",
        "Where is the error in my code?",
        "Explain my project structure and next steps",
      ].map((suggestion) => (
        <SuggestionChip
          key={suggestion}
          text={suggestion}
          onClick={() => onSelectSuggestion(suggestion)}
        />
      ))}
    </div>
  </div>
);

const SuggestionChip = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="text-xs text-left px-3 py-2 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
  >
    {text}
  </button>
);
