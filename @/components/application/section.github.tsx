"use client";

import { DynamicHeading } from "@/components/application/dynamic.heading";
import { CountingNumber } from "@/components/animated/text.counter";
import {
  ContributionGraph,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  BarChart2,
  Book,
  BookOpen,
  GitCommitHorizontal,
  GitFork,
  Grid,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { GoRepoPush } from "react-icons/go";
import {
  CodeReviewDistribution,
  ContributionActivity,
  Contributions,
  DetailedActivity,
} from "~/api/github";

import { StyleSwap } from "@/components/animated/style-swap";
import { Serif, StoryChapter, StoryReveal } from "@/components/application/story.frame";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { appConfig } from "root/project.config";
import GithubContributionGraph, {
  GithubContributionGraphCalender,
} from "../card.contribution";
import BlurFade from "../magicui/blur-fade";
import { DynamicSection, StaticSection } from "./base.ui";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

// Configuration for the stats ribbon
const STATS_CONFIG = [
  { label: "Followers", icon: Users, key: "followers" },
  { label: "Stars", icon: Star, key: "stars" },
  { label: "Repos", icon: BookOpen, key: "repos" },
  { label: "Forks", icon: GitFork, key: "forks" },
] as const;
const chartConfig = {
  contributions: {
    label: "Contributions",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export default function GithubSection({
  data,
}: {
  data: {
    stats: Contributions;
    activity: DetailedActivity;
  };
}) {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <StyleSwap swapKey={selectedStyle}>
      {selectedStyle === "minimal" ? (
        <MinimalGithub data={data.stats} />
      ) : selectedStyle === "static" ? (
        <StaticGithubSection data={data.stats} />
      ) : selectedStyle === "story" ? (
        <StoryGithub data={data.stats} />
      ) : (
        <DynamicGithubSection data={data} />
      )}
    </StyleSwap>
  );
}

/* ─────────────────────────────────────────────────────────────
   Minimal
───────────────────────────────────────────────────────────── */

function MinimalGithub({ data }: { data: Contributions }) {
  return (
    <Panel>
      <PanelHeader>
        <motion.div layoutId="github-label" className="contents">
          <PanelTitle>GitHub Contributions</PanelTitle>
        </motion.div>
      </PanelHeader>
      <PanelContent>
        <GithubContributionGraph
          data={
            data.contributions[Object.keys(data.contributions).toReversed()[0]]
          }
        />
      </PanelContent>
      <MinimalStats stats={data.stats} />
    </Panel>
  );
}

/* ─────────────────────────────────────────────────────────────
   Shared stat strip
───────────────────────────────────────────────────────────── */

function StoryGithub({ data }: { data: Contributions }) {
  return (
    <StoryChapter
      index={5}
      kicker="In the open"
      id="github"
      title={<>Building in <Serif className="text-muted-foreground/80">public</Serif>.</>}
    >
      <StoryReveal className="max-w-xl text-base leading-relaxed text-muted-foreground">
        <p>
          Most of what I learn ends up open source. These counters are pulled
          live from GitHub.
        </p>
      </StoryReveal>

      <StoryReveal
        delay={0.1}
        className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4"
      >
        {STATS_CONFIG.map((stat) => (
          <div key={stat.key}>
            <div className="font-mono text-3xl font-bold tracking-tight text-foreground tabular-nums">
              <CountingNumber
                from={0}
                to={data.stats[stat.key as keyof typeof data.stats]}
                duration={2}
                startOnView
                once
              />
            </div>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </StoryReveal>

      <StoryReveal delay={0.16} className="mt-8">
        <Link
          href={appConfig.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-foreground"
        >
          See the full profile
          <ArrowUpRight className="size-4 transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </StoryReveal>
    </StoryChapter>
  );
}

/* Each variant owns its own stat treatment. These were one component branching
   on a `variant` prop, which is where the two designs quietly drifted apart —
   different paddings, radii, count durations and hover surfaces, all decided by
   ternaries rather than by design. */

/** Static — a bordered card grid. Icon over number, centred, quiet. */
function StaticStats({ stats }: { stats: Contributions["stats"] }) {
  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-border border-b border-border md:grid-cols-4 md:divide-y-0">
      {STATS_CONFIG.map((stat) => (
        <div
          key={stat.key}
          className="flex flex-col items-center justify-center gap-2 bg-background/50 p-6 transition-colors duration-150 ease-out md:p-8 hoverable:bg-background"
        >
          <span className="rounded-lg bg-muted p-3 text-muted-foreground">
            <stat.icon className="size-5 md:size-6" />
          </span>
          <p className="font-mono text-2xl font-bold tabular-nums tracking-tight text-foreground md:text-4xl">
            <CountingNumber
              from={0}
              to={stats[stat.key as keyof typeof stats]}
              duration={1.4}
              startOnView
              once
            />
          </p>
          <p className="text-2xs font-medium uppercase tracking-wider text-muted-foreground">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Dynamic — a dense ledger row. Label and number left, icon right. */
function DynamicStats({ stats }: { stats: Contributions["stats"] }) {
  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-border bg-card md:grid-cols-4 md:divide-y-0">
      {STATS_CONFIG.map((stat) => (
        <div
          key={stat.key}
          className="group flex items-center justify-between gap-3 p-5 transition-colors duration-150 ease-out md:p-6 hoverable:bg-background/60"
        >
          <div className="min-w-0 space-y-1">
            <span className="block text-2xs font-medium uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </span>
            <div className="font-mono text-2xl font-bold tabular-nums tracking-tight text-foreground md:text-3xl">
              <CountingNumber
                from={0}
                to={stats[stat.key as keyof typeof stats]}
                duration={1.4}
                startOnView
                once
              />
            </div>
          </div>
          <span className="rounded-2xl bg-primary/10 p-3 text-primary transition-transform duration-200 ease-out group-hover:scale-105">
            <stat.icon className="size-5" />
          </span>
        </div>
      ))}
    </div>
  );
}

/** Minimal — no chrome at all. A hairline-ruled inline row, mono, no icons. */
function MinimalStats({ stats }: { stats: Contributions["stats"] }) {
  return (
    <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-edge px-4 py-4">
      {STATS_CONFIG.map((stat) => (
        <div key={stat.key} className="flex items-baseline gap-2">
          <dt className="font-mono text-2xs uppercase tracking-widest text-muted-foreground">
            {stat.label}
          </dt>
          <dd className="font-mono text-sm font-medium tabular-nums text-foreground">
            {stats[stat.key as keyof typeof stats]}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ─────────────────────────────────────────────────────────────
   Static
───────────────────────────────────────────────────────────── */

export function StaticGithubSection({ data }: { data: Contributions }) {
  const [year, setYear] = useState(Object.keys(data.total).toReversed()[0]);

  return (
    <StaticSection
      id="github"
    >
      <BlurFade delay={0.04}>
        <div className="space-y-2 mb-5">
          <motion.span
            layoutId="github-label"
            className="inline-block text-xs font-mono font-medium tracking-widest uppercase text-muted-foreground"
          >
            Open source
          </motion.span>
          <motion.h2
            layoutId="github-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Code Contributions
          </motion.h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl">
            A live look at my commit history and open source impact.
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <StaticStats stats={data.stats} />

          <ContributionGraph data={data.contributions[year]} className="w-full">
            <Tabs defaultValue="graph">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-5 border-b border-border">
                <ContributionGraphTotalCount>
                  {({ totalCount, year: y }) => (
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75 motion-reduce:animate-none" />
                          <span className="relative inline-flex size-2 rounded-full bg-success" />
                        </span>
                        Live Activity Map
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        {totalCount.toLocaleString()} commits in {y}
                      </p>
                    </div>
                  )}
                </ContributionGraphTotalCount>

                <div className="flex items-center gap-2 shrink-0">
                  <TabsList className="h-8">
                    <TabsTrigger value="graph" className="text-xs h-7">Graph</TabsTrigger>
                    <TabsTrigger value="chart" className="text-xs h-7">Chart</TabsTrigger>
                  </TabsList>
                  <Select defaultValue={year} onValueChange={setYear}>
                    <SelectTrigger className="w-[100px] h-8 bg-background border-border font-mono text-xs">
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

              <TabsContent value="graph" className="p-4">
                <GithubContributionGraphCalender />
                <ContributionGraphLegend className="mt-4" />
              </TabsContent>
              <TabsContent value="chart" className="p-4">
                <WeeklyChart data={data.contributions[year]} />
              </TabsContent>
            </Tabs>
          </ContributionGraph>
        </div>
      </BlurFade>
    </StaticSection>
  );
}

/* ─────────────────────────────────────────────────────────────
   Dynamic
───────────────────────────────────────────────────────────── */

export function DynamicGithubSection({
  data,
}: {
  data: {
    stats: Contributions;
    activity: DetailedActivity;
  };
}) {
  const [year, setYear] = useState(
    Object.keys(data.stats.total).toReversed()[0],
  );
  const [view, setView] = useState("graph");

  return (
    <DynamicSection
      id="github"
    >
      <BlurFade delay={0.1}>
        <DynamicHeading
          id="github"
          label="Open source"
          icon={GitCommitHorizontal}
          serif="Code"
          lead="A live visualization of my commit history and open source impact on GitHub."
          aside={
            <Select defaultValue={year} onValueChange={setYear}>
              <SelectTrigger className="h-10 w-[140px] rounded-full border-input bg-card/80 backdrop-blur font-mono text-xs focus:ring-0 shrink-0">
                <span className="text-muted-foreground mr-2">Year:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(data.stats.total)
                  .toReversed()
                  .map((y) => (
                    <SelectItem key={y} value={y} className="font-mono text-xs">
                      {y}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          }
        >
          Contributions
        </DynamicHeading>
      </BlurFade>

      <BlurFade delay={0.2} className="mt-4 w-full rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl overflow-hidden">
        <DynamicStats stats={data.stats.stats} />

        <div className="p-6 md:p-10 relative w-full bg-card/50">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_10%,transparent)_1px,transparent_1px)] [background-size:16px_16px]" />

          <ContributionGraph
            data={data.stats.contributions[year]}
            className="w-full"
          >
            <Tabs value={view} onValueChange={setView} className="space-y-8 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <ContributionGraphTotalCount>
                  {({ totalCount }) => (
                    <div className="flex items-baseline gap-3">
                      <Badge
                        variant="secondary"
                        size="xl"
                        className="font-mono text-2xl font-bold text-foreground tracking-tight"
                      >
                        <CountingNumber
                          from={0}
                          to={totalCount}
                          duration={2}
                          format={(value) => value.toFixed(0).toLocaleString()}
                        />
                      </Badge>
                      <span className="text-muted-foreground font-medium">
                        commits in {year}
                      </span>
                    </div>
                  )}
                </ContributionGraphTotalCount>

                <TabsList className="h-10 bg-muted/50 p-1 rounded-full border border-border/50">
                  <TabsTrigger
                    value="graph"
                    className="rounded-full px-4 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Grid className="mr-2 size-3.5" />
                    Heatmap
                  </TabsTrigger>
                  <TabsTrigger
                    value="chart"
                    className="rounded-full px-4 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <BarChart2 className="mr-2 size-3.5" />
                    Activity
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="graph"
                className="w-full mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="overflow-x-auto pb-4 no-scrollbar w-full">
                  <GithubContributionGraphCalender className="min-w-full max-h-96 no-scrollbar px-2" />
                </div>
                <div className="flex justify-end mt-4">
                  <ContributionGraphLegend />
                </div>
              </TabsContent>

              <TabsContent
                value="chart"
                className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <WeeklyChart data={data.stats.contributions[year]} />
              </TabsContent>
            </Tabs>
          </ContributionGraph>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/10 bg-card">
          <div className="p-6 md:p-8 space-y-8">
            <div className="flex flex-wrap gap-2">
              {data.activity.contributedOrganizations.map((org) => (
                <Link
                  key={org.name}
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/50 hover:bg-muted/25 transition-all group"
                >
                  <Image
                    src={org.avatarUrl}
                    alt={org.name}
                    width={20}
                    height={20}
                    className="rounded-md grayscale group-hover:grayscale-0 transition-all"
                  />
                  <span className="text-sm font-semibold text-foreground">
                    {org.name}
                  </span>
                </Link>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">
                Activity overview
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2 text-foreground">
                  <Book className="size-4 mt-0.5 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Contributed to
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {data.activity.activityOverview.repositoriesContributedTo
                        .slice(0, 4)
                        .map((repo, i) => (
                          <Link
                            key={i}
                            href={repo.url}
                            className={cn(
                              "inline-flex items-center gap-1 text-sm font-semibold hover:underline decoration-primary underline-offset-2",
                              data.activity.contributedOrganizations.length > 4
                                ? "text-muted-foreground font-normal no-underline hover:text-primary"
                                : "text-primary",
                            )}
                          >
                            <GoRepoPush className="size-4 mt-0.5 text-muted-foreground inline-block" />
                            {repo.owner}/{repo.name}
                          </Link>
                        ))}
                      {data.activity.activityOverview.repositoriesContributedTo
                        .length > 4 && (
                          <a
                            href={"https://github.com/" + appConfig.usernames.github}
                            className="text-sm font-normal text-muted-foreground hover:text-primary"
                          >
                            and{" "}
                            {data.activity.activityOverview
                              .repositoriesContributedTo.length - 4}{" "}
                            other repositories
                          </a>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 flex items-center justify-center">
            <div className="w-full max-w-[300px] aspect-square">
              <ActivityDistributionChart data={data.activity.codeReviewDistribution} />
            </div>
          </div>
        </div>
      </BlurFade>
    </DynamicSection>
  );
}

// CROSSHAIR CHART
function ActivityDistributionChart({ data }: { data: CodeReviewDistribution }) {
  // SVG Configuration
  const size = 300;
  const center = size / 2;
  const radius = 120; // Length of axes from center

  // Helper to calculate point coordinates
  const getPoint = (val: number, axis: "top" | "right" | "bottom" | "left") => {
    const normalized = Math.min(val, 100) / 100;
    const len = normalized * radius;
    switch (axis) {
      case "top":
        return { x: center, y: center - len };
      case "right":
        return { x: center + len, y: center };
      case "bottom":
        return { x: center, y: center + len };
      case "left":
        return { x: center - len, y: center };
    }
  };

  const pCommits = getPoint(data.commits, "left");
  const pReview = getPoint(data.codeReviews, "top");
  const pIssues = getPoint(data.issues, "right");
  const pPRs = getPoint(data.pullRequests, "bottom");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="size-full"
      role="img"
      aria-label={`Contribution mix: ${data.commits}% commits, ${data.codeReviews}% code reviews, ${data.issues}% issues, ${data.pullRequests}% pull requests`}
    >
      {/* 1. AXIS LINES (Crosshair) */}
      <line
        x1={center}
        y1={center - radius}
        x2={center}
        y2={center + radius}
        stroke="var(--border)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1={center - radius}
        y1={center}
        x2={center + radius}
        y2={center}
        stroke="var(--border)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* 2. STATIC LABELS (Fixed at ends of axes) */}
      <text
        x={center}
        y={center - radius - 15}
        textAnchor="middle"
        fill="var(--muted-foreground)"
        fontSize="12"
        fontWeight="500"
      >
        Code review
      </text>
      <text
        x={center + radius + 10}
        y={center + 4}
        textAnchor="start"
        fill="var(--muted-foreground)"
        fontSize="12"
        fontWeight="500"
      >
        Issues
      </text>
      <text
        x={center}
        y={center + radius + 20}
        textAnchor="middle"
        fill="var(--muted-foreground)"
        fontSize="12"
        fontWeight="500"
      >
        Pull requests
      </text>
      <text
        x={center - radius - 10}
        y={center + 4}
        textAnchor="end"
        fill="var(--muted-foreground)"
        fontSize="12"
        fontWeight="500"
      >
        Commits
      </text>

      {/* 3. DATA LINES (The Green Glow) */}
      <path
        d={`M${center},${center} L${pCommits.x},${pCommits.y}`}
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
        
      />
      <path
        d={`M${center},${center} L${pReview.x},${pReview.y}`}
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d={`M${center},${center} L${pIssues.x},${pIssues.y}`}
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
        
      />
      <path
        d={`M${center},${center} L${pPRs.x},${pPRs.y}`}
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* 4. DATA DOTS & DYNAMIC LABELS */}
      {/* Center Anchor */}
      <circle cx={center} cy={center} r="3" fill="var(--primary)" />

      {/* Commits (Left Axis) - Label Above Dot */}
      {data.commits > 0 && (
        <g>
          <circle
            cx={pCommits.x}
            cy={pCommits.y}
            r="4"
            fill="var(--primary)"
            stroke="var(--card)"
            strokeWidth="2"
          />
          <text
            x={pCommits.x}
            y={pCommits.y - 12}
            fill="var(--muted-foreground)"
            fontSize="11"
            textAnchor="middle"
          >
            {data.commits}%
          </text>
        </g>
      )}

      {/* Issues (Right Axis) - Label Above Dot */}
      {data.issues > 0 && (
        <g>
          <circle
            cx={pIssues.x}
            cy={pIssues.y}
            r="4"
            fill="var(--primary)"
            stroke="var(--card)"
            strokeWidth="2"
          />
          <text
            x={pIssues.x}
            y={pIssues.y - 12}
            fill="var(--muted-foreground)"
            fontSize="11"
            textAnchor="middle"
          >
            {data.issues}%
          </text>
        </g>
      )}

      {/* Pull Requests (Bottom Axis) - Label to the Right of Dot */}
      {data.pullRequests > 0 && (
        <g>
          <circle
            cx={pPRs.x}
            cy={pPRs.y}
            r="4"
            fill="var(--primary)"
            stroke="var(--card)"
            strokeWidth="2"
          />
          <text
            x={pPRs.x + 10}
            y={pPRs.y + 4}
            fill="var(--muted-foreground)"
            fontSize="11"
            textAnchor="start"
          >
            {data.pullRequests}%
          </text>
        </g>
      )}

      {/* Code Review (Top Axis) - Label to the Right of Dot */}
      {data.codeReviews > 0 && (
        <g>
          <circle
            cx={pReview.x}
            cy={pReview.y}
            r="4"
            fill="var(--primary)"
            stroke="var(--card)"
            strokeWidth="2"
          />
          <text
            x={pReview.x + 10}
            y={pReview.y + 4}
            fill="var(--muted-foreground)"
            fontSize="11"
            textAnchor="start"
          >
            {data.codeReviews}%
          </text>
        </g>
      )}
    </svg>
  );
}

function WeeklyChart({ data }: { data: ContributionActivity[] }) {
  const weeklyData = useMemo(() => getWeeklyData(data), [data]);

  return (
    <div className="w-full mt-4">
      <ChartContainer
        config={chartConfig}
        className="aspect-video w-full max-h-96"
      >
        <BarChart
          data={weeklyData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-primary)"
                stopOpacity={0.8}
              />
              <stop
                offset="100%"
                stopColor="var(--color-primary)"
                stopOpacity={0.3}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="color-mix(in oklab, var(--primary) 30%, transparent)"
          />
          <ChartTooltip
            cursor={{
              fill: "color-mix(in oklab, var(--primary) 10%, transparent)",
              radius: 4,
            }}
            content={
              <ChartTooltipContent
                hideLabel
                className="border-border/50 bg-background/80 backdrop-blur-lg shadow-xl"
                formatter={(value, name, item) => (
                  <div className="flex flex-col gap-1 min-w-[120px]">
                    <span className="text-2xs uppercase text-muted-foreground font-mono">
                      Week of {item.payload.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="font-bold text-foreground text-lg">
                        {value} Commits
                      </span>
                    </div>
                  </div>
                )}
              />
            }
          />
          <Bar
            dataKey="count"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            minTickGap={40}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            dy={10}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
//  AGGREGATE DAILY -> WEEKLY
function getWeeklyData(daily: ContributionActivity[]) {
  const weeklyMap = new Map<
    string,
    { date: string; count: number; label: string }
  >();

  // Sort guarantees timeline order
  const sorted = [...daily].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  sorted.forEach((day) => {
    const dateObj = new Date(day.date);
    const dayOfWeek = dateObj.getDay();
    const startOfWeek = new Date(dateObj);
    startOfWeek.setDate(dateObj.getDate() - dayOfWeek);
    const key = startOfWeek.toISOString().split("T")[0];
    const label = startOfWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (weeklyMap.has(key)) {
      weeklyMap.get(key)!.count += day.count;
    } else {
      weeklyMap.set(key, { date: key, count: day.count, label });
    }
  });

  return Array.from(weeklyMap.values());
}
