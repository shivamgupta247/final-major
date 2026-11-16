"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ProductTour, EDITOR_TOUR_STEPS } from "@/components/product-tour";
import { Spinner } from "@/components/ui/spinner";

import { Navbar } from "./navbar";
import { Id } from "../../../../convex/_generated/dataModel";
import { useProject } from "../hooks/use-projects";

export const ProjectIdLayout = ({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: Id<"projects">;
}) => {
  const router = useRouter();
  const project = useProject(projectId);
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    if (project === null) {
      router.replace("/");
    }
  }, [project, router]);

  if (project === undefined || project === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-sidebar">
        <Spinner className="size-6 text-ring" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar
        projectId={projectId}
        onTourStart={() => setTourOpen(true)}
      />
      <ProductTour
        steps={EDITOR_TOUR_STEPS}
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
      />
      <div className="flex-1 w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};
