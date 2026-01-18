"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { statsConfig } from "../config";
import { formatDate } from "../lib/format";
import { GitHubStarHistory } from "../lib/github";
import { Widget } from "./widget";

// --- ICONS (Phosphor Duotone) ---
import {
  PiChartBarDuotone,
  PiGitBranchDuotone,
  PiListDuotone,
  PiStarDuotone
} from "react-icons/pi";

type StarsGraphProps = {
  data: Record<string, GitHubStarHistory>;
  stargazersTab: React.ReactNode;
};

const starTabs = ["earned", "gazers"] as const;
type StarTab = (typeof starTabs)[number];

export function StarsGraph({ data, stargazersTab }: StarsGraphProps) {
  const [activeTab, setActiveTab] = useQueryState(
    "stars",
    parseAsStringLiteral(starTabs).withDefault("earned"),
  );
  const [activeRepo, setActiveRepo] = useQueryState(
    "repo",
    parseAsStringLiteral(
      statsConfig.repositories.map((repo) => repo.repo),
    ).withDefault(statsConfig.repositories[0].repo),
  );

  return (
    <Widget
      className="p-0 overflow-hidden" // Reset default padding for edge-to-edge feel
      title={
        <div className="flex flex-col sm:flex-row w-full sm:items-center justify-between gap-4">

          {/* LEFT: Repo Selector & Identity */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <PiStarDuotone className="text-lg" />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest leading-none mb-1">
                Repository
              </span>
              <Select defaultValue={activeRepo} onValueChange={setActiveRepo}>
                <SelectTrigger className="h-auto p-0 px-2 border-none bg-transparent shadow-none text-lg font-instrument-serif font-medium hover:bg-card focus:ring-0 gap-2 data-[placeholder]:text-foreground">
                  <SelectValue placeholder="Select a repository" />
                </SelectTrigger>
                <SelectContent>
                  {statsConfig.repositories.map((repo) => (
                    <SelectItem key={repo.name} value={repo.repo} className="font-mono text-xs">
                      <span className="flex items-center gap-2">
                        <PiGitBranchDuotone className="text-muted-foreground" />
                        {repo.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <div className="inline-flex flex-col items-end gap-1 mr-2">
              <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest leading-none mb-1">
                Total_Stars
              </span>
              <span className="font-mono font-bold text-lg leading-none">
                {data[activeRepo].count.toLocaleString()}
              </span>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as StarTab)}
              className="h-8"
            >
              <TabsList className="h-9 p-1 gap-1">
                <TabsTrigger
                  value="earned"
                  className="h-7 px-3 text-[10px] font-mono uppercase tracking-wider data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-amber-600"
                >
                  <PiChartBarDuotone className="mr-1.5 text-sm" /> Graph
                </TabsTrigger>
                <TabsTrigger
                  value="gazers"
                  className="h-7 px-3 text-[10px] font-mono uppercase tracking-wider data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-amber-600"
                >
                  <PiListDuotone className="mr-1.5 text-sm" /> List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      }
    >
      <div className="border-t border-border/40 bg-background/30 backdrop-blur-sm min-h-[350px]">
        {activeTab === "earned" && (
          <ChartContainer className="h-[350px] w-full pt-6 pr-4 pb-2">
            <BarChart
              data={data[activeRepo].bins
                .toReversed()
                .map((b) => ({ ...b, Stars: b.diff }))}
            >
              <YAxis
                axisLine={false}
                width={40}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                tickFormatter={(value) => value.toString()}
              />
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                tickFormatter={(value) =>
                  formatDate(value, "", { day: "2-digit", month: "short" })
                }
                minTickGap={30}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="bg-background/90 backdrop-blur border border-border font-mono text-xs uppercase shadow-xl"
                    indicator="line"
                  />
                }
                cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                isAnimationActive={false}
              />
              <Bar
                isAnimationActive={true}
                animationDuration={1000}
                shape={<CustomGradientBar />}
                dataKey="Stars"
                fill="var(--chart-1)" // Ensure your CSS vars have this, or use specific color
              />
            </BarChart>
          </ChartContainer>
        )}
        {activeTab === "gazers" && (
          <div className="h-[350px] overflow-hidden flex flex-col">
            {stargazersTab}
          </div>
        )}
      </div>
    </Widget>
  );
}

export function RepoBeatsActivityGraph() {
  const [activeRepo] = useQueryState(
    "repo",
    parseAsStringLiteral(
      statsConfig.repositories.map((repo) => repo.repo),
    ).withDefault(statsConfig.repositories[0].repo),
  );
  const repoIdx = statsConfig.repositories.findIndex(
    (r) => r.repo === activeRepo,
  );

  return (
    <div className="relative rounded-lg overflow-hidden border border-border/50 bg-background/50 shadow-sm group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
      <Image
        width={814}
        height={318}
        alt="Project analytics and stats"
        src={statsConfig.repositories[repoIdx].repoBeatsUri}
        draggable={false}
        unselectable="on"
        className="w-full h-auto opacity-90 transition-opacity group-hover:opacity-100"
      />
    </div>
  );
}

const CustomGradientBar = (
  props: React.SVGProps<SVGRectElement> & { dataKey?: string },
) => {
  const { fill, x, y, width, height, dataKey } = props;
  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="none"
        fill={`url(#gradient-bar-pattern-${dataKey})`}
        rx={2} // Subtle rounded corners on bars
      />
      <defs>
        <linearGradient
          id={`gradient-bar-pattern-${dataKey}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          {/* Amber Gradient to match Star theme */}
          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.2} />
        </linearGradient>
      </defs>
    </>
  );
};