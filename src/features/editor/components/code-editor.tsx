import { useEffect, useMemo, useRef, useState } from "react"
import { EditorView, keymap } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { indentWithTab } from "@codemirror/commands";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";

import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom, useSelf } from "@liveblocks/react";

import { minimap } from "../extensions/minimap";
import { customTheme } from "../extensions/theme";
import { getLanguageExtension } from "../extensions/language-extension";
import { customSetup } from "../extensions/custom-setup";
import { quickEdit } from "../extensions/quick-edit";
import { selectionTooltip } from "../extensions/selection-tooltip";

interface Props {
  fileName: string;
  initialValue?: string;
  onChange: (value: string) => void;
}

export const CodeEditor = ({
  fileName,
  initialValue = "",
  onChange
}: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const room = useRoom();

  const languageExtension = useMemo(() => {
    return getLanguageExtension(fileName)
  }, [fileName])

  // Setup Yjs and Liveblocks
  const [yjsState, setYjsState] = useState<{ yDoc: Y.Doc, provider: any } | null>(null);
  const userInfo = useSelf((me) => me.info);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yText = yDoc.getText("codemirror");
    
    const provider = new LiveblocksYjsProvider(room, yDoc);

    // Initialize document with Convex data if it's empty
    provider.on("synced", () => {
      if (yText.length === 0 && initialValue) {
        yText.insert(0, initialValue);
      }
    });

    setYjsState({ yDoc, provider });

    return () => {
      provider.destroy();
      yDoc.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  useEffect(() => {
    if (yjsState && userInfo) {
      yjsState.provider.awareness.setLocalStateField("user", {
        name: userInfo.name,
        color: userInfo.color,
        colorLight: userInfo.color,
      });
    }
  }, [yjsState, userInfo]);

  useEffect(() => {
    if (!editorRef.current || !yjsState) return;

    const { yDoc, provider } = yjsState;
    const yText = yDoc.getText("codemirror");

    const view = new EditorView({
      parent: editorRef.current,
      extensions: [
        oneDark,
        customTheme,
        customSetup,
        languageExtension,
        yCollab(yText, provider.awareness),
        quickEdit(fileName),
        selectionTooltip(),
        keymap.of([indentWithTab]),
        minimap(),
        indentationMarkers(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        })
      ],
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initialValue is only used for initial document
  }, [languageExtension, yjsState]);

  return (
    <div ref={editorRef} className="size-full pl-4 bg-background" />
  );
};
