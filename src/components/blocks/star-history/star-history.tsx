"use client";

import { type ReactNode, useState } from "react";
import { Bar, BarChart, BarTooltip, BarXAxis, BarYAxis } from "@/components/charts/bar-chart";
import {
  CartesianGrid,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
} from "@/components/charts/chart";
import { Line, LineChart } from "@/components/charts/line-chart";
import { RollingDigits } from "@/components/text/rolling-digits/rolling-digits";
import { Badge } from "@/components/ui/badge/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs";
import { cn } from "@/lib/cn";
import {
  averagePerDay,
  bestDay,
  currentStars,
  firstStarDate,
  formatChange,
  formatCompact,
  formatDate,
  gainSeries,
  lastStarDate,
  recentGain,
  STAR_HISTORY_LABELS,
  type StarHistoryData,
  type StarHistoryLabels,
  starMilestones,
} from "./core";
import { STAR_HISTORY_LAYOUT, type StarHistoryMode, type StarHistoryVariant, starHistory } from "./variants";

export type { StarHistoryData, StarHistoryLabels, StarHistoryMode, StarHistoryVariant };

export interface StarHistoryProps {
  history: StarHistoryData;
  locale?: string;
  variant?: StarHistoryVariant;
  /** Controlled mode; pair with `onModeChange`. */
  mode?: StarHistoryMode;
  defaultMode?: StarHistoryMode;
  onModeChange?: (mode: StarHistoryMode) => void;
  labels?: Partial<StarHistoryLabels>;
  className?: string;
}

const SHORT_DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
const FULL_DATE: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

/** GitHub stars: the total and its trend, milestones, and the running total or the gain per bucket. */
export function StarHistory({
  history,
  locale,
  variant = "default",
  mode: modeProp,
  defaultMode = "cumulative",
  onModeChange,
  labels: labelsProp,
  className,
}: StarHistoryProps) {
  const labels = { ...STAR_HISTORY_LABELS, ...labelsProp };
  const styles = starHistory({ variant });
  const layout = STAR_HISTORY_LAYOUT[variant];
  const [ownMode, setOwnMode] = useState<StarHistoryMode>(defaultMode);
  const mode = modeProp ?? ownMode;

  const { data } = history;
  const total = currentStars(data);
  const recent = recentGain(data);
  const best = bestDay(data);
  const milestones = starMilestones(data);
  const first = firstStarDate(data);
  const lastStar = lastStarDate(data);
  const compact = (value: number) => formatCompact(value, locale);

  const setMode = (next: string) => {
    if (next !== "cumulative" && next !== "daily") return;
    if (modeProp === undefined) setOwnMode(next);
    onModeChange?.(next);
  };

  return (
    <div data-slot="star-history" data-variant={variant} data-mode={mode} className={cn(styles.root(), className)}>
      <Tabs value={mode} onValueChange={setMode} variant="segment" size="sm">
        <header className={styles.head()}>
          <div className="min-w-0">
            <p className={styles.repo()}>
              <StarIcon className={styles.repoIcon()} />
              <span className={styles.repoName()} title={history.repo}>
                {history.repo}
              </span>
            </p>
            <p className={styles.hero()}>
              {layout.animate ? (
                <RollingDigits
                  variant="count"
                  value={total}
                  format={compact}
                  durationMs={900}
                  size="md"
                  className={cn("font-bold text-foreground", styles.heroValue())}
                />
              ) : (
                <span className={styles.heroValue()}>{compact(total)}</span>
              )}
              <span className={styles.heroUnit()}>{labels.subhead}</span>
            </p>
            {data.length > 0 ? (
              <p className={styles.trendRow()}>
                <Badge
                  size="sm"
                  variant={
                    recent.ratio === null || recent.ratio === 0
                      ? "secondary"
                      : recent.ratio > 0
                        ? "success"
                        : "destructive"
                  }
                  className={styles.trend()}
                >
                  <TrendArrow ratio={recent.ratio} />
                  {recent.ratio === null ? labels.newLabel : formatChange(recent.ratio, locale)}
                </Badge>
                <span className={styles.compare()}>{labels.compare}</span>
              </p>
            ) : null}
          </div>
          {data.length > 0 ? (
            <TabsList aria-label={labels.modeLabel}>
              <TabsTrigger value="cumulative">{labels.modeCumulative}</TabsTrigger>
              <TabsTrigger value="daily">{labels.modeDaily}</TabsTrigger>
            </TabsList>
          ) : null}
        </header>

        {data.length === 0 ? (
          <div className={styles.chart()}>
            <Empty variant="outline" size="sm" role="status">
              <EmptyHeader>
                <EmptyTitle>{labels.emptyTitle}</EmptyTitle>
                <EmptyDescription>{labels.emptyDescription}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <>
            <dl className={styles.facts()}>
              <Fact label={labels.recent} styles={styles}>
                +{compact(recent.current)}
              </Fact>
              <Fact label={labels.bestDay} styles={styles}>
                {best ? (
                  <>
                    +{compact(best.stars)}{" "}
                    <span className={styles.factNote()}>{formatDate(best.date, locale, FULL_DATE)}</span>
                  </>
                ) : (
                  "–"
                )}
              </Fact>
              <Fact label={labels.milestone} styles={styles}>
                {milestones.reached ? (
                  <>
                    {compact(milestones.reached.value)}{" "}
                    <span className={styles.factNote()}>{formatDate(milestones.reached.date, locale, FULL_DATE)}</span>
                  </>
                ) : (
                  "–"
                )}
              </Fact>
              <Fact label={labels.nextMilestone} styles={styles}>
                {milestones.next ? (
                  <>
                    {compact(milestones.next.value)}
                    {milestones.next.days !== null ? (
                      <>
                        {" "}
                        <span className={styles.factNote()}>{labels.eta(milestones.next.days)}</span>
                      </>
                    ) : null}
                  </>
                ) : (
                  "–"
                )}
              </Fact>
            </dl>

            <div className={styles.chart()}>
              {/* Only the shown chart mounts, so each replays its reveal on switch. */}
              <TabsContent value="cumulative" className={styles.panel()}>
                {mode === "cumulative" ? (
                  <TotalChart history={history} labels={labels} locale={locale} grid={layout.grid} />
                ) : null}
              </TabsContent>
              <TabsContent value="daily" className={styles.panel()}>
                {mode === "daily" ? (
                  <GainChart history={history} labels={labels} locale={locale} grid={layout.grid} />
                ) : null}
              </TabsContent>
            </div>
          </>
        )}
      </Tabs>

      {data.length > 0 ? (
        <dl className={styles.counts()}>
          <Count label={labels.firstStar} styles={styles}>
            {first ? formatDate(first, locale, FULL_DATE) : "–"}
          </Count>
          <Count label={labels.avgPerDay} styles={styles}>
            {compact(averagePerDay(data))}
          </Count>
          <Count label={labels.lastStar} styles={styles}>
            {lastStar ? formatDate(lastStar, locale, SHORT_DATE) : "–"}
          </Count>
        </dl>
      ) : null}
    </div>
  );
}

type Styles = ReturnType<typeof starHistory>;

type ChartProps = {
  history: StarHistoryData;
  labels: StarHistoryLabels;
  locale?: string;
  grid: boolean;
};

function TotalChart({ history, labels, locale, grid }: ChartProps) {
  const rows = history.data.map((row) => ({ date: row.date, stars: row.stars }));
  return (
    <ChartContainer
      config={{ stars: { label: labels.seriesCumulative, color: "var(--chart-1)" } }}
      title={`${history.repo}: ${labels.seriesCumulative.toLowerCase()}`}
      locale={locale}
      aspect="wide"
    >
      <LineChart data={rows} xKey="date">
        {grid ? <CartesianGrid /> : null}
        <YAxis tickFormatter={(value) => formatCompact(Number(value), locale)} />
        <XAxis
          tickFormatter={(value) =>
            value instanceof Date ? formatDate(value, locale, { month: "short", year: "2-digit" }) : ""
          }
        />
        {/* Monotone: a spline would invent bumps in a count that only rises. */}
        <Line dataKey="stars" curve="monotone" terminalMarker strokeWidth={2} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatCompact(Number(value), locale)}
              labelFormatter={(_, datum) =>
                datum.date instanceof Date ? formatDate(datum.date, locale, FULL_DATE) : ""
              }
            />
          }
        />
      </LineChart>
    </ChartContainer>
  );
}

function GainChart({ history, labels, locale, grid }: ChartProps) {
  const gains = gainSeries(history.data);
  const name = gains.unit === "week" ? labels.seriesPerWeek : labels.seriesPerDay;
  // Week labels carry the year: a multi-year span would repeat "Dec 1".
  const bucket: Intl.DateTimeFormatOptions =
    gains.unit === "week" ? { month: "short", day: "numeric", year: "2-digit" } : SHORT_DATE;
  const rows = gains.rows.map((row) => ({
    label: formatDate(row.date, locale, bucket),
    gained: row.stars,
  }));
  return (
    <ChartContainer
      config={{ gained: { label: name, color: "var(--chart-1)" } }}
      title={`${history.repo}: ${name.toLowerCase()}`}
      locale={locale}
      aspect="wide"
    >
      {/* BarChart's own axes and tooltip: the time-scale parts need a line plot. */}
      <BarChart data={rows} xKey="label">
        {grid ? <CartesianGrid /> : null}
        <Bar dataKey="gained" />
        <BarXAxis maxLabels={8} />
        <BarYAxis tickFormatter={(value) => formatCompact(value, locale)} />
        <BarTooltip content={<ChartTooltipContent formatter={(value) => formatCompact(Number(value), locale)} />} />
      </BarChart>
    </ChartContainer>
  );
}

function Fact({ label, styles, children }: { label: string; styles: Styles; children: ReactNode }) {
  return (
    <div className={styles.fact()}>
      <dt className={styles.factLabel()}>{label}</dt>
      <dd className={styles.factValue()}>{children}</dd>
    </div>
  );
}

function Count({ label, styles, children }: { label: string; styles: Styles; children: ReactNode }) {
  return (
    <div className={styles.count()}>
      <dt className={styles.countLabel()}>{label}</dt>
      <dd className={cn("order-first", styles.countValue())}>{children}</dd>
    </div>
  );
}

function TrendArrow({ ratio }: { ratio: number | null }) {
  const d =
    ratio === null || ratio === 0 ? "M2.5 6h7" : ratio > 0 ? "M6 9.5v-7M3 5.5l3-3 3 3" : "M6 2.5v7M3 6.5l3 3 3-3";
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="m12 2.5 2.9 6 6.6.8-4.9 4.5 1.3 6.6L12 17.2l-5.9 3.2 1.3-6.6-4.9-4.5 6.6-.8Z" />
    </svg>
  );
}
