"use client";
import { SimpleProjectCards } from "@/components/application/projects.card";
import { getOtherProjects } from "@/lib/project.source";
import { Layers } from "lucide-react";

type OtherProjectsProps = {
  currentProjectId: string;
};

export function OtherProjects({ currentProjectId }: OtherProjectsProps) {
  const otherProjects = getOtherProjects(currentProjectId);

  return (
    <section className="w-full mx-auto max-w-app py-24 overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10 px-4 md:px-0 opacity-80">
          <Layers className="size-5 text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground font-mono">
            System Archive // Select Project
          </h2>
        </div>


        <SimpleProjectCards cards={otherProjects} />
      </div>
    </section>
  );
}
