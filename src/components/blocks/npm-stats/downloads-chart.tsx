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
import { formatCompact, formatDayTick, isWeekLabel, weekToDate } from "./core";

export interface NpmDownloadsChartProps {
  /** Pre-aggregated rows (`{ date, total }`): daily `YYYY-MM-DD` or weekly `'YYWww`. */
  data: Array<{ date: string; total: number }>;
  /** Series name in the tooltip. */
  label?: string;
  /** Accessible name of the chart, e.g. `Downloads in the last 30 days`. */
  title?: string;
  locale?: string;
  /** Area fill under the line; `0` draws the line alone. */
  fillOpacity?: number;
  grid?: boolean;
  className?: string;
}

/** One total line: per-package lines would need a legend the package list already is. */
export function NpmDownloadsChart({
  data,
  label = "Downloads",
  title = label,
  locale,
  fillOpacity = 0.24,
  grid = true,
  className,
}: NpmDownloadsChartProps) {
  const weekly = data[0] ? isWeekLabel(data[0].date) : false;
  const rows = data.map((row) => ({ date: weekToDate(row.date), total: row.total }));
  const config: ChartConfig = { total: { label, color: "var(--chart-1)" } };
  const dateLabel = (value: unknown) => (value instanceof Date ? formatDayTick(value, locale) : "");
  return (
    <ChartContainer config={config} title={title} locale={locale} aspect="wide" className={className}>
      <AreaChart data={rows} xKey="date">
        {grid ? <CartesianGrid /> : null}
        <YAxis tickFormatter={(value) => formatCompact(Number(value), locale)} />
        <XAxis tickFormatter={dateLabel} />
        {/* Monotone never overshoots between points, so a quiet weekend can't dip below zero. */}
        <Area dataKey="total" variant="gradient" curve="monotone" line fillOpacity={fillOpacity} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatCompact(Number(value), locale)}
              labelFormatter={(_, datum) =>
                datum.date instanceof Date ? `${weekly ? "Week of " : ""}${formatDayTick(datum.date, locale)}` : ""
              }
            />
          }
        />
      </AreaChart>
    </ChartContainer>
  );
}
