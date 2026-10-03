import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import {
  formatCompact,
  formatShare,
  NPM_STATS_LABELS,
  type NpmPackage,
  type NpmStatsLabels,
  rangeRows,
  rangeTrend,
} from "./core";
import { NpmSparkline } from "./sparkline";
import { TrendBadge } from "./trend-badge";
import { type NpmStatsRange, type NpmStatsVariant, npmStats, packageFill } from "./variants";

export interface NpmPackageBreakdownProps extends ComponentProps<"div"> {
  packages: NpmPackage[];
  range?: NpmStatsRange;
  variant?: NpmStatsVariant;
  locale?: string;
  labels?: Partial<NpmStatsLabels>;
}

/**
 * Every package's share of the range as one bar, then a row each in the order given, so a
 * range switch never reshuffles rows under the pointer.
 */
export function NpmPackageBreakdown({
  packages,
  range = "30d",
  variant = "default",
  locale,
  labels: labelsProp,
  className,
  ...props
}: NpmPackageBreakdownProps) {
  const styles = npmStats({ variant });
  const labels = { ...NPM_STATS_LABELS, ...labelsProp };
  const compare = range === "30d" ? labels.compare30 : labels.compare90;
  const rows = packages.map((pkg, index) => {
    const values = rangeRows(pkg, range).map((row) => row.downloads);
    return {
      pkg,
      values,
      fill: packageFill(index, packages.length),
      total: values.reduce((a, b) => a + b, 0),
    };
  });
  const sum = rows.reduce((total, row) => total + row.total, 0);
  return (
    <div data-slot="npm-breakdown" className={cn("flex flex-col gap-4", className)} {...props}>
      <div className={styles.shareBar()} aria-hidden="true">
        {rows.map(({ pkg, fill, total }) =>
          total > 0 ? (
            <span key={pkg.name} className={styles.shareSegment()} style={{ flexGrow: total, background: fill }} />
          ) : null,
        )}
      </div>
      <ol className={styles.list()}>
        {rows.map(({ pkg, values, fill, total }) => (
          <li key={pkg.name} data-slot="npm-breakdown-row" className={styles.row()}>
            <p className={styles.rowName()} title={pkg.name}>
              <span aria-hidden="true" className={styles.rowSwatch()} style={{ background: fill }} />
              <span className="truncate">{pkg.name}</span>
            </p>
            <p className={styles.rowShare()}>{formatShare(sum > 0 ? total / sum : 0, locale)}</p>
            <NpmSparkline values={values} className={styles.spark()} />
            <p className={styles.rowTotal()}>{formatCompact(total, locale)}</p>
            <TrendBadge
              change={rangeTrend(values, range)}
              srCompare={compare}
              locale={locale}
              newLabel={labels.newLabel}
              className={styles.rowTrend()}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
