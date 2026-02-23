import { CountingNumber } from "@/components/animated/text.counter";
import { ProjectFallback } from "@/components/application/projects.card.fallback";
import { Icon, IconType } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/utils/link";
import { source } from "@/lib/project.source";
import { cn } from "@/lib/utils";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Code2,
  Layers,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OtherProjects } from "./other-projects";

export default async function ProjectPage(props: { slug: string[] }) {
  const pageSource = source.getPage(props.slug);

  if (!pageSource) notFound();
  const project = pageSource.data;
  const Mdx = pageSource.data.body;

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      {/* 1. Navigation / Breadcrumb */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 md:px-12 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <ButtonLink
            href="/projects"
            variant="ghost"
            size="sm"
            className="-ml-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> All Projects
          </ButtonLink>
          <span className="text-xs font-mono text-muted-foreground opacity-50 hidden md:block">
            CASE STUDY: {project.id.toUpperCase()}
          </span>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-center gap-4">
            <StatusPill status={project.status} />
            <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {project.dates}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground text-balance">
            {project.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {project.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full px-4 py-1 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Media Showcase */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 mb-24">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border shadow-2xl bg-card group">
          {project.video ? (
            <video
              src={project.video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              width={1920}
              height={1080}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          ) : (
            <ProjectFallback title={project.title} />
          )}
          {/* Cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* 4. Content Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Narrative (Left - 8 cols) */}
          <article className="lg:col-span-8">
            {/* Metrics Strip */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-16 pb-12 border-b border-border">
                {project.metrics.map((metric, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <CountingNumber
                      to={metric.value}
                      className="text-4xl font-bold tracking-tight text-foreground"
                      suffix="+"
                    />
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Markdown Content */}
            <div
              className={cn(
                "prose dark:prose-invert max-w-none",
                "prose-headings:font-mono prose-headings:tracking-tight prose-headings:font-bold",
                "prose-p:font-mono prose-p:leading-6 prose-p:text-zinc-600 dark:prose-p:text-zinc-300",
                "prose-li:font-mono",

                // override typography anchor underline
                "[&_a[data-card].peer]:no-underline",

                // "prose-pre:border prose-pre:border-border/50 prose-pre:bg-zinc-950",
                // "prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none"
              )}
            >
              <Mdx components={defaultMdxComponents} />
            </div>
          </article>

          {/* Sidebar Info (Right - 4 cols) */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              {/* Deployment Card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Rocket className="w-3 h-3" /> Project Links
                </h3>
                <div className="flex flex-col gap-3">
                  {project.links?.map((link, i) => (
                    <Link
                      key={i}
                      href={link.url}
                      target="_blank"
                      className="group flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all"
                    >
                      <span className="flex items-center gap-3 font-medium text-sm">
                        {link.icon && (
                          <span className="bg-background size-8 inline-flex items-center justify-center p-1.5 rounded-md border border-border shadow-sm group-hover:text-primary transition-colors">
                            {
                              <Icon
                                name={link.icon as IconType}
                                className="size-6"
                              />
                            }
                          </span>
                        )}

                        {link.label}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                  {(!project.links || project.links.length === 0) && (
                    <span className="text-sm text-muted-foreground italic">
                      No public links available.
                    </span>
                  )}
                </div>
              </div>

              {/* Tech Stack Card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Code2 className="w-3 h-3" /> Technology
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <TechItem key={tech}>{tech}</TechItem>
                  ))}
                </ul>
              </div>

              {/* Context / Meta */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Context
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Timeline</span>
                    <span className="font-medium">{project.dates}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium capitalize">
                      {project.tags?.[0] || "Project"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize text-foreground">
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

       <OtherProjects currentProjectId={project.id} />
    </main>
  );
}

const StatusPill = ({ status }: { status: string }) => {
  const styles = {
    shipped:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30",
    "in progress":
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/30",
    archived:
      "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 ring-zinc-500/30",
    default: "bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-blue-500/30",
  };

  const key = status?.toLowerCase() as keyof typeof styles;
  const activeStyle = styles[key] || styles.default;
  const isShipped = key === "shipped";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset",
        activeStyle,
      )}
    >
      <span className="relative flex h-2 w-2">
        {isShipped && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            isShipped ? "bg-emerald-500" : "bg-current",
          )}
        ></span>
      </span>
      {status}
    </div>
  );
};

const TechItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-2 text-sm text-muted-foreground border border-border/50 bg-zinc-50/50 dark:bg-zinc-900/50 px-2.5 py-1.5 rounded-md">
    <div className="w-1 h-1 rounded-full bg-primary/40" />
    {children}
  </li>
);
