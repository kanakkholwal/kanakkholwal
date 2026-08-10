import { getProjectList, type ProjectType } from "@/lib/project.source";
import { getWorkExperienceList, type WorkExperienceType } from "@/lib/work.source";
import { PROJECT_NARRATION, WORK_NARRATION } from "./story.narration";
import type { StoryBeat, StoryChapter } from "./story.types";

// Flagship projects to feature, in order. Anything not listed is ignored here;
// anything listed without narration is auto-derived from its frontmatter.
const FEATURED_PROJECTS = ["college-ecosystem", "orbit", "recast"];

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${+(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function startTime(startDate: string): number {
  const t = new Date(startDate).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function workToChapter(work: WorkExperienceType): StoryChapter | null {
  const beats = WORK_NARRATION[work.company.toLowerCase()];
  if (!beats) return null;

  const period = `${work.startDate} - ${work.endDate ?? "Present"}`;
  return {
    id: work.company.toLowerCase().replace(/\s+/g, "-"),
    kicker: `${period} · ${work.employmentType ?? "Work"}`,
    title: work.company,
    org: work.position,
    period,
    href: work.href,
    current: Boolean(work.isCurrentEmployer || work.isOngoing || !work.endDate),
    beats,
  };
}

// Fallback for a featured project that has no hand-written narration.
function autoProjectBeats(project: ProjectType): StoryBeat[] {
  const beats: StoryBeat[] = [
    {
      id: `${project.id}-what`,
      heading: "What it is",
      body: project.description,
      scene: { kind: "headline", body: project.title },
    },
    {
      id: `${project.id}-stack`,
      heading: "Built with",
      body: "The stack it runs on.",
      scene: { kind: "stack", items: project.technologies.slice(0, 8) },
    },
  ];

  if (project.metrics?.length) {
    beats.push({
      id: `${project.id}-metrics`,
      heading: "Traction",
      body: "Where it landed.",
      scene: {
        kind: "stats",
        items: project.metrics.map((m) => ({
          value: formatCount(m.value),
          label: m.label,
        })),
      },
    });
  }

  return beats;
}

function projectToChapter(project: ProjectType): StoryChapter {
  return {
    id: project.id,
    kicker: `${project.dates} · ${project.status}`,
    title: project.title,
    org: "Project",
    period: project.dates,
    href: project.href,
    beats: PROJECT_NARRATION[project.id] ?? autoProjectBeats(project),
  };
}

export function getStoryChapters(): StoryChapter[] {
  const work = getWorkExperienceList()
    .slice()
    .sort((a, b) => startTime(a.startDate) - startTime(b.startDate))
    .map(workToChapter)
    .filter((c): c is StoryChapter => c !== null);

  const projectsById = new Map(getProjectList().map((p) => [p.id, p]));
  const projects = FEATURED_PROJECTS.map((id) => projectsById.get(id))
    .filter((p): p is ProjectType => Boolean(p))
    .map(projectToChapter);

  return [...work, ...projects];
}
