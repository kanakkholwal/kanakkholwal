import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconType } from "@/components/icons";
import Link from "@/components/link";
import { projectPreview, projectTitleTransition } from "@/components/projects/project-list";
import { ButtonLink } from "@/components/site/link";
import { Meta, Page, PixelHeading } from "@/components/site/page";
import { RollingDigits } from "@/components/text/rolling-digits";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { ProjectType } from "@/lib/content";
import type { AnalyticsResult } from "~/lib/analytics/types";
import { ProjectAnalytics } from "./_components/project-analytics";
import { OtherProjects } from "./other-projects";

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const grouped = new Intl.NumberFormat("en-US");
const metric = (v: number) => `${v >= 100_000 ? compact.format(v) : grouped.format(v)}+`;

const linkIcon = (url: string, icon?: IconType): IconType =>
  icon ?? (url.includes("github.com") ? "brand-github" : "globe");

const rise = (i: number) => ({ "--i": i }) as CSSProperties;

export default function ProjectPageClient({
  project,
  analytics,
  children,
}: {
  project: ProjectType;
  analytics: AnalyticsResult | null;
  children: ReactNode;
}) {
  const links = project.links?.length ? project.links : [{ label: "Website", url: project.href, icon: undefined }];

  return (
    <Page className="flex flex-col gap-20">
      <article className="flex flex-col gap-10">
        <header className="rise flex flex-col gap-4">
          <Link
            href="/projects"
            className="group/back mb-4 inline-flex w-fit items-center gap-1 text-muted-foreground text-sm transition-colors hoverable:text-foreground"
          >
            <Icon
              name="arrow-left"
              className="size-3.5 transition-transform duration-(--duration-fast) ease-(--ease-out) group-hover/back:-translate-x-0.5"
            />
            projects
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge size="sm" variant={project.active ? "success" : "secondary"} dot={project.active}>
              {project.status}
            </Badge>
            <Meta>{[project.tags?.[0], project.dates].filter(Boolean).join(" · ")}</Meta>
          </div>
          <PixelHeading as="h1" className="w-fit text-4xl sm:text-6xl" style={projectTitleTransition(project.id)}>
            {project.title}
          </PixelHeading>
          <p className="max-w-prose text-base text-muted-foreground text-pretty">{project.description}</p>
        </header>

        <div className="rise flex flex-col gap-5" style={rise(1)}>
          <div className="rounded-2xl bg-card p-1">
            <div className="overflow-hidden rounded-xl bg-background shadow-(--surface-shadow) dark:bg-popover">
              {project.video ? (
                <video
                  src={project.video}
                  poster={projectPreview(project)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="aspect-[1200/630] w-full bg-muted object-cover"
                />
              ) : (
                <img
                  src={projectPreview(project)}
                  alt={`${project.title} preview`}
                  fetchPriority="high"
                  decoding="async"
                  className="aspect-[1200/630] w-full bg-muted object-cover"
                />
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <div className="flex flex-wrap gap-2">
              {links.map((l) => (
                <ButtonLink key={l.url} href={l.url} variant="outline" size="sm">
                  <Icon name={linkIcon(l.url, l.icon)} />
                  {l.label}
                </ButtonLink>
              ))}
            </div>
            <span className="font-mono text-muted-foreground/80 text-xs">{project.technologies.join(" / ")}</span>
          </div>
        </div>

        {project.metrics?.length ? <Metrics metrics={project.metrics} /> : null}

        <div
          className="rise prose max-w-[40rem] prose-headings:font-medium prose-headings:tracking-tight prose-p:leading-7 prose-img:rounded-xl"
          style={rise(3)}
        >
          {children}
        </div>
      </article>

      <ProjectAnalytics result={analytics} number={1} index={4} />
      <OtherProjects currentProjectId={project.id} number={analytics?.ok ? 2 : 1} index={5} />
    </Page>
  );
}

function Metrics({ metrics }: { metrics: NonNullable<ProjectType["metrics"]> }) {
  const cols = Math.min(metrics.length, 4);
  return (
    <dl
      className={cn(
        "rise grid grid-cols-2 overflow-hidden rounded-xl border border-border",
        cols === 1 && "grid-cols-1",
        cols === 3 && "sm:grid-cols-3",
        cols === 4 && "sm:grid-cols-4",
      )}
      style={rise(2)}
    >
      {metrics.map((m, i) => (
        <div
          key={m.label}
          className={cn(
            "flex flex-col gap-1 border-border p-4",
            i % 2 === 1 && "border-l",
            i >= 2 && "border-t",
            cols > 2 && i >= 2 && "sm:border-t-0",
            cols > 2 && i === 2 && "sm:border-l",
            cols === 4 && i === 3 && "sm:border-l",
          )}
        >
          <dt className="text-muted-foreground text-xs">{m.label}</dt>
          <dd className="font-medium text-2xl tabular-nums">
            <RollingDigits value={m.value} startOnView format={metric} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
