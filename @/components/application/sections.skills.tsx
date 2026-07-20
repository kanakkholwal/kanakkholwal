"use client";

import { StyleSwap } from "@/components/animated/style-swap";
import { Serif, StoryChapter, StoryReveal } from "@/components/application/story.frame";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { motion } from "framer-motion";
import { Cloud, Database, Layout, Server, Terminal } from "lucide-react";
import Image from "next/image";
import { appConfig } from "root/project.config";

import BlurFade from "@/components/magicui/blur-fade";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DynamicSection, StaticSection } from "./base.ui";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";
import { BentoSkillsSection } from "./skills.bento";

const BLUR_FADE_DELAY = 0.04;

const CATEGORIES = [
  {
    id: "backend",
    title: "Backend & API",
    icon: Server,
    description: "Scalable server-side architectures.",
    className: "md:col-span-1 lg:col-span-1",
    skills: appConfig.skills.backend,
  },
  {
    id: "frontend",
    title: "Frontend Engineering",
    icon: Layout,
    description: "Building responsive, pixel-perfect web experiences.",
    className: "md:col-span-2 lg:col-span-2",
    skills: appConfig.skills.frontend,
  },
  {
    id: "database",
    title: "Database & State",
    icon: Database,
    description: "Data modeling and persistence.",
    className: "md:col-span-1 lg:col-span-1",
    skills: appConfig.skills.database,
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    icon: Cloud,
    description: "Deployment, CI/CD, and infrastructure.",
    className: "md:col-span-2 lg:col-span-2",
    skills: appConfig.skills.devops,
  },
  {
    id: "tools",
    title: "Tools & Environment",
    icon: Terminal,
    description: "Workflow optimization and design.",
    className: "md:col-span-2 lg:col-span-2",
    skills: appConfig.skills.tools,
  },
];
export type SkillCategory = (typeof CATEGORIES)[number];


function StorySkills() {
  const groups = [
    { label: "Backend", items: appConfig.skills.backend },
    { label: "Data", items: appConfig.skills.database },
    { label: "Infra", items: appConfig.skills.devops },
    { label: "Frontend", items: appConfig.skills.frontend },
    { label: "Tools", items: appConfig.skills.tools },
  ];
  return (
    <StoryChapter
      index={3}
      kicker="The craft"
      id="stack"
      title={<>The tools I <Serif className="text-muted-foreground/80">reach for</Serif>.</>}
    >
      <div className="space-y-4">
        {groups.map((group, i) => (
          <StoryReveal
            key={group.label}
            delay={Math.min(i * 0.05, 0.25)}
            className="flex flex-col gap-1 sm:flex-row sm:gap-6"
          >
            <p className="w-24 shrink-0 pt-0.5 font-mono text-xs uppercase tracking-widest text-muted-foreground/70">
              {group.label}
            </p>
            <p className="text-sm leading-relaxed text-foreground/85">
              {group.items.join("  ·  ")}
            </p>
          </StoryReveal>
        ))}
      </div>
    </StoryChapter>
  );
}

function MinimalSkills() {
  const allSkills = Array.from(new Set([
    ...appConfig.skills.backend,
    ...appConfig.skills.database,
    ...appConfig.skills.devops,
    ...appConfig.skills.frontend,
    ...appConfig.skills.tools
  ]));
  return (
    <Panel id="stack">
      <PanelHeader>
        <motion.div layoutId="skills-label" className="contents">
          <PanelTitle>Stack</PanelTitle>
        </motion.div>
      </PanelHeader>
      <PanelContent>
        <ul className="flex flex-wrap gap-4 select-none group mx-auto justify-center">
          {allSkills.map((tech) => (
            <li key={tech} className="flex">
              <Tooltip>
                <TooltipTrigger>
                  <Image
                    src={`https://skillicons.dev/icons?i=${tech}`}
                    alt={`${tech} icon`}
                    width={64}
                    height={64}
                    className="size-10 md:size-12 object-contain grayscale opacity-70 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
                    unoptimized
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tech}</p>
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </PanelContent>
    </Panel>
  );
}

function StaticSkills() {
  return (
    <StaticSection
      id="skills"
    >
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="mb-10 space-y-2">
          <motion.span
            layoutId="skills-label"
            className="inline-block text-xs font-mono font-medium tracking-widest uppercase text-muted-foreground"
          >
            // The Toolkit
          </motion.span>
          <motion.h2
            layoutId="skills-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Technical Arsenal
          </motion.h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl">
            A comprehensive suite of tools and technologies I use to architect
            scalable digital solutions.
          </p>
        </div>
      </BlurFade>

      <div className="space-y-10">
        {CATEGORIES.map((category, i) => (
          <BlurFade key={category.id} delay={BLUR_FADE_DELAY * (i + 3)}>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <category.icon className="size-4 text-muted-foreground/70 shrink-0" />
                <h3 className="text-sm font-semibold text-foreground/80 tracking-tight">
                  {category.title}
                </h3>
                <div className="flex-1 h-px bg-border/60" />
              </div>
              <ul className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-1.5 group/skill">
                    <Image
                      src={`https://skillicons.dev/icons?i=${skill}`}
                      alt={`${skill} icon`}
                      width={32}
                      height={32}
                      className="size-6 object-contain grayscale opacity-60 group-hover/skill:grayscale-0 group-hover/skill:opacity-100 transition-all duration-300"
                      unoptimized
                    />
                    <span className="text-xs font-mono text-muted-foreground group-hover/skill:text-foreground transition-colors capitalize">
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </BlurFade>
        ))}
      </div>
    </StaticSection>
  );
}

function DynamicSkills() {
  return (
    <DynamicSection
      id="skills"
      className="relative overflow-hidden"
    >

      <div className="flex flex-col items-center text-center mb-16 space-y-4 relative z-10">
        <motion.span
          layoutId="skills-label"
          className="text-sm font-mono text-muted-foreground uppercase tracking-widest"
        >
          {`// The Toolkit`}
        </motion.span>
        <motion.h2
          layoutId="skills-heading"
          className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground"
        >
          <span className="font-instrument-serif italic font-normal text-muted-foreground/80 mr-3">
            My Technical
          </span>
          <span>Arsenal</span>
        </motion.h2>
        <p className="max-w-xl text-muted-foreground text-lg">
          A comprehensive suite of tools and technologies I use to architect
          scalable digital solutions.
        </p>
      </div>

      <BentoSkillsSection categories={CATEGORIES} />
    </DynamicSection>
  );
}

export default function SkillSection() {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <StyleSwap swapKey={selectedStyle}>
      {selectedStyle === "minimal" ? (
        <MinimalSkills />
      ) : selectedStyle === "static" ? (
        <StaticSkills />
      ) : selectedStyle === "story" ? (
        <StorySkills />
      ) : (
        <DynamicSkills />
      )}
    </StyleSwap>
  );
}
