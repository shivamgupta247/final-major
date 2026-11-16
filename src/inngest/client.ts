import { Inngest } from "inngest";
import { sentryMiddleware } from "@inngest/middleware-sentry";

// Create a client to send and receive events
const _inngest = new Inngest({
  id: "polaris",
  middleware: [sentryMiddleware()],
});

// Proxy that silently swallows connection errors when the Inngest dev
// server is not running — prevents crashes across ALL routes.
export const inngest = new Proxy(_inngest, {
  get(target, prop) {
    const value = (target as unknown as Record<string | symbol, unknown>)[prop as string];
    if (prop === "send" && typeof value === "function") {
      return async (...args: unknown[]) => {
        try {
          return await (value as (...a: unknown[]) => unknown).apply(target, args);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          console.warn("[inngest] send() skipped — server unavailable:", msg);
          return { ids: ["bypass-no-inngest-server"] };
        }
      };
    }
    return typeof value === "function" ? value.bind(target) : value;
  },
});
