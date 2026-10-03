import { useState } from "react";
import { Area, AreaChart } from "@/components/charts/area-chart";
import {
  CartesianGrid,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
} from "@/components/charts/chart";
import { TextLink } from "@/components/site/link";
import { Meta, Page, PageHeader, Section, Well } from "@/components/site/page";
import { RankedTable } from "@/components/stats/ranked-table";
import { type StatCell, StatTiles } from "@/components/stats/stat-grid";
import { StatsEmpty } from "@/components/stats/stats-empty";
import { MONO_SERIES } from "@/components/stats/tone";
import { TextTransition } from "@/components/text/text-transition";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  type AnalyticsResult,
  type AnalyticsSnapshot,
  pointDate,
  pointLabel,
  RANGES,
  type RangeKey,
  rangeShort,
} from "~/lib/analytics/types";
import { fmtDuration, growth } from "./_components/utils";

const GA_URL = "https://marketingplatform.google.com/about/analytics/";
const number = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
function change(current: number, previous: number, span: string) {
  if (!previous) return current ? "new this period" : "no change";
  const { percent } = growth(current, previous);
  const sign = percent > 0 ? "+" : percent < 0 ? "−" : "";
  return `${sign}${Math.abs(percent).toFixed(0)}% vs prior ${span}`;
}

function tiles(s: AnalyticsSnapshot): StatCell[] {
  const { totals: t, previousTotals: p } = s;
  const span = rangeShort(s.range);
  const perSession = (x: typeof t) => (x.sessions ? x.pageViews / x.sessions : 0);
  return [
    { label: "Unique visitors", value: t.users, note: change(t.users, p.users, span) },
    { label: "Sessions", value: t.sessions, note: change(t.sessions, p.sessions, span) },
    { label: "Page views", value: t.pageViews, note: change(t.pageViews, p.pageViews, span) },
    {
      label: "Pages / session",
      // RollingDigits rounds to an integer, so tenths ride in the value.
      value: Math.round(perSession(t) * 10),
      format: (v) => (v / 10).toFixed(1),
      note: change(perSession(t), perSession(p), span),
    },
    {
      label: "Avg. session",
      value: t.avgEngagementSeconds,
      format: fmtDuration,
      note: change(t.avgEngagementSeconds, p.avgEngagementSeconds, span),
    },
    {
      label: "Bounce rate",
      value: Math.round(t.bounceRate * 100),
      format: (v) => `${v}%`,
      note: change(t.bounceRate, p.bounceRate, span),
    },
  ];
}

const chartConfig: ChartConfig = { users: { label: "Visitors", color: "var(--chart-1)" } };

function TrafficChart({ snapshot }: { snapshot: AnalyticsSnapshot }) {
  const hourly = snapshot.range.hourly;
  const rows = snapshot.series.filter((p) => p.date).map((p) => ({ date: pointDate(p.date), users: p.users }));
  const peak = rows.reduce((best, r) => (r.users > best ? r.users : best), 0);
  return (
    <Well>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <p className="font-medium text-sm">Visitors per {hourly ? "hour" : "day"}</p>
        <Meta>peak {number.format(peak)}</Meta>
      </div>
      <div className={MONO_SERIES}>
        <ChartContainer
          config={chartConfig}
          title={`Unique visitors per ${hourly ? "hour" : "day"}`}
          locale="en-US"
          aspect="wide"
          className="aspect-[3/2] sm:aspect-[5/2]"
        >
          <AreaChart data={rows} xKey="date">
            <CartesianGrid variant="dashed" className="stroke-border/70" />
            <YAxis tickFormatter={(v) => compact.format(v)} />
            <XAxis tickFormatter={(d) => pointLabel(d, hourly)} />
            <Area dataKey="users" curve="monotone" fillOpacity={0.16} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(v) => number.format(Number(v))}
                  labelFormatter={(_, datum) =>
                    datum.date instanceof Date ? pointLabel(datum.date, hourly, hourly ? {} : { weekday: "short" }) : ""
                  }
                />
              }
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </Well>
  );
}

export default function AnalyticsClient({ result }: { result: AnalyticsResult }) {
  const [rangeKey, setRangeKey] = useState<RangeKey>("30d");
  const snapshot = result.ranges[rangeKey];
  const live = result.ok && snapshot.series.some((p) => p.date);
  const topCountry = snapshot.topCountries[0]?.label;
  const span = snapshot.range.hourly
    ? "last 24 hours"
    : snapshot.range.start && snapshot.range.end
      ? `${pointLabel(pointDate(snapshot.range.start))} to ${pointLabel(pointDate(snapshot.range.end))}`
      : `last ${snapshot.range.days} days`;

  return (
    <Page className="flex flex-col gap-20">
      <PageHeader
        className="mb-0"
        title="analytics."
        eyebrow={result.label}
        description="Who reads this site and how they got here. Nothing sampled or rounded up."
      />

      <Section
        id="traffic"
        title="site traffic."
        number={1}
        index={1}
        action={
          <ToggleGroup
            label="Date range"
            variant="outline"
            size="sm"
            value={rangeKey}
            onValueChange={(v) => v && setRangeKey(v as RangeKey)}
          >
            {RANGES.map((r) => (
              <ToggleGroupItem key={r.key} value={r.key}>
                {r.short}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        }
      >
        <p className="-mt-2 mb-6 max-w-[38rem] text-muted-foreground text-sm">
          Unique visitors and sessions from <TextLink href={GA_URL}>Google Analytics</TextLink>, refreshed hourly.
        </p>

        {live ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="truncate text-muted-foreground text-sm">
                {topCountry ? (
                  <>
                    Most visits from <TextTransition text={topCountry} className="text-foreground" />
                  </>
                ) : (
                  "Visits from everywhere"
                )}
              </p>
              <Meta className="shrink-0">
                <TextTransition text={span} />
              </Meta>
            </div>
            <StatTiles cells={tiles(snapshot)} />
            <TrafficChart snapshot={snapshot} />
          </div>
        ) : (
          <StatsEmpty
            icon="chart"
            title="No traffic to show"
            description={result.error ?? `Google Analytics returned nothing for the ${span}.`}
          />
        )}
      </Section>

      {live ? (
        <Section
          id="breakdown"
          title="where from."
          number={2}
          description={`${snapshot.range.hourly ? "Last 24 hours" : `Last ${snapshot.range.days} days`}, top five each`}
          index={2}
        >
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            <RankedTable title="Top pages" unit="Visitors" items={snapshot.topPages} />
            <RankedTable title="Countries" unit="Visitors" items={snapshot.topCountries} />
            <RankedTable title="Channels" unit="Visitors" items={snapshot.topReferrers} />
            <RankedTable title="Devices" unit="Visitors" items={snapshot.devices} />
          </div>
        </Section>
      ) : null}
    </Page>
  );
}
