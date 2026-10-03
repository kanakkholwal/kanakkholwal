import { cn } from "@/lib/utils";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { formatStatNumber } from "../lib/format";
import type { NpmPackageStatsData } from "../lib/npm";
import { chartColor } from "../lib/palette";

// Small multiples. One chart per package scales to any number of packages,
// where one chart with a line per package stops being readable somewhere around
// four and runs out of distinguishable colours at eight.

export function PackageBreakdown({
  packages,
  stats,
}: {
  packages: readonly string[];
  stats: NpmPackageStatsData[];
}) {
  return (
    <section aria-labelledby="pkg-breakdown" className="w-full">
      <h3
        id="pkg-breakdown"
        className="mb-3 font-mono text-2xs uppercase tracking-widest text-muted-foreground"
      >
        Per package · last 90 days
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg, i) => {
          const series = stats[i].last90Days as { downloads: number }[];
          const values = series.map((d) => Number(d.downloads) || 0);
          const total = values.reduce((sum, v) => sum + v, 0);
          // Last complete week against the one before it. The final bucket is
          // partial, so comparing into it would report a fall every time.
          const prev = values.at(-3) ?? 0;
          const last = values.at(-2) ?? 0;

          return (
            <div
              key={pkg}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {pkg}
                </p>
                <Delta from={prev} to={last} />
              </div>
              <p className="text-xl font-bold tabular-nums tracking-tight text-foreground">
                {formatStatNumber(total)}
              </p>
              <Sparkline values={values} color={chartColor(i)} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const W = 100;
  const H = 28;
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? W / (values.length - 1) : W;
  const points = values
    .map((v, i) => `${(i * step).toFixed(1)},${(H - (v / max) * H).toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-7 w-full"
      // The figure carries no value the total above it doesn't already state.
      aria-hidden="true"
      focusable="false"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        // preserveAspectRatio="none" would otherwise stretch the stroke with
        // the box and give every card a different line weight.
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Delta({ from, to }: { from: number; to: number }) {
  const diff = to - from;
  const pct = from === 0 ? null : (diff / from) * 100;
  const Icon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 font-mono text-2xs tabular-nums",
        diff > 0 && "text-success",
        diff < 0 && "text-destructive",
        diff === 0 && "text-muted-foreground",
      )}
      // Colour alone cannot carry the direction, and the arrow is decorative.
      title={`${diff >= 0 ? "+" : "−"}${formatStatNumber(Math.abs(diff))} week over week`}
    >
      <Icon className="size-3" aria-hidden="true" />
      {pct === null ? "new" : `${diff >= 0 ? "+" : "−"}${Math.abs(pct).toFixed(0)}%`}
    </span>
  );
}
