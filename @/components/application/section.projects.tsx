"use client";

import { DynamicHeading } from "@/components/application/dynamic.heading";
import {
  ExpandableProjectCards
} from "@/components/application/projects.card";
import BlurFade from "@/components/magicui/blur-fade";
import { ButtonLink, ButtonTransitionLink, TransitionLink } from "@/components/utils/link";
import { Serif, StoryChapter, StoryReveal } from "@/components/application/story.frame";
import { PersonaLens, useStoryLens } from "@/components/story/persona-lens";
import { StoryCardList } from "@/components/story/story-card-list";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { getProjectList } from "@/lib/project.source";
import { getStory } from "~/data/story";
import { motion, useReducedMotion } from "framer-motion";
import { StyleSwap } from "@/components/animated/style-swap";
import { ArrowRight, BarChart2, BoxIcon, FolderGit2, FolderOpen, Layers } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Icon } from "../icons";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel";

const BLUR_FADE_DELAY = 0.04;


const CTA_CARD =
  "group relative flex min-h-45 w-full flex-col overflow-hidden rounded-3xl border border-border/50 bg-muted/20 p-6 text-left transition-[background-color,border-color] duration-200 ease-out hoverable:border-border hoverable:bg-muted/50";

function ProjectsCta() {
  const reduce = useReducedMotion();

  return (
    <BlurFade delay={BLUR_FADE_DELAY * 14}>
      <div className="mx-auto mt-12 w-full max-w-4xl border-t border-border/40 pt-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          {/* Real anchors. These were <button onClick={router.push}> — no href,
              so no middle-click, no ctrl-click, no "open in new tab", and they
              announced as buttons rather than links. */}
          <TransitionLink href="/projects" className={CTA_CARD}>
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100" />
            <div className="relative z-10 mb-auto flex w-full items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl border border-border/50 bg-background text-foreground shadow-sm">
                <FolderOpen size={18} />
              </span>
              {/* whileHover on this child never fired — the pointer is on the
                  card, not on the 18px arrow. group-hover is the honest way. */}
              <ArrowRight
                size={18}
                className="mr-1 text-muted-foreground opacity-60 transition-[transform,opacity] duration-200 ease-out group-hover:translate-x-1 group-hover:opacity-100"
              />
            </div>
            <div className="relative z-10 mt-auto space-y-1">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Project archive
              </h3>
              <p className="text-sm text-muted-foreground">
                The complete collection of case studies.
              </p>
            </div>
            <Layers
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 -right-6 size-32 rotate-12 text-foreground/5 transition-transform duration-300 ease-out group-hover:rotate-0"
              strokeWidth={1}
            />
          </TransitionLink>

          <TransitionLink href="/stats" className={CTA_CARD}>
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-success/5 via-transparent to-transparent opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100" />
            <div className="relative z-10 mb-auto flex w-full items-center justify-between gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl border border-border/50 bg-background text-success shadow-sm">
                <BarChart2 size={18} />
              </span>
              <span className="flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-2.5 py-1">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                <span className="text-2xs font-bold uppercase tracking-wider text-success">
                  Live
                </span>
              </span>
            </div>
            <div className="relative z-10 mt-auto space-y-1">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Engineering metrics
              </h3>
              <p className="text-sm text-muted-foreground">
                Coding habits and activity trends.
              </p>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-20 transition-opacity duration-200 ease-out group-hover:opacity-40">
              <svg className="size-full" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
                <motion.path
                  d="M0,40 Q25,35 35,20 T70,25 T100,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-foreground"
                  initial={reduce ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                />
                <path
                  d="M0,40 Q25,35 35,20 T70,25 T100,5 L100,40 L0,40 Z"
                  className="fill-foreground/10"
                />
              </svg>
            </div>
          </TransitionLink>
        </div>
      </div>
    </BlurFade>
  );
}

/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */

function StoryProjects() {
  const [lens, setLens] = useStoryLens();
  // The same persona-lens case-study cards used on /journey, curated to the
  // featured projects. The lens is shared, so switching it here or on /journey
  // stays in sync.
  const chapters = useMemo(() => getStory().projects, []);

  return (
    <StoryChapter
      index={4}
      kicker="The proof"
      id="projects"
      title={<>Things I&apos;ve <Serif className="text-muted-foreground/80">shipped</Serif>.</>}
    >
      <div className="space-y-6">
        <PersonaLens value={lens} onChange={setLens} />
        <StoryCardList chapters={chapters} lens={lens} />
      </div>

      <StoryReveal delay={0.2} className="mt-8">
        <TransitionLink
          href="/journey"
          className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-foreground"
        >
          Read the full story
          <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-1" />
        </TransitionLink>
      </StoryReveal>
    </StoryChapter>
  );
}

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
                    <ButtonTransitionLink size="icon_sm" variant="ghost" href={`/projects/${project.id}`}>
                      <Icon name="link" className="pointer-events-none" />
                      <span className="sr-only">Open Project</span>
                    </ButtonTransitionLink>
                  </TooltipTrigger>
                  <TooltipContent>Open Project Details</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ButtonLink size="icon_sm" variant="ghost" href={project.href} target="_blank" rel="noopener">
                      <Icon name="arrow-up-right" className="pointer-events-none" />
                      <span className="sr-only">Open Project Link</span>
                    </ButtonLink>
                  </TooltipTrigger>
                  <TooltipContent>Open Project Link</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
          <div>
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
      className="w-full py-16 md:py-24 px-4 max-w-4xl mx-auto space-y-10"
    >
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="space-y-2">
          <motion.span
            layoutId="projects-label"
            className="inline-block font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground"
          >
            Portfolio
          </motion.span>
          <motion.h2
            layoutId="projects-heading"
            className="text-3xl font-bold tracking-tight md:text-4xl"
          >
            Projects
          </motion.h2>
          <p className="max-w-xl text-base text-muted-foreground">
            From full-stack applications to open-source libraries.
          </p>
        </div>
      </BlurFade>

      <div className="space-y-4">
        {projects.map((project, i) => (
          <BlurFade key={project.id} delay={BLUR_FADE_DELAY * (i + 3)}>
            <Link
              href={`/projects/${project.id}`}
              className="group -mx-4 flex gap-4 rounded-lg border-b border-border/50 px-4 py-5 transition-colors duration-150 ease-out last:border-0 hoverable:bg-accent/60"
            >
              {/* Status was colour-only — a green or grey dot with nothing to
                  read. The dot now carries a text label for everyone. */}
              <div className="shrink-0 pt-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "block size-2 rounded-full",
                    project.status === "active" ? "bg-success" : "bg-input",
                  )}
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold leading-snug text-foreground">
                    {project.title}
                    <span className="sr-only">
                      {project.status === "active" ? " — actively maintained" : " — archived"}
                    </span>
                  </h3>
                  <span className="shrink-0 font-mono text-2xs tabular-nums text-subtle-foreground">
                    {project.dates}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex rounded-sm bg-muted px-1.5 py-0.5 font-mono text-2xs text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="self-center text-2xs text-subtle-foreground">
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
      className="w-full space-y-16 px-6 py-24 md:px-12"
    >
      <BlurFade delay={BLUR_FADE_DELAY * 11}>
        <DynamicHeading
          id="projects"
          label="Portfolio"
          icon={FolderGit2}
          serif="Real world"
          lead="From full-stack applications to open-source libraries."
        >
          Projects
        </DynamicHeading>
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
    <StyleSwap swapKey={selectedStyle}>
      {selectedStyle === "minimal" ? (
        <MinimalProjects projects={projectsList} />
      ) : selectedStyle === "static" ? (
        <StaticProjects projects={projectsList} />
      ) : selectedStyle === "story" ? (
        <StoryProjects />
      ) : (
        <DynamicProjects projects={projectsList} />
      )}
    </StyleSwap>
  );
}
