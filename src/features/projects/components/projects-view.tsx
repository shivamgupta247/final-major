"use client";

import { Poppins } from "next/font/google";
import { SparkleIcon, Compass, FolderPlusIcon, ClipboardListIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProductTour, DASHBOARD_TOUR_STEPS } from "@/components/product-tour";

import { ProjectsList } from "./projects-list";
import { ProjectsCommandDialog } from "./projects-command-dialog";
import { ImportGithubDialog } from "./import-github-dialog";

import { BlankProjectDialog } from "./blank-project-dialog";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const ProjectsView = () => {
  const router = useRouter();
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const [blankProjectDialogOpen, setBlankProjectDialogOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "k") {
          e.preventDefault();
          setCommandDialogOpen(true);
        }
        if (e.key === "i") {
          e.preventDefault();
          setImportDialogOpen(true);
        }

        if (e.key === "b") {
          e.preventDefault();
          setBlankProjectDialogOpen(true);
        }
        if (e.key === "a") {
          e.preventDefault();
          router.push("/assignments");
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);


  return (
    <>
      <ProjectsCommandDialog
        open={commandDialogOpen}
        onOpenChange={setCommandDialogOpen}
      />
      <ImportGithubDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />

      <BlankProjectDialog
        open={blankProjectDialogOpen}
        onOpenChange={setBlankProjectDialogOpen}
      />
      <ProductTour
        steps={DASHBOARD_TOUR_STEPS}
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
      />
      <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-sm mx-auto flex flex-col gap-4 items-center">

          <div className="flex justify-between gap-4 w-full items-center">

            <div className="flex items-center gap-2 w-full group/logo">
              <img src="/logo.svg" alt="Nexus AI" className="size-[32px] md:size-[46px]" />
              <h1 className={cn(
                "text-4xl md:text-5xl font-semibold",
                font.className,
              )}>
                Nexus AI
              </h1>
            </div>

            <ThemeToggle />

          </div>

          {/* Get Started tour button */}
          <button
            className="tour-get-started-btn w-full"
            onClick={() => setTourOpen(true)}
          >
            <Compass style={{ width: 16, height: 16 }} />
            Get Started — Take a Tour
          </button>

          <div className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-3 gap-2">
              <Button
                data-tour="tour-blank-project-btn"
                variant="outline"
                onClick={() => setBlankProjectDialogOpen(true)}
                className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
              >
                <div className="flex items-center justify-between w-full">
                  <FolderPlusIcon className="size-4" />
                  <Kbd className="bg-accent border">
                    ⌘B
                  </Kbd>
                </div>
                <div>
                  <span className="text-sm">
                    New Project
                  </span>
                </div>
              </Button>
              <Button
                data-tour="tour-import-btn"
                variant="outline"
                onClick={() => setImportDialogOpen(true)}
                className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
              >
                <div className="flex items-center justify-between w-full">
                  <FaGithub className="size-4" />
                  <Kbd className="bg-accent border">
                    ⌘I
                  </Kbd>
                </div>
                <div>
                  <span className="text-sm">
                    Import
                  </span>
                </div>
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/assignments")}
                className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
              >
                <div className="flex items-center justify-between w-full">
                  <ClipboardListIcon className="size-4" />
                  <Kbd className="bg-accent border">
                    ⌘A
                  </Kbd>
                </div>
                <div>
                  <span className="text-sm">
                    Assignments
                  </span>
                </div>
              </Button>
            </div>


            <div data-tour="tour-projects-list">
              <ProjectsList onViewAll={() => setCommandDialogOpen(true)} />
            </div>

          </div>

        </div>
      </div>
    </>
  );
};
