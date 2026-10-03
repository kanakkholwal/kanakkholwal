import { useState } from "react";
import {
  combineTotals,
  NpmDownloadsChart,
  type NpmPackage,
  NpmPackageBreakdown,
  type NpmStatsRange,
  rangeTrend,
  TrendBadge,
  trailingSum,
} from "@/components/blocks/npm-stats";
import { Meta, Well } from "@/components/site/page";
import { StatGrid } from "@/components/stats/stat-grid";
import { StatsEmpty } from "@/components/stats/stats-empty";
import { MONO_SERIES } from "@/components/stats/tone";
import { TextTransition } from "@/components/text/text-transition";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { statsConfig } from "../config";
import type { NpmPackageStatsData } from "../lib/npm";

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

function toPackage(name: string, s: NpmPackageStatsData | undefined): NpmPackage {
  if (!s || s.withKeys) return { name, allTime: s?.allTime ?? 0, last30Days: [], last90Days: [] };
  return { name, allTime: s.allTime, last30Days: s.last30Days, last90Days: s.last90Days };
}

const sum90 = (p: NpmPackage) => p.last90Days.reduce((n, d) => n + d.downloads, 0);
const weight = (p: NpmPackage) => Math.max(p.allTime, sum90(p));

export function NpmDownloads({ stats }: { stats: NpmPackageStatsData[] }) {
  const [range, setRange] = useState<NpmStatsRange>("30d");
  // Biggest first, by all-time so a range switch never reorders the rows.
  const packages = statsConfig.npmPackages
    .map((name, i) => toPackage(name, stats[i]))
    .sort((a, b) => weight(b) - weight(a));
  const totals = combineTotals(packages);

  if (!totals.allTime && !totals.last30Days.length) {
    return (
      <StatsEmpty
        icon="brand-npm"
        title="npm is quiet right now"
        description="The registry didn't answer. Download counts come back on the next refresh."
      />
    );
  }

  const rows = range === "30d" ? totals.last30Days : totals.last90Days;
  const periodTotal = rows.reduce((sum, r) => sum + r.total, 0);
  const trend = rangeTrend(
    rows.map((r) => r.total),
    range,
  );

  return (
    <div className="flex flex-col gap-6">
      <StatGrid
        cells={[
          // A failed all-time walk returns a partial sum; the 90-day window is a floor it can't be under.
          { label: "All time", value: packages.reduce((n, p) => n + weight(p), 0) },
          { label: "Last 30 days", value: trailingSum(totals.last30Days, 30) },
          { label: "Last 7 days", value: trailingSum(totals.last30Days, 7) },
          { label: "Packages", value: packages.length },
        ]}
      />

      <Well>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <p className="font-medium text-sm">
              <TextTransition text={`Downloads per ${range === "30d" ? "day" : "week"}`} />
              <Meta className="ml-2">{compact.format(periodTotal)} total</Meta>
            </p>
            <p className="flex items-center gap-2">
              <TrendBadge change={trend} locale="en-US" />
              <Meta>
                <TextTransition
                  text={range === "30d" ? "last 7 days vs the 7 before" : "last 4 weeks vs the 4 before"}
                />
              </Meta>
            </p>
          </div>
          <ToggleGroup
            label="Range"
            variant="outline"
            size="sm"
            value={range}
            onValueChange={(v) => (v === "30d" || v === "90d") && setRange(v)}
          >
            <ToggleGroupItem value="30d">30d</ToggleGroupItem>
            <ToggleGroupItem value="90d">90d</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className={MONO_SERIES}>
          <NpmDownloadsChart
            data={rows}
            title={`npm downloads, last ${range === "30d" ? "30" : "90"} days`}
            locale="en-US"
            fillOpacity={0.16}
            className="aspect-[3/2] sm:aspect-[5/2]"
          />
        </div>
      </Well>

      <div className={MONO_SERIES}>
        <p className="mb-3 text-muted-foreground text-xs">
          <TextTransition text={`Per package, last ${range === "30d" ? "30" : "90"} days`} />
        </p>
        <NpmPackageBreakdown packages={packages.filter((p) => sum90(p) > 0)} range={range} locale="en-US" />
      </div>
    </div>
  );
}

export function NpmSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length skeleton never reorders.
          <div key={i} className="flex flex-col gap-2 bg-background p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>
      <Skeleton shape="block" className="aspect-[2/1] h-auto rounded-2xl" />
    </div>
  );
}
