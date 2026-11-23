import type { ReactNode } from "react";
import { Area, AreaChart } from "@/components/charts/area-chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent, XAxis } from "@/components/charts/chart";
import { Icon, type IconType } from "@/components/icons";
import { ArrowLink } from "@/components/site/link";
import { StatsEmpty } from "@/components/stats/stats-empty";
import { MONO_SERIES } from "@/components/stats/tone";
import { RollingDigits } from "@/components/text/rolling-digits";
import { cn } from "@/lib/cn";
import type { ProjectConfig } from "../config";
import type { InsightResponse } from "../lib/insight";

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const day = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/** Change vs the previous period, coloured by direction. */
function Delta({ percent, className }: { percent: number; className?: string }) {
  const rounded = Math.round(percent);
  const dir = rounded > 0 ? "up" : rounded < 0 ? "down" : "flat";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs tabular-nums",
        dir === "up" && "bg-success/10 text-success",
        dir === "down" && "bg-destructive/10 text-destructive",
        dir === "flat" && "bg-foreground/[0.05] text-muted-foreground",
        className,
      )}
    >
      {dir === "flat" ? null : <Icon name={dir === "up" ? "arrow-up-right" : "arrow-down-right"} className="size-3" />}
      {Math.abs(rounded)}%<span className="sr-only"> {dir === "flat" ? "no change" : dir} vs last month</span>
    </span>
  );
}

/** One bento cell on the same raised-tile recipe as `Well`. */
function Tile({
  icon,
  label,
  aside,
  children,
  className,
}: {
  icon: IconType;
  label: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-card p-1", className)}>
      <div className="flex h-full flex-col justify-between gap-6 rounded-xl bg-background p-4 shadow-(--surface-shadow) dark:bg-popover">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-muted-foreground text-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-foreground/[0.05] text-foreground [&_svg]:size-4">
              <Icon name={icon} />
            </span>
            {label}
          </span>
          {aside}
        </div>
        <div className="flex min-w-0 flex-col gap-1">{children}</div>
      </div>
    </div>
  );
}

const Figure = ({ value, format }: { value: number; format?: (v: number) => string }) => (
  <span className="font-medium text-3xl tabular-nums tracking-tight">
    <RollingDigits value={value} format={format} startOnView locale="en-US" />
  </span>
);

const Note = ({ children }: { children: ReactNode }) => (
  <span className="truncate font-mono text-muted-foreground text-xs tabular-nums">{children}</span>
);

function Bento({ insight }: { insight: NonNullable<InsightResponse["data"]> }) {
  const users = Number(insight.users.totalUsers) || 0;
  const newUsers = Number(insight.users.currentPeriodCount) || 0;
  const sessions = Number(insight.sessions.currentPeriodCount) || Number(insight.sessions.totalSessions) || 0;
  const perUser = Number(insight.sessions.avgSessionsPerUser) || (users ? sessions / users : 0);
  const active = Number(insight.sessions.activeSessions) || 0;
  const series = (insight.sessions.graphData ?? []).map((g) => ({
    date: new Date(g.timestamp),
    sessions: Number(g.count) || 0,
  }));

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Tile
        icon="cursor"
        label="Sessions, last 30 days"
        aside={<Delta percent={Number(insight.sessions.growthPercent) || 0} />}
        className="col-span-2 lg:row-span-2"
      >
        <Figure value={sessions} />
        {series.length > 1 ? (
          <div className={cn(MONO_SERIES, "-mx-1 mt-3")}>
            <ChartContainer
              config={{ sessions: { label: "Sessions", color: "var(--chart-1)" } }}
              title="Sessions per day, last 30 days"
              locale="en-US"
              aspect="wide"
              className="aspect-[16/7]"
            >
              <AreaChart data={series} xKey="date">
                <XAxis tickFormatter={(d) => day(d as Date)} />
                <Area dataKey="sessions" variant="gradient" curve="monotone" line fillOpacity={0.16} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(v) => compact.format(Number(v))}
                      labelFormatter={(_, datum) => (datum.date instanceof Date ? day(datum.date) : "")}
                    />
                  }
                />
              </AreaChart>
            </ChartContainer>
          </div>
        ) : null}
      </Tile>

      <Tile icon="eye" label="Visitors">
        <Figure value={Number(insight.visitors) || 0} />
        <Note>all time</Note>
      </Tile>

      <Tile icon="users-group" label="Users" aside={<Delta percent={Number(insight.users.growthPercent) || 0} />}>
        <Figure value={users} />
        <Note>+{newUsers} this month</Note>
      </Tile>

      <Tile icon="repeat" label="Sessions / user">
        <Figure value={Math.round(perUser * 10)} format={(v) => (v / 10).toFixed(1)} />
        <Note>how often they return</Note>
      </Tile>

      <Tile icon="pulse" label="Active now">
        <Figure value={active} />
        <Note>open sessions</Note>
      </Tile>
    </div>
  );
}

export function Insights({ items }: { items: { project: ProjectConfig; insight: InsightResponse | null }[] }) {
  // The endpoint answers 200 with zeros when its own store is down, so zeros count as offline.
  const live = items.filter(
    ({ insight: i }) => i && i.success !== false && (Number(i.data.visitors) || Number(i.data.users.totalUsers)),
  );
  if (!live.length) {
    return (
      <StatsEmpty
        icon="users-group"
        ghost="grid"
        retry
        title="Usage numbers are offline"
        description="The projects' own stats endpoints didn't answer. They report back on the next refresh."
      />
    );
  }
  return (
    <div className="flex flex-col gap-10">
      {live.map(({ project, insight }) => {
        if (!insight?.data) return null;
        return (
          <div key={project.id} className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-medium text-sm">{project.title}</p>
              <ArrowLink href={`/projects/${project.id}`} className="text-sm">
                Project
              </ArrowLink>
            </div>
            <Bento insight={insight.data} />
          </div>
        );
      })}
    </div>
  );
}
