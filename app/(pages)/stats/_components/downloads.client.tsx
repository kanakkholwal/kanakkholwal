"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ReactNode } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatDate, formatStatNumber } from "../lib/format";
import type { MultiDatum } from "../lib/npm";
import { chartColor } from "../lib/palette";
import { Widget, WidgetProps } from "./widget";

/** Rows carry every package plus a precomputed `total`. */
export type TotalDatum = MultiDatum & { total: number };

type DownloadsGraphProps = WidgetProps & {
  data: TotalDatum[];
  packages: readonly string[];
  trend: ReactNode;
};

// One series, not one per package. Nine lines over 13 weekly points was a
// spaghetti plot: no reading of it answered a question, the legend needed a
// second row that landed on top of the trend badge, and `var(--chart-${i + 1})`
// ran past --chart-8 so the ninth package had no colour at all. The total is
// what the chart is for; per-package numbers live in the breakdown below and in
// this tooltip, where every value carries its own label.
export function DownloadsGraph({
  data,
  packages,
  trend,
  ...props
}: DownloadsGraphProps) {
  const config: ChartConfig = {
    total: { label: "All packages", color: "var(--chart-1)" },
    ...Object.fromEntries(
      packages.map((pkg, i) => [pkg, { label: pkg, color: chartColor(i) }]),
    ),
  };

  return (
    <Widget {...props}>
      <div className="mb-3 flex justify-end">{trend}</div>
      <ChartContainer className="h-72 w-full pr-1" config={config}>
        <AreaChart data={data} margin={{ top: 5, right: 0, bottom: 5, left: 5 }}>
          <defs>
            <linearGradient id="downloads-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-total)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--color-total)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <YAxis
            width={44}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatStatNumber(value)}
          />
          <XAxis
            padding={{ left: 12, right: 12 }}
            dataKey="date"
            axisLine={false}
            tickLine={false}
            minTickGap={40}
            tickMargin={10}
            tickFormatter={(value: string) =>
              value.startsWith("'")
                ? value
                : formatDate(value, "", { day: "2-digit", month: "short" })
            }
          />
          <ChartTooltip
            isAnimationActive={false}
            content={
              <ChartTooltipContent
                valueFormatter={(value) => formatStatNumber(value as number)}
              />
            }
          />
          <Area
            dataKey="total"
            type="monotone"
            isAnimationActive={false}
            stroke="var(--color-total)"
            strokeWidth={2}
            fill="url(#downloads-fill)"
            dot={false}
            // Every package is present in the row, so the tooltip lists the
            // breakdown even though only the total is drawn.
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ChartContainer>
    </Widget>
  );
}
