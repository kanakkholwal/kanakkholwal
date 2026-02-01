"use client";
import { GlowFillButton } from "@/components/animated/button.fill";
import { CountingNumber } from "@/components/animated/text.counter";
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
import { motion, Variants } from "framer-motion";
import { ArrowRight, BookOpen, GitFork, Star, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { appConfig, resume_link } from "root/project.config";
import { ContributionActivity, Contributions } from "~/api/github";

import { useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

import { OrbitingIdentity } from "@/components/application/hero.orbiting";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";



import { Icon } from "@/components/icons";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";



export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax effect for the background grid
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full min-h-[95vh] flex items-center justify-center overflow-hidden bg-background selection:bg-primary/20"
    >

      {/* 1. Subtle Grid Pattern */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0 h-[120%] w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />

      {/* 2. Top Spotlight/Glow */}
      <div className="absolute top-0 z-0 h-screen w-screen bg-transparent [background:radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.15),transparent_50%)]" />

      {/* --- Main Content Grid --- */}
      <div className="container relative z-10 px-6 md:px-12 mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left pt-12 md:pt-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15, delayChildren: 0.2 },
                },
              }}
              className="space-y-8"
            >

              <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start">
                <Badge
                  variant="outline"
                  className="group relative pl-2 pr-4 py-1.5 rounded-full border-border/40 bg-background/50 backdrop-blur-md shadow-[0_0_20px_-10px_rgba(0,0,0,0.1)] hover:border-primary/30 transition-colors"
                >
                  <span className="relative flex h-2 w-2 mr-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
                    AVAILABLE FOR WORK
                  </span>

                </Badge>
                  <span className="text-sm font-mono text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                    {`// Hi, I am ${appConfig.name}`}
                  </span>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-foreground">
                  Building digital
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground/60 pb-2">
                    products for
                  </span>
                  <br />
                  <span className="relative inline-block">
                    <span className="relative z-10 text-foreground">modern web.</span>
                    {/* Subtle underline highlight */}
                    <span className="absolute -bottom-1 left-0 w-full h-3 bg-primary/10 -rotate-1 rounded-full -z-10" />
                  </span>
                </h1>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium text-balance"
              >
                {appConfig.description}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <ButtonLink
                  href={resume_link}
                  target="_blank"
                  size="lg"
                  rounded="full"
                  variant="light"
                  className="h-12 px-8"
                >
                  Download Resume
                  <Icon name="arrow-right" />
                </ButtonLink>

                <GlowFillButton
                  icon={ArrowRight}
                  className="h-12 px-8 rounded-full font-medium text-foreground bg-secondary/50 hover:bg-secondary/80 border border-border/50 backdrop-blur-sm"
                >
                  <TransitionLink href="/projects">View Projects</TransitionLink>
                </GlowFillButton>
              </motion.div>

            </motion.div>
          </div>

          {/* RIGHT: Visual / Orbiting Identity */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative hidden md:flex items-center justify-center lg:justify-end"
          >
            {/* The Glass Container for the visual */}
            <div className="relative w-full aspect-square max-w-[600px] flex items-center justify-center">

              {/* Background Glow behind the visual */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent blur-[80px] rounded-full opacity-60" />

              <div className="relative z-10 w-full h-full">
                <OrbitingIdentity />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// Reusable Motion Variants for cleaner code
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for "luxurious" feel
    }
  },
};


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
  const weeklyData = React.useMemo(() => getWeeklyData(data.contributions[year]), [data, year]);

  // Calculate total for the subtitle
  const totalInPeriod = weeklyData.reduce((acc, curr) => acc + curr.count, 0);

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

        <Tabs defaultValue="graph" className="p-6 md:p-10 bg-card">
          <ContributionGraph data={data.contributions[year]} className="mx-auto w-full">

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-5 border-b border-border">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg font-medium inline-flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  Live Activity Map
                </CardTitle>
                <CardDescription>
                  <ContributionGraphTotalCount>
                    {({ totalCount, year }) => (
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-sm font-medium">
                          Total commits in {year}
                        </span>
                        <Badge variant="secondary" size="sm" className="font-mono">
                          {totalCount.toLocaleString()}
                        </Badge>
                      </div>
                    )}
                  </ContributionGraphTotalCount>
                </CardDescription>
              </CardHeader>
              <div className="flex items-center gap-2">
                <TabsList>
                  <TabsTrigger value="graph">Graph</TabsTrigger>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                </TabsList>
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
            </div>
            <TabsContent value="graph" className="w-full p-3">
              <ContributionGraphCalendar className="w-full">
                {({ activity, dayIndex, weekIndex }) => (
                  <ContributionGraphBlock
                    activity={activity}
                    dayIndex={dayIndex}
                    weekIndex={weekIndex}
                    className={cn(
                      // CUSTOM COLOR MAP: Using semantic opacity steps instead of hex codes
                      // This ensures it looks perfect in both Light (Green) and Dark (Glowing Green) modes
                      "rounded-[20px] transition-all duration-300 hover:scale-125",
                      'data-[level="0"]:fill-muted dark:data-[level="0"]:fill-muted',
                      'data-[level="1"]:fill-emerald-400/30 dark:data-[level="1"]:fill-emerald-900/40',
                      'data-[level="2"]:fill-emerald-400/60 dark:data-[level="2"]:fill-emerald-700/60',
                      'data-[level="3"]:fill-emerald-500 dark:data-[level="3"]:fill-emerald-600',
                      'data-[level="4"]:fill-emerald-600 dark:data-[level="4"]:fill-emerald-500',
                    )}
                  />
                )}
              </ContributionGraphCalendar>
              <ContributionGraphLegend className="mt-4">
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
            </TabsContent>
            <TabsContent value="chart">
              <WeeklyChart data={data.contributions[year]} />
            </TabsContent>

          </ContributionGraph>
        </Tabs>
      </div>
    </section >
  );
}


// --- Helper: Aggregates Daily -> Weekly ---
function getWeeklyData(daily: ContributionActivity[]) {
  const weeklyMap = new Map<string, { date: string; count: number; label: string }>();

  // Sort by date to ensure order
  const sorted = [...daily].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  sorted.forEach((day) => {
    const dateObj = new Date(day.date);
    // Calculate the Sunday of this week
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday
    const startOfWeek = new Date(dateObj);
    startOfWeek.setDate(dateObj.getDate() - dayOfWeek);

    const key = startOfWeek.toISOString().split("T")[0]; // YYYY-MM-DD

    // Create label (e.g., "Jan 22")
    const label = startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    if (weeklyMap.has(key)) {
      weeklyMap.get(key)!.count += day.count;
    } else {
      weeklyMap.set(key, { date: key, count: day.count, label });
    }
  });

  return Array.from(weeklyMap.values());
}


const chartConfig = {
  contributions: {
    label: "Contributions",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

type WeeklyData = {
  date: string;
  count: number;
  label: string;
}

export function WeeklyChart({ data }: { data: ContributionActivity[] }) {
  const weeklyData = React.useMemo(() => getWeeklyData(data), [data]);

  // Calculate total for the subtitle
  const totalInPeriod = weeklyData.reduce((acc, curr) => acc + curr.count, 0);

  return (

    <CardContent>
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <BarChart
          data={weeklyData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            className="stroke-muted/30"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={30} // Prevents labels from overlapping
            className="text-xs text-muted-foreground"
          />
          <ChartTooltip
            cursor={{ fill: "hsl(var(--muted)/0.2)" }}
            content={
              <ChartTooltipContent
                hideLabel
                className="w-40"
                formatter={(value, name, item) => (
                  <>
                    <div className="flex w-full justify-between items-center">
                      <span className="text-muted-foreground font-medium">Week of {item.payload.label}</span>
                      <span className="font-bold text-foreground">{value}</span>
                    </div>
                  </>
                )}
              />
            }
          />
          <Bar
            dataKey="count"
            fill="var(--color-contributions)"
            radius={[4, 4, 0, 0]} // Rounded top corners
            maxBarSize={50}
          />
        </BarChart>
      </ChartContainer>
    </CardContent>
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

export function SkillSection() {
  return (
    <section
      id="skills"
      className="relative max-w-7xl mx-auto w-full px-6 md:px-12 py-32 overflow-hidden"
    >
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