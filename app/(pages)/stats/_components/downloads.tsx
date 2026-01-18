import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Download, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { formatStatNumber } from "../lib/format";
import {
  combineStats,
  Datum,
  fetchNpmPackage,
  getIsoWeekday,
  getPartialPreviousWeekDownloads,
  MultiDatum,
  NpmPackageStatsData,
} from "../lib/npm";
import { DownloadsGraph } from "./downloads.client";
import { GraphSkeleton } from "./graph.skeleton";
import { WidgetSkeleton } from "./widget.skeleton";

import { Fragment } from "react";
import { PiPackageDuotone } from "react-icons/pi";
import { statsConfig } from "../config";

export async function NPMStats() {
  const npmStats = await Promise.all(
    statsConfig.npmPackages.map((pkg) => fetchNpmPackage(pkg)),
  );
  const all = combineStats(
    statsConfig.npmPackages.reduce(
      (acc, pkg, index) => {
        acc[pkg] = npmStats[index];
        return acc;
      },
      {} as Record<string, NpmPackageStatsData>,
    ),
  );

  return (
    <div className="w-full p-6 border border-border rounded-xl bg-muted/5 flex flex-col md:flex-row items-center justify-between gap-6">

      {/* Primary Metric: Total Downloads */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background border border-border text-foreground shadow-sm">
          <PiPackageDuotone className="size-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest">
            Total_Aggregated_Downloads
          </span>
          <div className="text-3xl lg:text-4xl font-bold font-sans tracking-tight flex items-baseline gap-1">
            {formatStatNumber(all.allTime)}
            <span className="text-sm font-normal text-muted-foreground font-instrument-serif italic">
              all time
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Ticker */}
      <div className="flex flex-wrap justify-center md:justify-end gap-3">
        {statsConfig.npmPackages.map((pkg, index) => (
          <div key={pkg} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-xs font-medium text-foreground">{pkg}</span>
            <span className="h-3 w-px bg-border mx-1" />
            <span className="text-xs font-mono text-muted-foreground">
              {formatStatNumber(npmStats[index].allTime)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


export const NPMStatsSkeleton = () => (
  <div className="bg-muted h-9 w-64 animate-pulse rounded-md lg:h-12" />
);
function sumPastPeriodCallback(d: MultiDatum, index: number, array: MultiDatum[]) {
  let sum = 0;
  for (const key in d) {
    if (key !== "date") {
      sum += d[key] as number;
    }
  }
  return sum;
}

export async function NPMDownloads() {
  const npmStats = await Promise.all(
    statsConfig.npmPackages.map((pkg) => fetchNpmPackage(pkg)),
  );
  const data = statsConfig.npmPackages.reduce(
    (acc, pkg, index) => {
      acc[pkg] = npmStats[index];
      return acc;
    },
    {} as Record<string, NpmPackageStatsData>,
  )
  const [all, allWithoutKeys] = [combineStats(data), combineStats(data, false)];
  const allLast30Days = all.last30Days.reduce(
    (sum, d) => sum + sumPastPeriodCallback(d, 0, all.last30Days),
    0,
  );
  const allLast90Days = all.last90Days.reduce(
    (sum, d) => sum + sumPastPeriodCallback(d, 0, all.last90Days),
    0,
  );
  const lastDate = all.last30Days.at(-1)?.date;
  const lastDateWeekday = getIsoWeekday(lastDate ?? "");
  // Fortunately the epoch did not land on a Sunday (it was a Thursday).
  const isLastDateSunday = lastDateWeekday === 7;

  return (
    <>
      <DownloadsGraph
        data={all.last90Days}
        partialLast={!isLastDateSunday}
        trend={
          <TrendBadge
            label={` downloads this week vs ${isLastDateSunday ? "last week" : `the first ${lastDateWeekday} days of last week`}`}
            // Compare the N days of the current week (possibly pending)
            // to the first N days of the previous week.
            oldValue={getPartialPreviousWeekDownloads(
              allWithoutKeys.last30Days.reduce(
                (sum, d) => (sum.concat(d as unknown as Datum[])),
                [] as Datum[],
              ),
            )}
            newValue={Number(allWithoutKeys.last90Days.at(-1)?.downloads ?? 0)}
          />
        }
        title={
          <>
            <Download size={20} /> Last 90 days
            <dl className="mr-1 ml-auto flex gap-2">
              <dt className="sr-only">combined</dt>
              <dd>
                {formatStatNumber(allLast90Days)}
              </dd>
              <span className="font-light text-zinc-500" aria-hidden>
                |
              </span>
              {statsConfig.npmPackages.map((pkg, index) => {
                return (
                  <Fragment key={pkg}>
                    {index > 0 && (
                      <span className="font-light text-zinc-500" aria-hidden>
                        |
                      </span>
                    )}
                    <dt className="sr-only">{pkg}</dt>
                    <dd
                      className="text-zinc-500/50"
                      title={`Last 90 days, ${pkg}`}
                    >
                      {formatStatNumber(
                        npmStats[index].last90Days.reduce(
                          (sum, { downloads }) => sum + (downloads as number),
                          0,
                        ),
                      )}
                    </dd>
                  </Fragment>
                );
              })}
            </dl>
          </>
        }
      />
      <DownloadsGraph
        data={all.last30Days}
        partialLast={false}
        trend={
          <TrendBadge
            label=" downloads compared to 7 days ago"
            oldValue={Number(allWithoutKeys.last30Days.at(-8)?.downloads ?? 0)}
            newValue={Number(allWithoutKeys.last30Days.at(-1)?.downloads ?? 0)}
          />
        }
        title={
          <>
            <Download size={20} /> Last 30 days
            <dl className="mr-1 ml-auto flex gap-2">
              <dt className="sr-only">combined</dt>
              <dd>
                {formatStatNumber(allLast30Days)}
              </dd>
              <span className="font-light text-zinc-500" aria-hidden>
                |
              </span>
              {statsConfig.npmPackages.map((pkg, index) => {
                return (
                  <Fragment key={pkg}>
                    {index > 0 && (
                      <span className="font-light text-zinc-500" aria-hidden>
                        |
                      </span>
                    )}
                    <dt className="sr-only">{pkg}</dt>
                    <dd
                      className="text-zinc-500/50"
                      title={`Last 30 days, ${pkg}`}
                    >
                      {formatStatNumber(
                        npmStats[index].last30Days.reduce(
                          (sum, { downloads }) => sum + (downloads as number),
                          0,
                        ),
                      )}
                    </dd>
                  </Fragment>
                );
              })}
            </dl>
          </>
        }
      />
    </>
  );
}

export function NPMDownloadsSkeleton() {
  return (
    <>
      <WidgetSkeleton
        title={
          <div className="flex w-full items-center gap-2">
            <Download size={20} /> Last 90 days
            <div className="bg-muted ml-auto h-6 w-40 animate-pulse rounded-md" />
          </div>
        }
      >
        <div className="flex w-full justify-end py-2">
          <div className="bg-muted h-4 w-52 animate-pulse rounded-md" />
        </div>
        <GraphSkeleton className="h-69" />
      </WidgetSkeleton>
      <WidgetSkeleton
        title={
          <div className="flex w-full items-center gap-2">
            <Download size={20} /> Last 30 days
            <div className="bg-muted ml-auto h-6 w-40 animate-pulse rounded-md" />
          </div>
        }
      >
        <div className="flex w-full justify-end py-2">
          <div className="bg-muted h-4 w-52 animate-pulse rounded-md" />
        </div>
        <div className="flex h-69 w-full animate-pulse flex-col justify-between pt-1 pr-1 pl-10 opacity-50">
          <hr />
          <hr />
          <hr />
          <hr />
          <hr />
        </div>
      </WidgetSkeleton>
    </>
  );
}

// --

type TrendBadgeProps = {
  oldValue: number;
  newValue: number;
  label: string;
};

export function TrendBadge({ oldValue, newValue, label }: TrendBadgeProps) {
  const diff = newValue - oldValue;
  const pct = oldValue === 0 ? 100 : (diff / oldValue) * 100;
  const sign = diff === 0 ? "" : diff > 0 ? "+" : "-";
  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1.25 rounded-md border-none pl-1.5",
        diff > 0 && "bg-green-500/10 text-green-500",
        diff < 0 && "bg-red-500/10 text-red-500",
        diff === 0 && "bg-zinc-500/10 text-zinc-500",
      )}
      title={`${sign}${Math.abs(diff)} ${label}`}
    >
      {diff > 0 && <TrendingUp size={12} />}
      {diff < 0 && <TrendingDown size={12} />}
      {diff === 0 && <Minus size={12} />}
      {diff > 0 ? "+" : "-"}
      {formatStatNumber(Math.abs(diff)) || "No change"}
      {oldValue !== 0 && (
        <span className="font-normal">({pct.toFixed(1)}%)</span>
      )}
    </Badge>
  );
}
