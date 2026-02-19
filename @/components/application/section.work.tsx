"use client";

import { SectionHeader } from "@/components/application/sections.header";
import BlurFade from "@/components/magicui/blur-fade";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Building2, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

import { WorkExperienceCard } from "@/components/card.work";
import { StyleModels, StylingModel } from "@/constants/ui";

import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { getWorkExperienceList, WorkExperienceType } from "@/lib/work.source";
import { motion } from "framer-motion";
import defaultMdxComponents from "fumadocs-ui/mdx";

const BLUR_FADE_DELAY = 0.04;

const workExperiences = getWorkExperienceList();

export function WorkSection() {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <section
      id="work"
      className="max-w-5xl mx-auto w-full px-4 md:px-12 py-20 md:py-32"
    >
      {/* Header Animates on Load */}
      <BlurFade delay={BLUR_FADE_DELAY * 4}>
        <SectionHeader
          label="Career"
          serifText="Professional"
          mainText="Journey"
          description="A timeline of my professional roles and technical impact."
        />
      </BlurFade>

      <div className="relative mt-12 md:mt-16">
        {/* Timeline Connector Line */}
        <div
          className="hidden md:block absolute left-8 top-4 bottom-4 w-px bg-gradient-to-b from-border via-border/60 to-transparent z-0"
          aria-hidden="true"
        />

        <div className="space-y-8 md:space-y-12">
          {workExperiences.map((work, id) => (
            <motion.div
              key={work.company + work.startDate}
              // 2. Initial State: Hidden and slightly shifted down
              initial={{ opacity: 0, y: 50 }}
              // 3. Animate State: Visible and in place when in view
              whileInView={{ opacity: 1, y: 0 }}
              // 4. Viewport Config: Trigger once, with a slight margin offset
              viewport={{ once: true, margin: "-50px" }}
              // 5. Transition: Smooth spring or ease, slightly staggered based on index
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: id * 0.1, // Optional: Stagger the very first load
              }}
              className="z-10 relative" // Ensure z-index is above the timeline line
            >
              {/* Conditional Rendering of Card Style */}
              {selectedStyle === "dynamic" ? (
                <WorkCard work={work} />
              ) : (
                <WorkExperienceCard work={work} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
function WorkCard({ work }: { work: WorkExperienceType }) {
  const Mdx = work.body;

  return (
    <div className="relative md:grid md:grid-cols-[auto_1fr] md:gap-10">
      <div className="hidden md:flex relative z-10 flex-col items-center">
        <div className="relative flex items-center justify-center size-16 rounded-2xl border bg-background shadow-sm group-hover:border-primary/50 transition-colors">
          {/* Connector Line to Logo */}
          <div className="absolute -top-12 bottom-1/2 w-px bg-border -z-10" />

          <Avatar className="size-10 rounded-lg bg-transparent">
            <AvatarImage
              src={work.logoUrl}
              alt={work.company}
              className="object-contain p-1"
            />
            <AvatarFallback className="rounded-lg text-xs font-bold bg-muted text-muted-foreground">
              {work.company[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="group relative flex flex-col">
        <div className="relative p-5 md:p-8 rounded-3xl border border-border/60 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-border transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="flex md:hidden items-center gap-3 mb-4 border-b border-border/40 pb-4">
            <Avatar className="size-10 rounded-lg border bg-background">
              <AvatarImage src={work.logoUrl} className="object-contain p-1" />
              <AvatarFallback>{work.company[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-foreground">{work.company}</h4>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin size={10} />
                {work.locationType}
              </div>
            </div>
            <div className="ml-auto text-[10px] font-mono font-medium text-muted-foreground/70 bg-muted/50 px-2 py-1 rounded-full border border-border/50">
              {work.startDate} - {work.endDate ?? "Now"}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="space-y-1">
              <h3 className="text-lg md:text-2xl font-bold text-foreground tracking-tight leading-snug">
                {work.title}
              </h3>

              <div className="hidden md:flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                  <Building2 size={14} />
                  {work.company}
                  {work.href && (
                    <Link
                      href={work.href}
                      target="_blank"
                      className="p-2 rounded-full text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-all"
                    >
                      <ArrowUpRight size={18} className="size-4" />
                    </Link>
                  )}
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {work.locationType}
                </span>
              </div>
            </div>

            <div className="hidden md:block self-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-xs font-mono font-medium text-foreground/70 whitespace-nowrap">
                <Calendar size={12} className="text-muted-foreground" />
                {work.startDate} — {work.endDate ?? "Present"}
              </div>
            </div>
          </div>

          {/* Body: Markdown Description */}
          <div
            className={cn(
              "prose dark:prose-invert max-w-none",
              "prose-headings:font-mono prose-headings:tracking-tight prose-headings:font-bold",
              "prose-p:font-mono prose-p:leading-6 prose-p:text-zinc-600 dark:prose-p:text-zinc-300",
              "prose-li:font-mono",

              // override typography anchor underline
              "[&_a[data-card].peer]:no-underline",
              "text-muted-foreground max-w-none mb-6 text-sm md:text-base leading-relaxed",
              // "prose-pre:border prose-pre:border-border/50 prose-pre:bg-zinc-950",
              // "prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none"
            )}
          >
            <Mdx components={defaultMdxComponents} />
          </div>

          {/* Footer: Tech Stack Badges */}
          {work.badges && work.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
              {work.badges.map((badge) => (
                <Badge
                  key={badge}
                  variant="secondary"
                  className="px-2 py-0.5 text-[10px] font-medium bg-muted/50 text-muted-foreground hover:bg-muted transition-colors border-transparent hover:border-border"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
