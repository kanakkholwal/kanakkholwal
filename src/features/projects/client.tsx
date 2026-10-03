import { type CSSProperties, useState } from "react";
import { Icon } from "@/components/icons";
import { ProjectGrid } from "@/components/projects/project-grid";
import { ProjectList } from "@/components/projects/project-list";
import { Page, PageHeader } from "@/components/site/page";
import { RollingDigits } from "@/components/text/rolling-digits";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group/toggle-group";
import { useProjects } from "@/lib/content";

type View = "list" | "grid";

export default function ProjectsShowcase() {
  const projects = useProjects();
  const [view, setView] = useState<View>("list");
  const [status, setStatus] = useState("all");

  const statuses = [...new Set(projects.map((p) => p.status))];
  const shown = status === "all" ? projects : projects.filter((p) => p.status === status);

  return (
    <Page>
      <PageHeader
        title="projects."
        eyebrow={
          <>
            <RollingDigits value={shown.length} /> {shown.length === 1 ? "project" : "projects"}
          </>
        }
        description="Products, tools and experiments I've built end to end."
      />

      <div className="rise flex flex-col gap-5" style={{ "--i": 1 } as CSSProperties}>
        <div className="flex items-center justify-between gap-3">
          <ToggleGroup
            label="Filter by status"
            variant="outline"
            size="sm"
            value={status}
            onValueChange={(v) => v && setStatus(v as string)}
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            {statuses.map((s) => (
              <ToggleGroupItem key={s} value={s}>
                {s}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <ToggleGroup
            label="Layout"
            variant="outline"
            size="sm"
            value={view}
            onValueChange={(v) => v && setView(v as View)}
          >
            <ToggleGroupItem value="list" aria-label="List">
              <Icon name="list" />
              <span className="max-sm:sr-only">List</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid">
              <Icon name="layout-grid" />
              <span className="max-sm:sr-only">Grid</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {view === "list" ? <ProjectList projects={shown} /> : <ProjectGrid projects={shown} />}
      </div>
    </Page>
  );
}
