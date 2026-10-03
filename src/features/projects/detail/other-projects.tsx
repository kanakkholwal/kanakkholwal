import { ProjectList } from "@/components/projects/project-list";
import { ArrowLink } from "@/components/site/link";
import { Section } from "@/components/site/page";
import { useProjects } from "@/lib/content";

export function OtherProjects({
  currentProjectId,
  number,
  index,
}: {
  currentProjectId: string;
  number?: number;
  index?: number;
}) {
  const others = useProjects().filter((p) => p.id !== currentProjectId);
  if (!others.length) return null;

  return (
    <Section
      id="more-projects"
      title="more projects."
      number={number}
      description="Other things I've built."
      index={index}
      action={
        <ArrowLink href="/projects" className="text-sm">
          All projects
        </ArrowLink>
      }
    >
      <ProjectList projects={others.slice(0, 4)} />
    </Section>
  );
}
