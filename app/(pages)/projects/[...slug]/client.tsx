"use client";

import { CountingNumber } from "@/components/animated/text.counter";
import { ProjectFallback } from "@/components/application/projects.card.fallback";
import { Icon, IconType } from "@/components/icons";
import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/utils/link";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { ProjectType } from "@/lib/project.source";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Code2,
  ExternalLink,
  Layers,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { OtherProjects } from "./other-projects";

const BLUR_FADE_DELAY = 0.04;

type ProjectData = Omit<ProjectType, "body"|  "getText" | "getMDAST" | "info" | "toc" | "_exports" | "_openapi">;

interface ProjectPageProps {
  project: ProjectData;
  children: React.ReactNode;
}

export default function ProjectPageClient({ project, children }: ProjectPageProps) {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="project-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MinimalProjectPage project={project}>{children}</MinimalProjectPage>
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="project-static"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StaticProjectPage project={project}>{children}</StaticProjectPage>
        </motion.div>
      ) : (
        <motion.div
          key="project-dynamic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <DynamicProjectPage project={project}>{children}</DynamicProjectPage>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/*  MINIMAL  */
function MinimalProjectPage({ project, children }: ProjectPageProps) {
  return (
    <main className="min-h-screen w-full max-w-3xl mx-auto px-6 py-24 md:py-32">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="size-3" /> /projects
        </Link>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3" />
            {project.dates}
          </span>
          <span></span>
          <StatusPill status={project.status} minimal />
          {project.tags?.[0] && (
            <>
              <span></span>
              <span>{project.tags[0]}</span>
            </>
          )}
        </div>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          {project.title}
        </h1>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 4}>
        <p className="text-base text-muted-foreground leading-relaxed mb-10">
          {project.description}
        </p>
      </BlurFade>

      {project.links && project.links.length > 0 && (
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <div className="flex flex-wrap gap-3 mb-12 pb-12 border-b border-dashed border-border">
            {project.links.map((link, i) => (
              <Link
                key={i}
                href={link.url}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              >
                {link.label}
                <ArrowUpRight className="size-3" />
              </Link>
            ))}
          </div>
        </BlurFade>
      )}

      {project.metrics && project.metrics.length > 0 && (
        <BlurFade delay={BLUR_FADE_DELAY * 6}>
          <div className="grid grid-cols-3 gap-6 mb-12 pb-12 border-b border-dashed border-border">
            {project.metrics.map((m, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <CountingNumber
                  to={m.value}
                  className="text-2xl font-bold font-mono text-foreground"
                  suffix="+"
                />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </BlurFade>
      )}

      <BlurFade delay={BLUR_FADE_DELAY * 7}>
        <div className="flex flex-wrap gap-1.5 mb-12 pb-12 border-b border-dashed border-border">
          {project.technologies.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border"
            >
              {t}
            </span>
          ))}
        </div>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 8}>
        <div className="prose dark:prose-invert max-w-none prose-p:font-mono prose-p:leading-relaxed prose-headings:font-mono prose-headings:tracking-tight">
          {children}
        </div>
      </BlurFade>

      <OtherProjects currentProjectId={project.id} />
    </main>
  );
}

/*  STATIC  */
function StaticProjectPage({ project, children }: ProjectPageProps) {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
 

      <section className="pt-40 pb-12 px-6 max-w-4xl mx-auto">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="flex items-center gap-3 mb-6">
            <StatusPill status={project.status} />
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-3" /> {project.dates}
            </span>
          </div>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
            {project.title}
          </h1>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-6">
            {project.description}
          </p>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <div className="flex flex-wrap gap-2">
            {project.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full px-3 py-0.5 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </BlurFade>
      </section>

      <BlurFade delay={BLUR_FADE_DELAY * 5} className="max-w-5xl mx-auto px-4 md:px-8 mb-20">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border shadow-xl bg-card">
          {project.video ? (
            <video src={project.video} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          ) : project.image ? (
            <Image src={project.image} alt={project.title} width={1920} height={1080} className="w-full h-full object-cover" priority />
          ) : (
            <ProjectFallback title={project.title} />
          )}
        </div>
      </BlurFade>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <article className="lg:col-span-8">
            {project.metrics && project.metrics.length > 0 && (
              <BlurFade delay={BLUR_FADE_DELAY * 6}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-16 pb-12 border-b border-border">
                  {project.metrics.map((m, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <CountingNumber to={m.value} className="text-4xl font-bold tracking-tight text-foreground" suffix="+" />
                      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{m.label}</span>
                    </div>
                  ))}
                </div>
              </BlurFade>
            )}
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
              <div className={cn(
                "prose dark:prose-invert max-w-none",
                "prose-headings:font-mono prose-headings:tracking-tight prose-headings:font-bold",
                "prose-p:font-mono prose-p:leading-6 prose-p:text-zinc-600 dark:prose-p:text-zinc-300",
                "prose-li:font-mono [&_a[data-card].peer]:no-underline",
              )}>
                {children}
              </div>
            </BlurFade>
          </article>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <BlurFade delay={BLUR_FADE_DELAY * 6}>
                <SidebarCard title="Project Links" icon={<Rocket className="w-3 h-3" />}>
                  <div className="flex flex-col gap-2">
                    {project.links?.map((link, i) => (
                      <Link key={i} href={link.url} target="_blank"
                        className="group flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all"
                      >
                        <span className="flex items-center gap-3 font-medium text-sm">
                          {link.icon && (
                            <span className="bg-background size-8 inline-flex items-center justify-center p-1.5 rounded-md border border-border shadow-sm group-hover:text-primary transition-colors">
                              <Icon name={link.icon as IconType} className="size-5" />
                            </span>
                          )}
                          {link.label}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                    {(!project.links || project.links.length === 0) && (
                      <span className="text-sm text-muted-foreground italic">No public links available.</span>
                    )}
                  </div>
                </SidebarCard>
              </BlurFade>
              <BlurFade delay={BLUR_FADE_DELAY * 7}>
                <SidebarCard title="Technology" icon={<Code2 className="w-3 h-3" />}>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <TechItem key={tech}>{tech}</TechItem>
                    ))}
                  </div>
                </SidebarCard>
              </BlurFade>
              <BlurFade delay={BLUR_FADE_DELAY * 8}>
                <SidebarCard title="Context" icon={<Layers className="w-3 h-3" />}>
                  <div className="space-y-3 text-sm">
                    <MetaRow label="Timeline" value={project.dates} />
                    <MetaRow label="Type" value={project.tags?.[0] || "Project"} />
                    <MetaRow label="Status" value={project.status} last />
                  </div>
                </SidebarCard>
              </BlurFade>
            </div>
          </aside>
        </div>
      </div>

      <OtherProjects currentProjectId={project.id} />
    </main>
  );
}

/*  DYNAMIC  */
function DynamicProjectPage({ project, children }: ProjectPageProps) {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 md:px-12 bg-background/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <ButtonLink href="/projects" variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> All Projects
          </ButtonLink>
          <span className="text-xs font-mono text-muted-foreground/40 hidden md:block">
            CASE_STUDY :: {project.id.toUpperCase()}
          </span>
        </div>
      </nav>

      {/* Full-bleed hero */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {project.video ? (
            <video src={project.video} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30" />
          ) : project.image ? (
            <Image src={project.image} alt={project.title} fill className="object-cover opacity-25" priority />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-20 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <StatusPill status={project.status} />
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-3" /> {project.dates}
            </span>
            {project.tags?.map((tag) => (
              <span key={tag} className="text-xs font-mono text-muted-foreground/60 border border-border/40 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground leading-[1.05] mb-6"
          >
            {project.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8"
          >
            {project.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-wrap gap-3"
          >
            {project.href && (
              <ButtonLink href={project.href} target="_blank" variant="dark" className="h-11 px-6 rounded-xl text-sm font-medium">
                <ExternalLink className="size-4" /> Visit Live Site
              </ButtonLink>
            )}
            {project.links?.map((link, i) => (
              <ButtonLink key={i} href={link.url} target="_blank" variant="outline" className="h-11 px-5 rounded-xl text-sm font-medium gap-2">
                {link.icon && <Icon name={link.icon as IconType} className="size-4" />}
                {link.label}
              </ButtonLink>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Metrics strip */}
      {project.metrics && project.metrics.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="border-y border-border/50 bg-muted/20 backdrop-blur-sm"
        >
          <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-border/50">
            {project.metrics.map((m, i) => (
              <div key={i} className="px-6 first:pl-0 last:pr-0 flex flex-col gap-1">
                <CountingNumber to={m.value} className="text-3xl font-bold font-mono tracking-tight text-foreground" suffix="+" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Content grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8"
          >
            <div className={cn(
              "prose dark:prose-invert max-w-none",
              "prose-headings:font-mono prose-headings:tracking-tight prose-headings:font-bold",
              "prose-p:font-mono prose-p:leading-6 prose-p:text-zinc-600 dark:prose-p:text-zinc-300",
              "prose-li:font-mono [&_a[data-card].peer]:no-underline",
            )}>
              {children}
            </div>
          </motion.article>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md p-6 shadow-xl"
              >
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Code2 className="size-3" /> Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted/60 border border-border/60 text-xs font-medium text-foreground/80">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md p-6 shadow-xl"
              >
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Layers className="size-3" /> Context
                </p>
                <div className="space-y-3 text-sm">
                  <MetaRow label="Timeline" value={project.dates} />
                  <MetaRow label="Type" value={project.tags?.[0] || "Project"} />
                  <MetaRow label="Status" value={project.status} last />
                </div>
              </motion.div>

              {project.links && project.links.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md p-6 shadow-xl"
                >
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <Rocket className="size-3" /> Links
                  </p>
                  <div className="flex flex-col gap-2">
                    {project.links.map((link, i) => (
                      <Link key={i} href={link.url} target="_blank"
                        className="group flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-primary/10 border border-border/40 hover:border-primary/30 transition-all"
                      >
                        <span className="flex items-center gap-3 text-sm font-medium">
                          {link.icon && (
                            <span className="size-7 rounded-lg bg-background border border-border flex items-center justify-center group-hover:text-primary transition-colors">
                              <Icon name={link.icon as IconType} className="size-4" />
                            </span>
                          )}
                          {link.label}
                        </span>
                        <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <OtherProjects currentProjectId={project.id} />
    </main>
  );
}

/*  Shared helpers  */
const StatusPill = ({ status, minimal }: { status: string; minimal?: boolean }) => {
  const styles: Record<string, string> = {
    shipped: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30",
    "in progress": "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/30",
    active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30",
    archived: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 ring-zinc-500/30",
    completed: "bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-blue-500/30",
  };
  const key = status?.toLowerCase();
  const activeStyle = styles[key] ?? "bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-blue-500/30";
  const isPulse = key === "shipped" || key === "active" || key === "in progress";

  if (minimal) {
    return <span className="font-mono text-[10px] uppercase tracking-widest">[{status}]</span>;
  }

  return (
    <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset", activeStyle)}>
      <span className="relative flex h-2 w-2">
        {isPulse && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />}
        <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
      </span>
      {status}
    </div>
  );
};

function SidebarCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function MetaRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={cn("flex justify-between py-2", !last && "border-b border-border/50")}>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  );
}

const TechItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-2 text-sm text-muted-foreground border border-border/50 bg-zinc-50/50 dark:bg-zinc-900/50 px-2.5 py-1.5 rounded-md list-none">
    <div className="w-1 h-1 rounded-full bg-primary/40" />
    {children}
  </li>
);