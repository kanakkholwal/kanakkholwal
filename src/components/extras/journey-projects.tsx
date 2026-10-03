import { useMemo } from "react";
import { ProjectList } from "@/components/projects/project-list";
import { useProjects } from "@/lib/content";

/** Projects whose dates mention any of `years`, as the shared project rows. */
export function JourneyProjects({ years }: { years: string[] }) {
  const projects = useProjects();
  const matching = useMemo(() => projects.filter((p) => years.some((y) => p.dates.includes(y))), [projects, years]);
  if (!matching.length) return null;
  return <ProjectList projects={matching} className="not-prose mt-2" />;
}
