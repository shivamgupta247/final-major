"use client";

import { useMutation, useQuery } from "convex/react";
import { useCallback, useState } from "react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

// ─── Conversation ─────────────────────────────────────────────────────────────

export const useProjectConversation = (projectId: Id<"projects">) => {
  return useQuery(api.messages.getProjectConversation, { projectId });
};

export const useGetOrCreateConversation = () => {
  return useMutation(api.messages.getOrCreateConversation);
};

// ─── Messages ─────────────────────────────────────────────────────────────────

export const useMessages = (conversationId: Id<"conversations"> | null) => {
  return useQuery(
    api.messages.getMessages,
    conversationId ? { conversationId } : "skip"
  );
};

export const useClearConversation = () => {
  return useMutation(api.messages.clearConversation);
};

// ─── Send message ─────────────────────────────────────────────────────────────

export type SendMessageOptions = {
  conversationId: string;
  message: string;
  model?: string;
};

export const useSendMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (opts: SendMessageOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(opts),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send message";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancel = useCallback(async (projectId: string) => {
    await fetch("/api/messages/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });
  }, []);

  return { send, cancel, isLoading, error };
};

