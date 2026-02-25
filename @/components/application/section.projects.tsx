"use client";
import {
  ExpandableProjectCards
} from "@/components/application/projects.card";
import BlurFade from "@/components/magicui/blur-fade";
import { ButtonLink, ButtonTransitionLink } from "@/components/utils/link";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { getProjectList } from "@/lib/project.source";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BarChart2, BoxIcon, FolderOpen, Layers } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Icon } from "../icons";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel";

const BLUR_FADE_DELAY = 0.04;


function ProjectsCta() {
  return (
    <BlurFade delay={BLUR_FADE_DELAY * 14}>
      <div className="w-full max-w-4xl mx-auto mt-12 pt-12 border-t border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <ButtonTransitionLink
            href="/projects"
            className="group relative flex flex-col h-[180px] w-full p-6 rounded-3xl bg-muted/20 border border-border/50 hover:bg-muted/40 hover:border-border transition-all duration-300 overflow-hidden text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex justify-between items-center w-full mb-auto">
              <div className="flex items-center justify-center size-10 rounded-xl bg-background border border-border/50 shadow-sm text-foreground">
                <FolderOpen size={18} />
              </div>
              <motion.div
                initial={{ x: 0, opacity: 0.6 }}
                whileHover={{ x: 5, opacity: 1 }}
                className="text-muted-foreground pr-1"
              >
                <ArrowRight size={18} />
              </motion.div>
            </div>
            <div className="relative z-10 space-y-1 mt-auto">
              <h3 className="text-lg font-semibold text-foreground tracking-tight">
                Project Archive
              </h3>
              <p className="text-sm text-muted-foreground/80 font-medium line-clamp-1">
                The complete collection of case studies.
              </p>
            </div>
            <Layers
              className="absolute -bottom-6 -right-6 text-foreground/5 size-32 rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500 ease-out pointer-events-none"
              strokeWidth={1}
            />
          </ButtonTransitionLink>

          <ButtonTransitionLink
            href="/stats"
            className="group relative flex flex-col h-[180px] w-full p-6 rounded-3xl bg-muted/20 border border-border/50 hover:bg-muted/40 hover:border-border transition-all duration-300 overflow-hidden text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex justify-between items-center w-full mb-auto">
              <div className="flex items-center justify-center size-10 rounded-xl bg-background border border-border/50 shadow-sm text-emerald-600 dark:text-emerald-400">
                <BarChart2 size={18} />
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Live
                </span>
              </div>
            </div>
            <div className="relative z-10 space-y-1 mt-auto">
              <h3 className="text-lg font-semibold text-foreground tracking-tight">
                Engineering Metrics
              </h3>
              <p className="text-sm text-muted-foreground/80 font-medium line-clamp-1">
                View coding habits &amp; activity trends.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <motion.path
                  d="M0,40 Q25,35 35,20 T70,25 T100,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-foreground"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <path
                  d="M0,40 Q25,35 35,20 T70,25 T100,5 L100,40 L0,40 Z"
                  className="fill-foreground/10"
                />
              </svg>
            </div>
          </ButtonTransitionLink>
        </div>
      </div>
    </BlurFade>
  );
}

/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */

function MinimalProjects({ projects }: { projects: ReturnType<typeof getProjectList> }) {
  return (
    <Panel id="projects">
      <PanelHeader>
        <motion.div layoutId="projects-label" className="contents">
          <PanelTitle>
            Projects
            <PanelTitleSup>({projects.length})</PanelTitleSup>
          </PanelTitle>
        </motion.div>
      </PanelHeader>

      {projects.map((project) => (
        <div key={project.id}>
          <div className="flex items-center hover:bg-accent-muted">
            <div
              className="mx-4 flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted text-muted-foreground ring-1 ring-edge ring-offset-1 ring-offset-background select-none"
              aria-hidden="true"
            >
              <BoxIcon className="size-4" />
            </div>
            <div className="flex-1 border-l border-dashed border-edge">
              <div className="flex w-full items-center gap-2 p-4 pr-2 text-left">
                <Link href={`/projects/${project.id}`} className="flex-1">
                  <h3 className="mb-1 leading-snug font-medium text-balance">
                    {project.title}
                  </h3>
                  <dl className="text-sm text-muted-foreground">
                    <dt className="sr-only">Period</dt>
                    <dd>{project.dates}</dd>
                  </dl>
                </Link>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ButtonTransitionLink size="icon" variant="ghost" href={`/projects/${project.id}`}>
                      <Icon name="link" className="pointer-events-none size-4" />
                      <span className="sr-only">Open Project</span>
                    </ButtonTransitionLink>
                  </TooltipTrigger>
                  <TooltipContent><p>Open Project Details</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ButtonLink size="icon" variant="ghost" href={project.href} target="_blank" rel="noopener">
                      <Icon name="arrow-up-right" className="pointer-events-none size-4" />
                      <span className="sr-only">Open Project Link</span>
                    </ButtonLink>
                  </TooltipTrigger>
                  <TooltipContent><p>Open Project Link</p></TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="space-y-4 border-t border-edge p-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {project.description}
              </p>
              {project.technologies.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                  {project.technologies.map((technology, index) => (
                    <li key={index} className="flex">
                      <Badge>{technology}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ))}
    </Panel>
  );
}

function StaticProjects({ projects }: { projects: ReturnType<typeof getProjectList> }) {
  return (
    <section
      id="projects"
      className="w-full py-16 md:py-24 px-4 max-w-3xl mx-auto space-y-10"
    >
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="space-y-2">
          <motion.span
            layoutId="projects-label"
            className="inline-block text-xs font-mono font-medium tracking-widest uppercase text-muted-foreground"
          >
            // Portfolio
          </motion.span>
          <motion.h2
            layoutId="projects-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Projects
          </motion.h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl">
            From full-stack applications to open-source libraries.
          </p>
        </div>
      </BlurFade>

      <div className="space-y-4">
        {projects.map((project, i) => (
          <BlurFade key={project.id} delay={BLUR_FADE_DELAY * (i + 3)}>
            <Link
              href={`/projects/${project.id}`}
              className="group flex gap-4 py-5 border-b border-border/50 last:border-0 -mx-4 px-4 rounded-lg hover:bg-muted/20 transition-colors"
            >
              {/* Status dot */}
              <div className="shrink-0 pt-1.5">
                <span
                  className={`block size-2 rounded-full mt-1 ${
                    project.status === "active"
                      ? "bg-emerald-500"
                      : "bg-border"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-foreground/80 transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground/50 tabular-nums">
                    {project.dates}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex px-1.5 py-0.5 rounded-sm bg-muted/60 text-[10px] font-mono text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] text-muted-foreground/50 self-center">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          </BlurFade>
        ))}
      </div>

      <ProjectsCta />
    </section>
  );
}

function DynamicProjects({ projects }: { projects: ReturnType<typeof getProjectList> }) {
  return (
    <section
      id="projects"
      className="w-full py-32 px-6 md:px-12 max-w-app mx-auto space-y-16"
    >
      <BlurFade delay={BLUR_FADE_DELAY * 11}>
        <div className="mb-4">
          <motion.span
            layoutId="projects-label"
            className="inline-block text-xs font-mono font-medium tracking-widest uppercase text-muted-foreground mb-3"
          >
            // Portfolio
          </motion.span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <motion.h2
              layoutId="projects-heading"
              className="text-4xl md:text-6xl font-bold tracking-tighter leading-none"
            >
              <span className="font-instrument-serif italic font-normal text-muted-foreground/70 mr-3">
                Real world
              </span>
              Projects
            </motion.h2>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed md:text-right">
              From full-stack applications to open-source libraries.
            </p>
          </div>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-border via-border/40 to-transparent" />
        </div>
      </BlurFade>

      <ExpandableProjectCards cards={projects} />

      <ProjectsCta />
    </section>
  );
}


export default function ProjectsSection() {
  const projectsList = useMemo(() => getProjectList(), []);
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="projects-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <MinimalProjects projects={projectsList} />
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="projects-static"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StaticProjects projects={projectsList} />
        </motion.div>
      ) : (
        <motion.div
          key="projects-dynamic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
            <DynamicProjects projects={projectsList} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
