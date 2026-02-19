"use client";
import { CountingNumber } from "@/components/animated/text.counter";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
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

import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { appConfig } from "root/project.config";
import BlurFade from "../magicui/blur-fade";

// Configuration for the stats ribbon
const STATS_CONFIG = [
  {
    label: "Followers",
    icon: Users,
    key: "followers",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    label: "Stars",
    icon: Star,
    key: "stars",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Repos",
    icon: BookOpen,
    key: "repos",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Forks",
    icon: GitFork,
    key: "forks",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
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
    <section
      id="github"
      className="max-w-(--max-app-width) mx-auto w-full py-24 px-4 md:px-12 space-y-8"
    >
      {selectedStyle === "static" ? (
        <StaticGithubSection data={data.stats} />
      ) : (
        <DynamicGithubSection data={data} />
      )}
    </section>
  );
}

export function StaticGithubSection({ data }: { data: Contributions }) {
  const [year, setYear] = useState(Object.keys(data.total).toReversed()[0]);

  return (
    <section
      id="github"
      className="mx-auto my-32 w-full max-w-7xl px-6 md:px-12 space-y-16"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
          {`// Open Source`}
        </span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
          <span className="font-instrument-serif italic font-normal text-muted-foreground/80 mr-3">
            Code
          </span>
          <span className="text-colorful-titanium">Contributions</span>
        </h2>
        <p className="max-w-xl text-muted-foreground text-lg">
          A live look at my commit history and open source impact.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-b border-border">
          {STATS_CONFIG.map((stat) => (
            <div
              key={stat.key}
              className="group flex flex-col items-center justify-center p-8 bg-background/50 hover:bg-background transition-colors duration-300"
            >
              <div
                className={cn(
                  "mb-3 transition-colors duration-300 text-muted-foreground",
                  stat.color,
                  stat.bg,
                  "p-3 rounded-lg group-hover:bg-opacity-20",
                )}
              >
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
          <ContributionGraph
            data={data.contributions[year]}
            className="mx-auto w-full"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-5 border-b border-border">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg font-medium inline-flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  Live Activity Map
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  <ContributionGraphTotalCount>
                    {({ totalCount, year }) => (
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-sm font-medium">
                          Total commits in {year}
                        </span>
                        <Badge
                          variant="secondary"
                          size="sm"
                          className="font-mono"
                        >
                          {totalCount.toLocaleString()}
                        </Badge>
                      </div>
                    )}
                  </ContributionGraphTotalCount>
                </div>
              </CardHeader>
              <div className="flex items-center gap-2">
                <TabsList>
                  <TabsTrigger value="graph">Graph</TabsTrigger>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                </TabsList>
                <Select
                  defaultValue={year}
                  onValueChange={(year) => setYear(year)}
                >
                  <SelectTrigger className="w-[120px] bg-background border-border text-foreground font-mono text-xs h-9">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(data.total)
                      .toReversed()
                      .map((y) => (
                        <SelectItem
                          key={y}
                          value={y}
                          className="font-mono text-xs"
                        >
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
              <ContributionGraphLegend className="mt-4" />
            </TabsContent>
            <TabsContent value="chart">
              <WeeklyChart data={data.contributions[year]} />
            </TabsContent>
          </ContributionGraph>
        </Tabs>
      </div>
    </section>
  );
}

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
    <>
      <BlurFade delay={0.1}>
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground uppercase tracking-widest">
              <GitCommitHorizontal className="size-4" />
              <span>Open Source</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Code Contributions
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg">
              A live visualization of my commit history and open source impact
              on GitHub.
            </p>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-2">
            <Select defaultValue={year} onValueChange={(y) => setYear(y)}>
              <SelectTrigger className="h-10 w-[140px] rounded-full border-border/60 bg-input/50 backdrop-blur font-mono text-xs focus:ring-0">
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
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.2} className="w-full max-w-(--max-app-width) mx-auto">
        <div className="rounded-4xl border border-border/60 backdrop-blur-xl overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-b border-border bg-card ">
            {STATS_CONFIG.map((stat, i) => (
              <div
                key={stat.key}
                className="group p-6 flex items-center justify-between hover:bg-background/60 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-foreground">
                    <CountingNumber
                      from={0}
                      to={
                        data.stats.stats[
                          stat.key as keyof typeof data.stats.stats
                        ]
                      }
                      duration={2 + i * 0.2}
                    />
                  </div>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-2xl transition-all duration-300 group-hover:scale-110",
                    stat.bg,
                  )}
                >
                  <stat.icon className={cn("size-5", stat.color)} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 md:p-10 relative w-full bg-card/50">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#ffffff08_1px,transparent_1px)] opacity-50" />

            <ContributionGraph
              data={data.stats.contributions[year]}
              className="w-full"
            >
              <Tabs
                value={view}
                onValueChange={setView}
                className="space-y-8 w-full"
              >
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
                            format={(value) =>
                              value.toFixed(0).toLocaleString()
                            }
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

                {/* Content: Heatmap */}
                <TabsContent
                  value="graph"
                  className="w-full mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  <div className="overflow-x-auto pb-4 scrollbar-hide w-full">
                    <ContributionGraphCalendar className="min-w-full max-h-96">
                      {({ activity, dayIndex, weekIndex }) => (
                        <ContributionGraphBlock
                          activity={activity}
                          dayIndex={dayIndex}
                          weekIndex={weekIndex}
                          className={cn(
                            "rounded-sm transition-all duration-300 border-[0.5px] border-background/20",
                            "hover:animate-pulse",
                            // Modern Github Color Scale (Dark Mode Optimized)
                            'data-[level="0"]:fill-muted/20 dark:data-[level="0"]:fill-zinc-800',
                            'data-[level="1"]:fill-emerald-900/40',
                            'data-[level="2"]:fill-emerald-700/60',
                            'data-[level="3"]:fill-emerald-500',
                            'data-[level="4"]:fill-emerald-400',
                          )}
                        />
                      )}
                    </ContributionGraphCalendar>
                  </div>
                  <div className="flex justify-end mt-4">
                    <ContributionGraphLegend />
                  </div>
                </TabsContent>

                {/* Content: Bar Chart */}
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
              {/* Organization Badges */}
              <div className="flex flex-wrap gap-2">
                {data.activity.contributedOrganizations.map((org) => (
                  <Link
                    key={org.name}
                    href={org.url}
                    target="_blank"
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

              {/* Activity Overview List */}
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
                                data.activity.contributedOrganizations.length >
                                  4
                                  ? "text-muted-foreground font-normal no-underline hover:text-primary"
                                  : "text-primary",
                              )}
                            >
                              <GoRepoPush className="size-4 mt-0.5 text-muted-foreground inline-block" />
                              {repo.owner}/{repo.name}
                            </Link>
                          ))}
                        {data.activity.activityOverview
                          .repositoriesContributedTo.length > 4 && (
                          <a
                            href={
                              "https://github.com/" + appConfig.usernames.github
                            }
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

            {/* RIGHT COLUMN: Distribution Chart */}
            <div className="p-6 md:p-8 flex items-center justify-center relative">
              <div className="w-full max-w-[300px] aspect-square relative">
                <ActivityDistributionChart
                  data={data.activity.codeReviewDistribution}
                />
              </div>
            </div>
          </div>
        </div>
      </BlurFade>
    </>
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
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      {/* 1. AXIS LINES (Crosshair) */}
      <line
        x1={center}
        y1={center - radius}
        x2={center}
        y2={center + radius}
        stroke="#30363d"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1={center - radius}
        y1={center}
        x2={center + radius}
        y2={center}
        stroke="#30363d"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* 2. STATIC LABELS (Fixed at ends of axes) */}
      <text
        x={center}
        y={center - radius - 15}
        textAnchor="middle"
        fill="#7d8590"
        fontSize="12"
        fontWeight="500"
      >
        Code review
      </text>
      <text
        x={center + radius + 10}
        y={center + 4}
        textAnchor="start"
        fill="#7d8590"
        fontSize="12"
        fontWeight="500"
      >
        Issues
      </text>
      <text
        x={center}
        y={center + radius + 20}
        textAnchor="middle"
        fill="#7d8590"
        fontSize="12"
        fontWeight="500"
      >
        Pull requests
      </text>
      <text
        x={center - radius - 10}
        y={center + 4}
        textAnchor="end"
        fill="#7d8590"
        fontSize="12"
        fontWeight="500"
      >
        Commits
      </text>

      {/* 3. DATA LINES (The Green Glow) */}
      <path
        d={`M${center},${center} L${pCommits.x},${pCommits.y}`}
        stroke="#3fb950"
        strokeWidth="3"
        strokeLinecap="round"
        className="drop-shadow-[0_0_8px_rgba(63,185,80,0.5)]"
      />
      <path
        d={`M${center},${center} L${pReview.x},${pReview.y}`}
        stroke="#3fb950"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d={`M${center},${center} L${pIssues.x},${pIssues.y}`}
        stroke="#3fb950"
        strokeWidth="3"
        strokeLinecap="round"
        className="drop-shadow-[0_0_8px_rgba(63,185,80,0.5)]"
      />
      <path
        d={`M${center},${center} L${pPRs.x},${pPRs.y}`}
        stroke="#3fb950"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* 4. DATA DOTS & DYNAMIC LABELS */}
      {/* Center Anchor */}
      <circle cx={center} cy={center} r="3" fill="#3fb950" />

      {/* Commits (Left Axis) - Label Above Dot */}
      {data.commits > 0 && (
        <g>
          <circle
            cx={pCommits.x}
            cy={pCommits.y}
            r="4"
            fill="#3fb950"
            stroke="#0d1117"
            strokeWidth="2"
          />
          <text
            x={pCommits.x}
            y={pCommits.y - 12}
            fill="#7d8590"
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
            fill="#3fb950"
            stroke="#0d1117"
            strokeWidth="2"
          />
          <text
            x={pIssues.x}
            y={pIssues.y - 12}
            fill="#7d8590"
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
            fill="#3fb950"
            stroke="#0d1117"
            strokeWidth="2"
          />
          <text
            x={pPRs.x + 10}
            y={pPRs.y + 4}
            fill="#7d8590"
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
            fill="#3fb950"
            stroke="#0d1117"
            strokeWidth="2"
          />
          <text
            x={pReview.x + 10}
            y={pReview.y + 4}
            fill="#7d8590"
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
            stroke="hsl(var(--primary)/0.3)"
          />
          <ChartTooltip
            cursor={{ fill: "hsl(var(--primary)/0.1)", radius: 4 }}
            content={
              <ChartTooltipContent
                hideLabel
                className="border-border/50 bg-background/80 backdrop-blur-lg shadow-xl"
                formatter={(value, name, item) => (
                  <div className="flex flex-col gap-1 min-w-[120px]">
                    <span className="text-[10px] uppercase text-muted-foreground font-mono">
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
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
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
