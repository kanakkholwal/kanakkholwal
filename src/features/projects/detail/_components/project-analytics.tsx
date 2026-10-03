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
import { Section } from "@/components/site/page";
import { RollingDigits } from "@/components/text/rolling-digits";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group/toggle-group";
import { cn } from "@/lib/cn";
import { type AnalyticsResult, pointDate, pointLabel, RANGES, type RangeKey } from "~/lib/analytics/types";

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const duration = (s: number) => (s < 60 ? `${Math.round(s)}s` : `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`);
const config: ChartConfig = { users: { label: "Visitors", color: "var(--accent-ink)" } };

/** Live traffic for the project's own site; renders nothing until analytics is connected. */
export function ProjectAnalytics({
  result,
  number,
  index,
}: {
  result: AnalyticsResult | null;
  number?: number;
  index?: number;
}) {
  const [range, setRange] = useState<RangeKey>("30d");
  if (!result?.ok) return null;

  const snapshot = result.ranges[range];
  const hourly = snapshot.range.hourly;
  const rows = snapshot.series.filter((p) => p.date).map((p) => ({ date: pointDate(p.date), users: p.users }));
  const cells = [
    { label: "Visitors", value: snapshot.totals.users },
    { label: "Sessions", value: snapshot.totals.sessions },
    { label: "Page views", value: snapshot.totals.pageViews },
    { label: "Avg. engagement", value: snapshot.totals.avgEngagementSeconds, format: duration },
  ];

  return (
    <Section
      id="traffic"
      title="traffic."
      number={number}
      description="Visitors to the live site."
      index={index}
      action={
        <ToggleGroup
          label="Range"
          variant="outline"
          size="sm"
          value={range}
          onValueChange={(v) => v && setRange(v as RangeKey)}
        >
          {RANGES.map((r) => (
            <ToggleGroupItem key={r.key} value={r.key}>
              {r.short}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
    >
      <div className="overflow-hidden rounded-xl border border-border">
        <dl className="grid grid-cols-2 sm:grid-cols-4">
          {cells.map((c, i) => (
            <div
              key={c.label}
              className={cn(
                "flex flex-col gap-1 p-4",
                i % 2 === 1 && "border-border border-l",
                i >= 2 && "border-border border-t sm:border-t-0",
                i === 2 && "sm:border-l",
              )}
            >
              <dt className="text-muted-foreground text-xs">{c.label}</dt>
              <dd className="font-medium text-2xl tabular-nums">
                <RollingDigits value={c.value} startOnView locale="en-US" format={c.format} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="border-border border-t p-4">
          <ChartContainer
            config={config}
            title={hourly ? "Visitors, last 24 hours" : `Visitors, last ${snapshot.range.days} days`}
            locale="en-GB"
            aspect="auto"
            className="h-56"
          >
            <AreaChart data={rows} xKey="date">
              <CartesianGrid />
              <YAxis tickFormatter={(v) => compact.format(v)} />
              <XAxis tickFormatter={(d) => pointLabel(d, hourly)} />
              <Area dataKey="users" curve="monotone" fillOpacity={0.24} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => compact.format(v)}
                    labelFormatter={(_, d) => (d.date instanceof Date ? pointLabel(d.date, hourly) : "")}
                  />
                }
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>
    </Section>
  );
}
