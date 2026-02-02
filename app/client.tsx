  "use client";

  import { CountingNumber } from "@/components/animated/text.counter";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphLegend,
  ContributionGraphTotalCount
} from "@/components/kibo-ui/contribution-graph";
import BlurFade from "@/components/magicui/blur-fade";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  BookOpen,
  GitCommitHorizontal,
  GitFork,
  Grid,
  Star,
  Users
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis
} from "recharts";
import { ContributionActivity, Contributions } from "~/api/github";

  // Configuration for the stats ribbon
  const STATS_CONFIG = [
    { label: "Followers", icon: Users, key: "followers", color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Stars", icon: Star, key: "stars", color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Repos", icon: BookOpen, key: "repos", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Forks", icon: GitFork, key: "forks", color: "text-blue-500", bg: "bg-blue-500/10" },
  ] as const;

  export function GithubSection({ data }: { data: Contributions }) {
    const [year, setYear] = useState(Object.keys(data.total).toReversed()[0]);
    const [view, setView] = useState("graph");

    return (
      <section id="github" className="w-full py-24 px-4 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* 1. SECTION HEADER */}
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
                  A live visualization of my commit history and open source impact on GitHub.
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
                    {Object.keys(data.total).toReversed().map((y) => (
                      <SelectItem key={y} value={y} className="font-mono text-xs">
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.2} className="w-full">
            <div className="rounded-[32px] border border-border/60 bg-card/30 backdrop-blur-xl shadow-2xl overflow-hidden">

              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-b border-border bg-background/40">
                {STATS_CONFIG.map((stat, i) => (
                  <div key={stat.key} className="group p-6 flex items-center justify-between hover:bg-background/60 transition-colors">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                      <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-foreground">
                        <CountingNumber
                          from={0}
                          to={data.stats[stat.key as keyof typeof data.stats]}
                          duration={2 + (i * 0.2)}
                        />
                      </div>
                    </div>
                    <div className={cn("p-3 rounded-2xl transition-all duration-300 group-hover:scale-110", stat.bg)}>
                      <stat.icon className={cn("size-5", stat.color)} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 md:p-10 relative w-full">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#ffffff08_1px,transparent_1px)] opacity-50" />

                <ContributionGraph data={data.contributions[year]} className="w-full">
                  <Tabs value={view} onValueChange={setView} className="space-y-8 w-full">

                    {/* Header: Total Count & Toggle */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <ContributionGraphTotalCount>
                        {({ totalCount }) => (
                          <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-foreground tracking-tight">
                              {totalCount.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground font-medium">
                              commits in {year}
                            </span>
                          </div>
                        )}
                      </ContributionGraphTotalCount>

                      <TabsList className="h-10 bg-muted/50 p-1 rounded-full border border-border/50">
                        <TabsTrigger value="graph" className="rounded-full px-4 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
                          <Grid className="mr-2 size-3.5" />
                          Heatmap
                        </TabsTrigger>
                        <TabsTrigger value="chart" className="rounded-full px-4 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
                          <BarChart2 className="mr-2 size-3.5" />
                          Activity
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    {/* Content: Heatmap */}
                    <TabsContent value="graph" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                      {/* No need for <ContributionGraph> here anymore, we are already inside one */}
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
                                'data-[level="4"]:fill-emerald-400'
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
                    <TabsContent value="chart" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <WeeklyChart data={data.contributions[year]} />
                    </TabsContent>

                  </Tabs>
                </ContributionGraph>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
    );
  }

  // Kept separate for cleanliness
  const chartConfig = {
    contributions: {
      label: "Contributions",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  function WeeklyChart({ data }: { data: ContributionActivity[] }) {
    const weeklyData = useMemo(() => getWeeklyData(data), [data]);

    return (
      <div className="w-full mt-4">
        <ChartContainer config={chartConfig} className="aspect-video w-full max-h-96">
          <BarChart data={weeklyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--primary)/0.3)" />
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
                        <span className="font-bold text-foreground text-lg">{value} Commits</span>
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
    const weeklyMap = new Map<string, { date: string; count: number; label: string }>();

    // Sort guarantees timeline order
    const sorted = [...daily].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach((day) => {
      const dateObj = new Date(day.date);
      const dayOfWeek = dateObj.getDay();
      const startOfWeek = new Date(dateObj);
      startOfWeek.setDate(dateObj.getDate() - dayOfWeek);
      const key = startOfWeek.toISOString().split("T")[0];
      const label = startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      if (weeklyMap.has(key)) {
        weeklyMap.get(key)!.count += day.count;
      } else {
        weeklyMap.set(key, { date: key, count: day.count, label });
      }
    });

    return Array.from(weeklyMap.values());
  }