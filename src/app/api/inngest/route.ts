import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { importGithubRepo } from "@/features/projects/inngest/import-github-repo";
import { exportToGithub } from "@/features/projects/inngest/export-to-github";
import { processMessage, cancelMessage, demoError } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    importGithubRepo,
    exportToGithub,
    processMessage,
    cancelMessage,
    demoError,
  ],
});