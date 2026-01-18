"use client";
import { GlowFillButton } from "@/components/animated/button.fill";
import { CountingNumber } from "@/components/animated/text.counter";
import { RollingText } from "@/components/animated/text.rolling";
import { Icon } from "@/components/icons";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphLegend,
  ContributionGraphTotalCount
} from "@/components/kibo-ui/contribution-graph";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ButtonLink,
  TransitionLink
} from "@/components/utils/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GitFork, Star, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { appConfig, resume_link } from "root/project.config";
import { Contributions } from "~/api/github";

import { OrbitingCircles } from "@/components/animated/elements.orbiting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";



export function HeroSection() {
  return (
    <section
      id="hero"
      className={"relative grid lg:grid-cols-12 items-center gap-12 px-6 lg:px-12 min-h-[92vh] max-w-7xl mx-auto w-full pt-24 md:pt-0 overflow-hidden lg:overflow-visible"}
    >
      <div className="flex flex-col gap-8 justify-center text-center md:text-left lg:col-span-7 z-20 pt-10">


        {/* 1. Identity Kicker (The "Hi, I'm Kanak" part) */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 flex-wrap"
          >
            {/* Stripe-style Status Badge */}
            <Badge
              variant="outline"
              className="pl-2 pr-4 py-1.5 rounded-full border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md text-slate-700 dark:text-slate-300 shadow-sm"
            >
              <span className="relative flex h-2 w-2 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold tracking-wide whitespace-nowrap">AVAILABLE FOR WORK</span>
            </Badge>

            <span className="text-sm font-mono text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              {`// Hi, I am ${appConfig.name}`}
            </span>
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-metallic leading-[0.9]">
              Building digital products for
              <br />
              <span className="text-titanium">
                modern web.
              </span>
            </h1>
          </div>
        </div>
        <RollingText
          className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed mx-auto md:mx-0 font-medium"
          text={appConfig.description}
          delay={0.3}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap justify-center md:justify-start gap-4 mt-4"
        >
          <ButtonLink
            variant="dark"
            href={resume_link}
            target="_blank"
            size="lg"
            rounded="full"
            className="h-12 px-8 text-base shadow-xl shadow-slate-900/10 dark:shadow-black/20 transition-transform hover:scale-105 active:scale-95"
          >
            Download Resume <Icon name="arrow-up-right" className="ml-2 w-5 h-5" />
          </ButtonLink>

          <GlowFillButton
            icon={ArrowRight}
            className="h-12 px-8 my-0 bg-transparent rounded-full font-semibold"
          >
            <TransitionLink href="/projects">View Projects</TransitionLink>
          </GlowFillButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:col-span-5 md:flex justify-center lg:justify-end z-10 pointer-events-none lg:pointer-events-auto"
      >
        <OrbitingIdentity />
      </motion.div>
    </section>
  );
}
function OrbitingIdentity() {
  return (
    <div className="relative flex h-[500px] w-full max-w-[500px] flex-col items-center justify-center overflow-visible">

      <div className="absolute inset-0 bg-gradient-radial from-indigo-500/15 via-transparent to-transparent blur-3xl -z-10 scale-150" />

      <div className="relative z-10 p-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 shadow-2xl">
        <Avatar className="size-36 md:size-48 border-4 border-background ring-4 ring-slate-100 dark:ring-slate-800">
          <AvatarImage
            alt={appConfig.name}
            src={appConfig.logo}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl font-bold bg-slate-100 dark:bg-slate-900">
            {appConfig.initials}
          </AvatarFallback>
        </Avatar>
      </div>

      <OrbitingCircles iconSize={50} radius={190} speed={0.8}>
        {appConfig.skill_icons
          .slice(0, appConfig.skill_icons.length / 2)
          .map((skill, index) => (
            // Wrap icons in glass containers for a premium feel
            <div key={index} className="p-2 rounded-full bg-background/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 dark:border-slate-700/30 shadow-sm">
              <Image
                width={40}
                height={40}
                alt={skill}
                className="size-10 object-contain"
                src={`https://skillicons.dev/icons?i=${skill}`}
                unoptimized
              />
            </div>
          ))}
      </OrbitingCircles>

      <OrbitingCircles iconSize={40} radius={260} reverse speed={1.2} className="opacity-70">
        {appConfig.skill_icons
          .slice(appConfig.skill_icons.length / 2)
          .map((skill, index) => (
            <div key={index} className="p-1.5 rounded-full bg-background/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-slate-800/20 shadow-sm">
              <Image
                width={30}
                height={30}
                alt={skill}
                className="size-8 object-contain"
                src={`https://skillicons.dev/icons?i=${skill}`}
                unoptimized
              />
            </div>
          ))}
      </OrbitingCircles>
    </div>
  );
}


// Configuration for the stats to keep code clean
// We use 'group-hover' to reveal colors only when interacting
const STATS_CONFIG = [
  {
    label: "Followers",
    icon: Users,
    key: "followers",
    hoverColor: "group-hover:text-purple-500",
  },
  {
    label: "Total Stars",
    icon: Star,
    key: "stars",
    hoverColor: "group-hover:text-amber-500",
  },
  {
    label: "Public Repos",
    icon: BookOpen,
    key: "repos",
    hoverColor: "group-hover:text-emerald-500",
  },
  {
    label: "Total Forks",
    icon: GitFork,
    key: "forks",
    hoverColor: "group-hover:text-blue-500",
  },
] as const;

export function GithubSection({ data }: { data: Contributions }) {
  const [year, setYear] = useState(Object.keys(data.total).toReversed()[0]);

  return (
    <section id="github" className="mx-auto my-32 w-full max-w-7xl px-6 md:px-12 space-y-16">

      <div className="flex flex-col items-center text-center space-y-4">
        <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
          {`// Open Source`}
        </span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
          <span className="font-instrument-serif italic font-normal text-muted-foreground/80 mr-3">
            Code
          </span>
          <span className="text-colorful-titanium">
            Contributions
          </span>
        </h2>
        <p className="max-w-xl text-muted-foreground text-lg">
          A live look at my commit history and open source impact.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">

        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-b border-border">
          {STATS_CONFIG.map((stat) => (
            <div
              key={stat.key}
              className="group flex flex-col items-center justify-center p-8 bg-background/50 hover:bg-background transition-colors duration-300"
            >
              <div className={cn("mb-3 transition-colors duration-300 text-muted-foreground", stat.hoverColor)}>
                <stat.icon className="size-5 md:size-6" />
              </div>
              <p className="text-2xl md:text-4xl font-bold tracking-tight text-foreground font-mono">
                <CountingNumber
                  from={0}
                  to={data.stats[stat.key as keyof typeof data.stats]}
                  duration={2.5}
                />
              </p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="p-6 md:p-10 bg-card">
          <ContributionGraph data={data.contributions[year]} className="mx-auto w-full">

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-medium text-foreground">Live Activity Map</span>
              </div>

              <Select defaultValue={year} onValueChange={(year) => setYear(year)}>
                <SelectTrigger className="w-[120px] bg-background border-border text-foreground font-mono text-xs h-9">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(data.total)
                    .toReversed()
                    .map((y) => (
                      <SelectItem key={y} value={y} className="font-mono text-xs">
                        {y}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <ContributionGraphCalendar>
              {({ activity, dayIndex, weekIndex }) => (
                <ContributionGraphBlock
                  activity={activity}
                  dayIndex={dayIndex}
                  weekIndex={weekIndex}
                  className={cn(
                    // CUSTOM COLOR MAP: Using semantic opacity steps instead of hex codes
                    // This ensures it looks perfect in both Light (Green) and Dark (Glowing Green) modes
                    "rounded-[20px] transition-all duration-300 hover:scale-125",
                    'data-[level="0"]:fill-muted/20 dark:data-[level="0"]:fill-muted/10',
                    'data-[level="1"]:fill-emerald-400/30 dark:data-[level="1"]:fill-emerald-900/40',
                    'data-[level="2"]:fill-emerald-400/60 dark:data-[level="2"]:fill-emerald-700/60',
                    'data-[level="3"]:fill-emerald-500 dark:data-[level="3"]:fill-emerald-600',
                    'data-[level="4"]:fill-emerald-600 dark:data-[level="4"]:fill-emerald-500',
                  )}
                />
              )}
            </ContributionGraphCalendar>

            {/* Footer / Summary */}
            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
              <ContributionGraphTotalCount>
                {({ totalCount, year }) => (
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-sm font-medium">
                      Total commits in {year}
                    </span>
                    <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5 h-6">
                      {totalCount.toLocaleString()}
                    </Badge>
                  </div>
                )}
              </ContributionGraphTotalCount>

              <ContributionGraphLegend>
                {({ level }) => (
                  <div
                    className="flex h-3 w-3 items-center justify-center rounded-[1px]"
                    data-level={level}
                  >
                    <div
                      className={cn(
                        "h-full w-full rounded-[1px]",
                        level === 0 && "bg-muted/20",
                        level === 1 && "bg-emerald-400/30 dark:bg-emerald-900/40",
                        level === 2 && "bg-emerald-400/60 dark:bg-emerald-700/60",
                        level === 3 && "bg-emerald-500 dark:bg-emerald-600",
                        level === 4 && "bg-emerald-600 dark:bg-emerald-500"
                      )}
                    />
                  </div>
                )}
              </ContributionGraphLegend>
            </div>

          </ContributionGraph>
        </div>
      </div>
    </section>
  );
}



function SpotlightCard({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        // Base styles using semantic tokens
        "group relative border border-border bg-card overflow-hidden rounded-xl",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      {/* The Glow Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              hsl(var(--primary) / 0.15), 
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

// --- MAIN SECTION ---
export function SkillSection() {
  return (
    <section
      id="skills"
      className="relative max-w-7xl mx-auto w-full px-6 md:px-12 py-32 overflow-hidden"
    >
      {/* Background Engineering Grid (Using muted foreground for lines) */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,hsl(var(--muted-foreground)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted-foreground)/0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* --- HEADER --- */}
      <div className="flex flex-col items-center text-center mb-16 space-y-4">
        <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
          {`// The Toolkit`}
        </span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
          <span className="font-instrument-serif italic font-normal text-muted-foreground/80 mr-3">
            My Technical
          </span>
          {/* Kept the titanium class as requested previously, or use text-foreground if preferred */}
          <span className="text-colorful-titanium">
            Arsenal
          </span>
        </h2>
        <p className="max-w-xl text-muted-foreground text-lg">
          A comprehensive suite of tools and technologies I use to architect scalable digital solutions.
        </p>
      </div>

      {/* --- THE MATRIX GRID --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative z-10">
        {appConfig.skill_icons.map((skill, index) => (
          <SpotlightCard key={skill} className="aspect-square">
            <div className="flex flex-col items-center justify-center h-full p-4 transition-all duration-300">

              {/* Icon Container */}
              <div className="relative size-14 md:size-16 flex items-center justify-center rounded-2xl bg-background shadow-sm border border-border mb-3 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500">
                <Image
                  src={`https://skillicons.dev/icons?i=${skill}`}
                  alt={`${skill} icon`}
                  width={64}
                  height={64}
                  className="size-10 md:size-12 object-contain grayscale opacity-70 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
                  unoptimized
                />
              </div>

              {/* Skill Name */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
                {skill}
              </p>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}