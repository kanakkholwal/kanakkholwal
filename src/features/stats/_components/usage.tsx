import { useState } from "react";
import { Area, AreaChart } from "@/components/charts/area-chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent, XAxis } from "@/components/charts/chart";
import type { IconType } from "@/components/icons";
import { ArrowLink } from "@/components/site/link";
import { RankedTable } from "@/components/stats/ranked-table";
import { StatsEmpty } from "@/components/stats/stats-empty";
import { MONO_SERIES } from "@/components/stats/tone";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/cn";
import { type AnalyticsSnapshot, pointDate, pointLabel, type RangeKey } from "~/lib/analytics/types";
import { useStatsSearch } from "../client";
import type { UsageProject } from "../stats.functions";
import { Delta, Figure, Note, Tile } from "@/components/stats/tiles";

const RANGE_OPTIONS: RangeKey[] = ["7d", "30d", "90d"];
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const duration = (s: number) => (s < 60 ? `${Math.round(s)}s` : `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`);
const pct = (now: number, before: number) => (before ? ((now - before) / before) * 100 : now ? 100 : 0);

const BREAKDOWNS: { title: string; icon: IconType; key: "topPages" | "topCountries" | "topReferrers" | "devices" }[] = [
  { title: "Top pages", icon: "document", key: "topPages" },
  { title: "Countries", icon: "earth", key: "topCountries" },
  { title: "Channels", icon: "route", key: "topReferrers" },
  { title: "Devices", icon: "monitor", key: "devices" },
];

/** Visitors chart plus the headline tiles for one range; shared with the project pages. */
export function Traffic({ snapshot }: { snapshot: AnalyticsSnapshot }) {
  const { totals: t, previousTotals: p } = snapshot;
  const hourly = Boolean(snapshot.range.hourly);
  const span = hourly ? "24 hours" : `${snapshot.range.days} days`;
  const series = snapshot.series.filter((s) => s.date).map((s) => ({ date: pointDate(s.date), users: s.users }));
  // PostHog has no bounce rate; a flat zero would read as a perfect score.
  const showBounce = snapshot.source !== "posthog" || t.bounceRate > 0;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Tile
        icon="users-group"
        label={`Visitors, last ${span}`}
        aside={<Delta percent={pct(t.users, p.users)} />}
        className="col-span-2 lg:row-span-2"
      >
        <Figure value={t.users} />
        {series.length > 1 ? (
          <div className={cn(MONO_SERIES, "-mx-1 mt-3")}>
            <ChartContainer
              config={{ users: { label: "Visitors", color: "var(--chart-1)" } }}
              title={`Visitors, last ${span}`}
              locale="en-US"
              aspect="wide"
              className="aspect-[16/7]"
            >
              <AreaChart data={series} xKey="date">
                <XAxis tickFormatter={(d) => pointLabel(d as Date, hourly)} />
                <Area dataKey="users" variant="gradient" curve="monotone" line fillOpacity={0.16} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(v) => compact.format(Number(v))}
                      labelFormatter={(_, datum) => (datum.date instanceof Date ? pointLabel(datum.date, hourly) : "")}
                    />
                  }
                />
              </AreaChart>
            </ChartContainer>
          </div>
        ) : null}
      </Tile>

      <Tile icon="cursor" label="Sessions" aside={<Delta percent={pct(t.sessions, p.sessions)} />}>
        <Figure value={t.sessions} />
        <Note>{t.users ? `${(t.sessions / t.users).toFixed(1)} per visitor` : "no visits yet"}</Note>
      </Tile>
      <Tile icon="eye" label="Page views" aside={<Delta percent={pct(t.pageViews, p.pageViews)} />}>
        <Figure value={t.pageViews} />
        <Note>{t.sessions ? `${(t.pageViews / t.sessions).toFixed(1)} per session` : "no visits yet"}</Note>
      </Tile>
      <Tile icon="stopwatch" label="Avg. engagement">
        <Figure value={Math.round(t.avgEngagementSeconds)} format={duration} />
        <Note>per session</Note>
      </Tile>
      {showBounce ? (
        <Tile icon="logout" label="Bounce rate">
          <Figure value={Math.round(t.bounceRate * 100)} format={(v) => `${v}%`} />
          <Note>left after one page</Note>
        </Tile>
      ) : null}
    </div>
  );
}

/** Top pages, countries, channels and devices for one range. */
export function Breakdowns({ snapshot }: { snapshot: AnalyticsSnapshot }) {
  return (
    <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
      {BREAKDOWNS.map((b) => (
        <RankedTable key={b.key} title={b.title} icon={b.icon} unit="Visitors" items={snapshot[b.key]} />
      ))}
    </div>
  );
}

/** The platform's own numbers, only for a project that exposes a stats endpoint (today: College Ecosystem). */
function Platform({ insight }: { insight: NonNullable<UsageProject["insight"]> }) {
  const d = insight.data;
  const users = Number(d.users.totalUsers) || 0;
  const sessions = Number(d.sessions.currentPeriodCount) || Number(d.sessions.totalSessions) || 0;
  const perUser = Number(d.sessions.avgSessionsPerUser) || (users ? sessions / users : 0);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted-foreground text-xs">On the platform</p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile
          icon="users-group"
          label="Registered users"
          aside={<Delta percent={Number(d.users.growthPercent) || 0} vs="vs last month" />}
        >
          <Figure value={users} />
          <Note>+{Number(d.users.currentPeriodCount) || 0} this month</Note>
        </Tile>
        <Tile icon="eye" label="Lifetime visitors">
          <Figure value={Number(d.visitors) || 0} />
          <Note>all time</Note>
        </Tile>
        <Tile icon="repeat" label="Sessions / user">
          <Figure value={Math.round(perUser * 10)} format={(v) => (v / 10).toFixed(1)} />
          <Note>how often they return</Note>
        </Tile>
        <Tile icon="pulse" label="Active now">
          <Figure value={Number(d.sessions.activeSessions) || 0} />
          <Note>open sessions</Note>
        </Tile>
      </div>
    </div>
  );
}

export function Usage({ items }: { items: UsageProject[] }) {
  const { project, set } = useStatsSearch();
  const [range, setRange] = useState<RangeKey>("30d");
  const live = items.filter((i) => i.result || i.insight);
  const active = live.find((i) => i.id === project) ?? live[0];

  if (!active) {
    return (
      <StatsEmpty
        icon="users-group"
        ghost="grid"
        retry
        title="Usage numbers are offline"
        description="Analytics didn't answer for any project. They report back on the next refresh."
      />
    );
  }

  const snapshot = active.result?.ranges[range];
  const selectItems = live.map((i) => ({ value: i.id, label: i.title }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={active.id} onValueChange={(v) => set({ project: v })} items={selectItems}>
          <SelectTrigger variant="ghost" size="sm" className="-ml-2.5 font-medium text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent size="sm" align="start">
            {selectItems.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-3">
          {active.result ? (
            <ToggleGroup
              label="Range"
              variant="outline"
              size="sm"
              value={range}
              onValueChange={(v) => v && setRange(v as RangeKey)}
            >
              {RANGE_OPTIONS.map((r) => (
                <ToggleGroupItem key={r} value={r}>
                  {r}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          ) : null}
          <ArrowLink href={`/projects/${active.id}`} className="text-sm">
            Project
          </ArrowLink>
        </div>
      </div>

      {active.insight ? <Platform insight={active.insight} /> : null}

      {snapshot ? (
        <>
          <Traffic snapshot={snapshot} />
          <Breakdowns snapshot={snapshot} />
        </>
      ) : (
        <StatsEmpty
          icon="chart"
          ghost="chart"
          retry
          title={`No traffic data for ${active.title}`}
          description="Its analytics didn't answer this time."
        />
      )}
    </div>
  );
}

export function UsageSkeleton() {
  return <Skeleton shape="block" className="h-96 rounded-2xl" aria-busy />;
}
