"use client";

import { WorkExperienceCard } from "@/components/card.work";
import BlurFade from "@/components/magicui/blur-fade";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StyleModels, StylingModel } from "@/constants/ui";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BriefcaseBusinessIcon, InfinityIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { getWorkExperienceList, WorkExperienceType } from "@/lib/work.source";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { useMemo } from "react";
import { Collapsible, CollapsibleContent, CollapsibleIcon, CollapsibleTrigger } from "../ui/collapsible";
import { Separator } from "../ui/separator";
import { Panel, PanelHeader, PanelTitle } from "./panel";

const BLUR_FADE_DELAY = 0.04;


function MinimalWork({ experiences }: { experiences: WorkExperienceType[] }) {
  return (
    <Panel id="experience">
      <PanelHeader>
        <motion.div layoutId="work-label" className="contents">
          <PanelTitle>Experience</PanelTitle>
        </motion.div>
      </PanelHeader>
      <div className="pr-2 pl-4">
        {experiences.map((experience) => (
          <ExperienceItem
            key={experience.company + experience.startDate}
            experience={experience}
          />
        ))}
      </div>
    </Panel>
  );
}

function StaticWork({ experiences }: { experiences: WorkExperienceType[] }) {
  return (
    <section
      id="work"
      className="max-w-3xl mx-auto w-full px-4 py-16 md:py-24"
    >
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="mb-10 space-y-2">
          <motion.span
            layoutId="work-label"
            className="inline-block text-xs font-mono font-medium tracking-widest uppercase text-muted-foreground"
          >
            // Career
          </motion.span>
          <motion.h2
            layoutId="work-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Professional Journey
          </motion.h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl">
            A timeline of my professional roles and technical impact.
          </p>
        </div>
      </BlurFade>

      <div className="space-y-6">
        {experiences.map((work, i) => (
          <BlurFade key={work.company + work.startDate} delay={BLUR_FADE_DELAY * (i + 3)}>
            <WorkExperienceCard work={work} />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

function DynamicWork({ experiences }: { experiences: WorkExperienceType[] }) {
  return (
    <section
      id="work"
      className="max-w-app mx-auto w-full px-4 md:px-12 py-20 md:py-32"
    >
      {/* Header */}
      <BlurFade delay={BLUR_FADE_DELAY * 4}>
        <div className="mb-16 md:mb-24">
          <motion.span
            layoutId="work-label"
            className="inline-block text-xs font-mono font-medium tracking-widest uppercase text-muted-foreground mb-3"
          >
            // Career
          </motion.span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <motion.h2
              layoutId="work-heading"
              className="text-4xl md:text-6xl font-bold tracking-tighter leading-none"
            >
              <span className="font-instrument-serif italic font-normal text-muted-foreground/70 mr-3">
                Professional
              </span>
              Journey
            </motion.h2>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed md:text-right">
              A record of roles, responsibilities,<br className="hidden md:block" /> and technical impact.
            </p>
          </div>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-border via-border/40 to-transparent" />
        </div>
      </BlurFade>

      {/* Cards */}
      <div className="space-y-0">
        {experiences.map((work, i) => (
          <motion.div
            key={work.company + work.startDate}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
          >
            <WorkCard work={work}/>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


export default function WorkSection() {
  const workExperiences = useMemo(() => getWorkExperienceList(), []);
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="work-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <MinimalWork experiences={workExperiences} />
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="work-static"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StaticWork experiences={workExperiences} />
        </motion.div>
      ) : (
        <motion.div
          key="work-dynamic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
            <DynamicWork experiences={workExperiences} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ExperienceItem({ experience }: { experience: WorkExperienceType }) {
  const Mdx = experience.body;
  return (
    <Collapsible  className="screen-line-after space-y-4 py-4 relative">
      <div
        className={cn(
          "group block w-full text-left  pl-4",
          "relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:-z-1 before:rounded-lg before:transition-[background-color] before:ease-out hover:before:bg-accent-muted",
          "data-disabled:before:content-none"
        )}
      >
        <div className="relative z-1 mb-1 flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              "bg-muted text-muted-foreground",
              !experience.logoUrl && "border border-muted-foreground/15 ring-1 ring-edge ring-offset-1 ring-offset-background"
            )}
            aria-hidden
          >
            {experience.logoUrl ? (
              <Image
                src={experience.logoUrl}
                alt={`${experience.company} logo`}
                width={36}
                height={36}
                quality={100}
                className="rounded-full"
                unoptimized
                aria-hidden
              />
            ) : (
              <BriefcaseBusinessIcon className="size-4" />
            )}

          </div>
          <div>

            <h4 className="flex-1 text-balance leading-snug font-semibold">
              {experience.href ? (
                <a
                  className="underline-offset-4 hover:underline"
                  href={experience.href}
                  target="_blank"
                  rel="noopener"
                >
                  {experience.company}
                </a>
              ) : (
                experience.company
              )} {` - `}
              {experience.position}
            </h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {experience.employmentType && (
                <>
                  <dl>
                    <dt className="sr-only">Employment Type</dt>
                    <dd>{experience.employmentType}</dd>
                  </dl>

                  <Separator
                    className="data-[orientation=vertical]:h-4"
                    orientation="vertical"
                  />
                </>
              )}

              <dl>
                <dt className="sr-only">Employment Period</dt>
                <dd className="flex items-center gap-0.5">
                  <span>{experience.startDate}</span>
                  <span className="font-mono">—</span>
                  {experience.isOngoing ? (
                    <>
                      <InfinityIcon
                        className="size-4.5 translate-y-[0.5px]"
                        aria-hidden
                      />
                      <span className="sr-only">Present</span>
                    </>
                  ) : (
                    <span>{experience.endDate}</span>
                  )}
                </dd>
              </dl>
            </div>
            <CollapsibleTrigger className="inline-flex items-center gap-1 absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-primary transition-opacity">
              <CollapsibleIcon className="size-4 text-foreground" />
            </CollapsibleTrigger>
          </div>

        </div>


      </div>

      <CollapsibleContent
        className={cn(
          "prose dark:prose-invert max-w-none",
          "prose-headings:font-mono prose-headings:tracking-tight prose-headings:font-bold",
          "prose-p:font-mono prose-p:leading-6 prose-p:text-zinc-600 dark:prose-p:text-zinc-300",
          "prose-li:font-mono",
          "pt-2 pl-9",
          // override typography anchor underline
          "[&_a[data-card].peer]:no-underline",
          "text-muted-foreground max-w-none mb-6 text-sm md:text-base leading-relaxed",
          // "prose-pre:border prose-pre:border-border/50 prose-pre:bg-zinc-950",
          // "prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none"
        )}
      >
        <Mdx components={defaultMdxComponents} />
      </CollapsibleContent>

      {Array.isArray(experience.badges) && experience.badges.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 pt-3 pl-9">
          {experience.badges.map((badge, index) => (
            <li key={index} className="flex">
              <Badge>{badge}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Collapsible>
  )
}
function WorkCard({ work }: { work: WorkExperienceType }) {
  const Mdx = work.body;

  return (
    <div className="group relative flex gap-6 md:gap-10 py-10 border-b border-border/40 last:border-0">

      <div className="relative flex flex-col items-center shrink-0 w-10">
        {/* Spine line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-border/60 to-transparent" />
        {/* Avatar node — sits on top of the line */}
        <div className="relative z-10 mt-1 rounded-xl border border-border/60 bg-background shadow-sm group-hover:border-primary/30 group-hover:shadow-[0_0_14px_2px_hsl(var(--primary)/0.15)] transition-all duration-500">
          <Avatar className="size-10 rounded-xl bg-muted/40">
            <AvatarImage src={work.logoUrl} alt={work.company} className="object-contain p-1" />
            <AvatarFallback className="rounded-xl text-[11px] font-bold text-muted-foreground">
              {work.company[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1 space-y-4">

        {/* Top row — company + date */}
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <div className="flex items-center gap-2 min-w-0">
            {work.href ? (
              <Link
                href={work.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex items-center gap-1 text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors"
              >
                {work.company}
                <ArrowUpRight className="size-3 text-muted-foreground/40 group-hover/link:text-foreground transition-colors shrink-0" />
              </Link>
            ) : (
              <span className="text-sm font-semibold text-foreground/80">{work.company}</span>
            )}
            <span className="text-muted-foreground/30 text-xs select-none">·</span>
            <span className="text-xs text-muted-foreground/60 font-mono truncate">{work.locationType}</span>
          </div>
          <time className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground/50" dateTime={work.startDate}>
            {work.startDate} — {work.endDate ?? "Present"}
          </time>
        </div>

        {/* Role title */}
        <h3 className="text-xl md:text-3xl font-bold tracking-tight leading-snug text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-muted-foreground transition-all duration-500">
          {work.title}
          {work.employmentType && (
            <span className="ml-3 align-middle font-mono text-[10px] font-normal text-muted-foreground/50 uppercase tracking-widest not-italic">
              {work.employmentType}
            </span>
          )}
        </h3>

        {/* Body */}
        <div className={cn(
          "prose dark:prose-invert max-w-none text-sm",
          "prose-p:my-0 prose-p:leading-relaxed prose-p:text-muted-foreground",
          "prose-li:text-muted-foreground prose-li:my-0.5",
          "prose-ul:my-1 prose-ul:pl-4",
          "[&_a[data-card].peer]:no-underline",
        )}>
          <Mdx components={defaultMdxComponents} />
        </div>

        {/* Badges */}
        {Array.isArray(work.badges) && work.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {work.badges.map((badge) => (
              <Badge
                key={badge}
                variant="secondary"
                className="px-2 py-0 h-5 text-[10px] font-mono font-normal rounded-sm bg-muted/60 text-muted-foreground border-transparent"
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WorkCardMeta({ work, align = "left" }: { work: WorkExperienceType; align?: "left" | "right" }) {
  return (
    <div className={cn("space-y-3", align === "right" && "flex flex-col items-end")}>
      <div className={cn("flex items-center gap-3", align === "right" && "flex-row-reverse")}>
        <Avatar className="size-10 rounded-xl border border-border/60 bg-muted/40 shadow-sm">
          <AvatarImage src={work.logoUrl} alt={work.company} className="object-contain p-1" />
          <AvatarFallback className="rounded-xl text-[11px] font-bold text-muted-foreground">
            {work.company[0]}
          </AvatarFallback>
        </Avatar>
        <div className={cn(align === "right" && "text-right")}>
          {work.href ? (
            <Link
              href={work.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group/link flex items-center gap-1 text-sm font-semibold text-foreground/90 hover:text-foreground transition-colors",
                align === "right" && "flex-row-reverse"
              )}
            >
              {work.company}
              <ArrowUpRight className="size-3 text-muted-foreground/40 group-hover/link:text-foreground transition-colors" />
            </Link>
          ) : (
            <span className="text-sm font-semibold text-foreground/90">{work.company}</span>
          )}
          <p className="text-[11px] text-muted-foreground/60 font-mono">{work.locationType}</p>
        </div>
      </div>
    </div>
  );
}
