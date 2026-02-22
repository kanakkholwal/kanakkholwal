"use client";
import {
  ExpandableProjectCards,
  SimpleProjectCards,
} from "@/components/application/projects.card";
import BlurFade from "@/components/magicui/blur-fade";
import { ButtonTransitionLink } from "@/components/utils/link";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { getProjectList } from "@/lib/project.source";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, BoxIcon, FolderOpen, Layers } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Icon } from "../icons";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel";
import { SectionHeader } from "./sections.header";

const BLUR_FADE_DELAY = 0.04;

export function ProjectsSection() {
  const projectsList = useMemo(() => getProjectList(), []);

  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  if (selectedStyle === "minimal") {
    return <Panel id="projects">
      <PanelHeader>
        <PanelTitle>
          Projects
          <PanelTitleSup>({projectsList.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      {projectsList.map((project) => {
        return (
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
                      <dd className="flex items-center gap-0.5">
                        <span>{project.dates}</span>

                      </dd>
                    </dl>
                  </Link>

                    <Tooltip>
                      <TooltipTrigger>
                        <a
                          className="relative flex size-6 shrink-0 items-center justify-center text-muted-foreground after:absolute after:-inset-2 hover:text-foreground"
                          href={`/projects/${project.id}`}
                  
                        >
                          <Icon name="link" className="pointer-events-none size-4" />
                          <span className="sr-only">Open Project</span>
                        </a>
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Open Project Details</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <a
                          className="relative flex size-6 shrink-0 items-center justify-center text-muted-foreground after:absolute after:-inset-2 hover:text-foreground"
                          href={project.href}
                          target="_blank"
                          rel="noopener"
                        >
                          <Icon name="arrow-up-right" className="pointer-events-none size-4" />
                          <span className="sr-only">Open Project Link</span>
                        </a>
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Open Project Link</p>
                      </TooltipContent>
                    </Tooltip>

                </div>
              </div>
            </div>

            <div className="overflow-hidden">
              <div className="space-y-4 border-t border-edge p-4">
                <div className="text-sm text-muted-foreground line-clamp-3">
                  {project.description}
                </div>

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
        )

      })}
    </Panel>
  }

  return (
    <section
      id="projects"
      className="w-full py-32 px-6 md:px-12 max-w-(--max-app-width) mx-auto space-y-16"
    >
      <BlurFade delay={BLUR_FADE_DELAY * 11}>
        <SectionHeader
          label="Portfolio"
          serifText="Real world"
          mainText="Projects"
          description="From full-stack applications to open-source libraries. A curation of my best engineering efforts."
        />
      </BlurFade>

      {selectedStyle === "dynamic" ? (
        <ExpandableProjectCards cards={projectsList} />
      ) : (
        <SimpleProjectCards cards={projectsList} />
      )}

      <BlurFade delay={BLUR_FADE_DELAY * 14}>
        <div className="w-full max-w-4xl mx-auto mt-12 pt-12 border-t border-border/40 relative">
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
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
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
                  View coding habits & activity trends.
                </p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 40"
                  preserveAspectRatio="none"
                >
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
    </section>
  );
}
