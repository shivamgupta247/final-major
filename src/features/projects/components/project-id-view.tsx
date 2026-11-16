"use client";

import { useState } from "react";
import { Allotment } from "allotment";
import {
  PanelLeftCloseIcon,
  PanelRightCloseIcon,
  PanelLeftOpenIcon,
  PanelRightOpenIcon,
  WandSparklesIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { EditorView } from "@/features/editor/components/editor-view";

import { FileExplorer } from "./file-explorer";
import { Id } from "../../../../convex/_generated/dataModel";
import { PreviewView } from "./preview-view";
import { ExportPopover } from "./export-popover";
import { ChatPanel } from "./chat-panel";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_CHAT_SIZE = 360;
const DEFAULT_SIDEBAR_WIDTH = 240;
const DEFAULT_CODE_SIZE = 650;
const DEFAULT_PREVIEW_SIZE = 600;

export const ProjectIdView = ({
  projectId,
}: {
  projectId: Id<"projects">;
}) => {
  const [showChat, setShowChat] = useState(true);
  const [showExplorer, setShowExplorer] = useState(true);
  const [showCode, setShowCode] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const toggleChat = () => setShowChat((v) => !v);
  const toggleExplorer = () => setShowExplorer((v) => !v);

  const toggleCode = () => {
    if (showCode && !showPreview) return; // don't hide both
    setShowCode((v) => !v);
  };

  const togglePreview = () => {
    if (showPreview && !showCode) return;
    setShowPreview((v) => !v);
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Toolbar */}
      <nav className="h-8.75 flex items-center bg-sidebar border-b shrink-0">
        {/* Left: AI Chat Toggle */}
        <button
          onClick={toggleChat}
          title={showChat ? "Collapse AI chat" : "Expand AI chat"}
          className={cn(
            "flex items-center gap-2 h-full px-3 border-r cursor-pointer transition-colors",
            showChat
              ? "text-primary bg-background font-semibold"
              : "text-muted-foreground hover:bg-accent/30"
          )}
        >
          <WandSparklesIcon className="size-3.5 text-primary" />
          <span className="text-sm font-medium">AI Chat</span>
        </button>

        {/* Files Explorer Toggle */}
        <button
          onClick={toggleExplorer}
          title={showExplorer ? "Collapse explorer" : "Expand explorer"}
          className={cn(
            "flex items-center gap-2 h-full px-3 border-r cursor-pointer transition-colors",
            showExplorer
              ? "text-foreground bg-background"
              : "text-muted-foreground hover:bg-accent/30"
          )}
        >
          {showExplorer ? (
            <PanelLeftCloseIcon className="size-3.5" />
          ) : (
            <PanelLeftOpenIcon className="size-3.5" />
          )}
          <span className="text-sm font-medium">Files</span>
        </button>

        {/* Code Editor Toggle */}
        <button
          data-tour="tour-code-tab"
          onClick={toggleCode}
          title={showCode ? "Collapse code" : "Expand code"}
          className={cn(
            "flex items-center gap-2 h-full px-3 border-r cursor-pointer transition-colors",
            showCode
              ? "text-foreground bg-background"
              : "text-muted-foreground hover:bg-accent/30"
          )}
        >
          <span className="text-sm font-medium">Code</span>
        </button>

        <div className="flex-1" />

        {/* Right buttons */}
        <button
          data-tour="tour-preview-tab"
          onClick={togglePreview}
          title={showPreview ? "Collapse preview" : "Expand preview"}
          className={cn(
            "flex items-center gap-2 h-full px-3 border-l cursor-pointer transition-colors",
            showPreview
              ? "text-foreground bg-background"
              : "text-muted-foreground hover:bg-accent/30"
          )}
        >
          <span className="text-sm font-medium">Preview</span>
          {showPreview ? (
            <PanelRightCloseIcon className="size-3.5" />
          ) : (
            <PanelRightOpenIcon className="size-3.5" />
          )}
        </button>

        <div className="flex justify-end h-full">
          <div data-tour="tour-export-btn">
            <ExportPopover projectId={projectId} />
          </div>
        </div>
      </nav>

      {/* Main panes: Left-to-Right = AI Chat -> Files -> Code -> Preview */}
      <div className="flex-1 min-h-0">
        <Allotment
          defaultSizes={[
            DEFAULT_CHAT_SIZE,
            DEFAULT_SIDEBAR_WIDTH,
            DEFAULT_CODE_SIZE,
            DEFAULT_PREVIEW_SIZE,
          ]}
        >
          {/* 1. AI Chat Panel (Leftmost) */}
          <Allotment.Pane
            visible={showChat}
            minSize={280}
            maxSize={700}
            preferredSize={DEFAULT_CHAT_SIZE}
          >
            <div className="h-full relative border-r">
              <ChatPanel projectId={projectId} />
            </div>
          </Allotment.Pane>

          {/* 2. File Explorer */}
          <Allotment.Pane
            snap
            visible={showExplorer}
            minSize={MIN_SIDEBAR_WIDTH}
            maxSize={MAX_SIDEBAR_WIDTH}
          >
            <div data-tour="tour-file-explorer" className="h-full">
              <FileExplorer projectId={projectId} />
            </div>
          </Allotment.Pane>

          {/* 3. Code Editor */}
          <Allotment.Pane visible={showCode} minSize={200}>
            <EditorView projectId={projectId} />
          </Allotment.Pane>

          {/* 4. Preview */}
          <Allotment.Pane visible={showPreview} minSize={200}>
            <PreviewView projectId={projectId} />
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};
