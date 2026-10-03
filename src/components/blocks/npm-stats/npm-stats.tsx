import { type ReactNode, useState } from "react";
import { RollingDigits } from "@/components/text/rolling-digits/rolling-digits";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty/empty";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group/toggle-group";
import { cn } from "@/lib/cn";
import {
  combineTotals,
  formatChange,
  formatCompact,
  formatDayTick,
  formatWeekday,
  NPM_STATS_LABELS,
  type NpmPackage,
  type NpmStatsLabels,
  npmFacts,
  rangeTrend,
  trailingSum,
} from "./core";
import { NpmDownloadsChart } from "./downloads-chart";
import { NpmPackageBreakdown } from "./package-breakdown";
import { TrendBadge } from "./trend-badge";
import { NPM_STATS_LAYOUT, type NpmStatsRange, type NpmStatsVariant, npmStats } from "./variants";

export type { NpmPackage, NpmStatsLabels, NpmStatsRange, NpmStatsVariant };

export interface NpmStatsProps {
  packages: NpmPackage[];
  locale?: string;
  labels?: Partial<NpmStatsLabels>;
  variant?: NpmStatsVariant;
  /** Controlled window; pair with `onRangeChange`. */
  range?: NpmStatsRange;
  defaultRange?: NpmStatsRange;
  onRangeChange?: (range: NpmStatsRange) => void;
  className?: string;
}

/** npm downloads: the range total and its trend, the facts behind it, the chart and the packages. */
export function NpmStats({
  packages,
  locale,
  labels: labelsProp,
  variant = "default",
  range: rangeProp,
  defaultRange = "30d",
  onRangeChange,
  className,
}: NpmStatsProps) {
  const styles = npmStats({ variant });
  const layout = NPM_STATS_LAYOUT[variant];
  const labels = { ...NPM_STATS_LABELS, ...labelsProp };
  const [ownRange, setOwnRange] = useState<NpmStatsRange>(defaultRange);
  const range = rangeProp ?? ownRange;
  const totals = combineTotals(packages);
  const rows = range === "30d" ? totals.last30Days : totals.last90Days;
  const periodTotal = rows.reduce((sum, row) => sum + row.total, 0);
  const unit = range === "30d" ? labels.chartLast30 : labels.chartLast90;
  const trend = rangeTrend(
    rows.map((row) => row.total),
    range,
  );
  const facts = npmFacts(packages, range);
  const compact = (value: number) => formatCompact(value, locale);

  const setRange = (next: string | string[]) => {
    if (next !== "30d" && next !== "90d") return;
    if (rangeProp === undefined) setOwnRange(next);
    onRangeChange?.(next);
  };

  if (packages.length === 0) {
    return (
      <div data-slot="npm-stats" data-variant={variant} className={cn(styles.root(), className)}>
        <Empty variant="outline" size="sm" role="status">
          <EmptyHeader>
            <EmptyTitle>{labels.emptyTitle}</EmptyTitle>
            <EmptyDescription>{labels.emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div data-slot="npm-stats" data-variant={variant} data-range={range} className={cn(styles.root(), className)}>
      <header className={styles.head()}>
        <div className="min-w-0">
          <p className={styles.eyebrow()}>{labels.eyebrow}</p>
          <p className={styles.hero()}>
            <Figure value={periodTotal} format={compact} animate={layout.animate} className={styles.heroValue()} />
            <span className={styles.heroUnit()}>{unit}</span>
          </p>
          <p className={styles.trendRow()}>
            <TrendBadge change={trend} locale={locale} newLabel={labels.newLabel} className={styles.trend()} />
            <span className={styles.compare()}>{range === "30d" ? labels.compare30 : labels.compare90}</span>
          </p>
        </div>
        <ToggleGroup type="single" value={range} onValueChange={setRange} aria-label={labels.rangeLabel} size="sm">
          <ToggleGroupItem value="30d">{labels.range30}</ToggleGroupItem>
          <ToggleGroupItem value="90d">{labels.range90}</ToggleGroupItem>
        </ToggleGroup>
      </header>

      <dl className={styles.facts()}>
        <Fact label={labels.dailyAverage} styles={styles}>
          {compact(facts.dailyAverage)}
        </Fact>
        <Fact label={range === "30d" ? labels.peakDay : labels.peakWeek} styles={styles}>
          {facts.peak ? (
            <>
              {compact(facts.peak.value)}{" "}
              <span className={styles.factNote()}>{formatDayTick(facts.peak.date, locale)}</span>
            </>
          ) : (
            "–"
          )}
        </Fact>
        <Fact label={labels.busiestWeekday} styles={styles}>
          {facts.weekday ? (
            <>
              {formatWeekday(facts.weekday.day, locale)}{" "}
              <span className={styles.factNote()}>{labels.overAverage(formatChange(facts.weekday.lift, locale))}</span>
            </>
          ) : (
            "–"
          )}
        </Fact>
        <Fact label={labels.fastestGrowing} styles={styles}>
          {facts.leader ? (
            <>
              <span className="font-mono">{facts.leader.name}</span>{" "}
              <span className={styles.factNote()}>{formatChange(facts.leader.ratio, locale)}</span>
            </>
          ) : (
            "–"
          )}
        </Fact>
      </dl>

      <NpmDownloadsChart
        data={rows}
        title={`${labels.eyebrow} ${unit}`}
        locale={locale}
        fillOpacity={variant === "minimal" ? 0 : 0.22}
        grid={layout.grid}
        className={styles.chart()}
      />

      <dl className={styles.counts()}>
        <Count label={labels.allTime} styles={styles}>
          <Figure value={totals.allTime} format={compact} animate={layout.animate} className={styles.countValue()} />
        </Count>
        <Count label={labels.last7Days} styles={styles}>
          <Figure
            value={trailingSum(totals.last30Days, 7)}
            format={compact}
            animate={layout.animate}
            className={styles.countValue()}
          />
        </Count>
        <Count label={labels.packages} styles={styles}>
          <span className={styles.countValue()}>{packages.length}</span>
        </Count>
      </dl>

      {layout.packages ? (
        <section className={styles.footer()}>
          <h3 className={styles.sectionTitle()}>{labels.breakdownHeading}</h3>
          <NpmPackageBreakdown packages={packages} range={range} variant={variant} locale={locale} labels={labels} />
        </section>
      ) : null}
    </div>
  );
}

type Styles = ReturnType<typeof npmStats>;

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
      <dd className="order-first">{children}</dd>
    </div>
  );
}

/** A number that counts up once in view, or sits still when the variant is quiet. */
function Figure({
  value,
  format,
  animate,
  className,
}: {
  value: number;
  format: (value: number) => string;
  animate: boolean;
  className: string;
}) {
  return animate ? (
    <RollingDigits
      variant="count"
      value={value}
      format={format}
      durationMs={900}
      size="md"
      className={cn("font-bold text-foreground", className)}
    />
  ) : (
    <span className={className}>{format(value)}</span>
  );
}
