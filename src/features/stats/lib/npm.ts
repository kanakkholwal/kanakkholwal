import "@tanstack/react-start/server-only";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { z } from "zod";
import { edgeMemo } from "~/lib/cache";

dayjs.extend(isoWeek);

export type Datum = {
  date: string;
  downloads: number;
};

export type MultiDatum = {
  date: string;
  [key: string]: string | number;
};

export type NpmPackageStatsData =
  | {
      withKeys: false;
      allTime: number;
      last30Days: Datum[];
      last90Days: Datum[];
    }
  | {
      withKeys: true;
      allTime: number;
      last30Days: MultiDatum[];
      last90Days: MultiDatum[];
    };

const rangeResponseSchema = z.object({
  downloads: z.array(
    z.object({
      downloads: z.number(),
      day: z.string(),
    }),
  ),
});

const API = "https://api.npmjs.org/downloads/range";
// npm's limits: a bulk range spans at most 365 days, holds at most 128 names, and refuses scoped ones.
const SPAN_DAYS = 365;
const BULK_MAX = 128;
const NPM_EPOCH = "2015-01-10";

type Series = { ok: boolean; days: Datum[] };

const toDatum = (rows: { day: string; downloads: number }[]): Datum[] =>
  rows.map((d) => ({ date: d.day, downloads: d.downloads }));

const sum = (days: Datum[]) => days.reduce((total, d) => total + d.downloads, 0);

/** `count` spans of SPAN_DAYS ending yesterday, newest first: [[start, end], ...]. */
function spans(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const end = dayjs().subtract(1 + i * SPAN_DAYS, "day");
    const start = end.subtract(SPAN_DAYS - 1, "day");
    return [start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD")] as const;
  }).filter(([, end]) => end >= NPM_EPOCH);
}

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`npm ${res.status} ${url}`);
  return res.json();
}

/** One request for many unscoped packages over one span. */
async function bulkRange(pkgs: string[], [start, end]: readonly [string, string]): Promise<Map<string, Series>> {
  const out = new Map<string, Series>();
  for (let i = 0; i < pkgs.length; i += BULK_MAX) {
    const batch = pkgs.slice(i, i + BULK_MAX);
    try {
      // A single name answers in the single-package shape, so bulk needs at least two.
      const json =
        batch.length === 1
          ? { [batch[0]]: await getJson(`${API}/${start}:${end}/${batch[0]}`) }
          : ((await getJson(`${API}/${start}:${end}/${batch.join(",")}`)) as Record<string, unknown>);
      for (const pkg of batch) {
        const parsed = rangeResponseSchema.safeParse(json[pkg]);
        out.set(pkg, { ok: parsed.success, days: parsed.success ? toDatum(parsed.data.downloads) : [] });
      }
    } catch (err) {
      console.error("[npm] bulk range failed", err);
      for (const pkg of batch) out.set(pkg, { ok: false, days: [] });
    }
  }
  return out;
}

async function singleRange(pkg: string, [start, end]: readonly [string, string]): Promise<Series> {
  try {
    const { downloads } = rangeResponseSchema.parse(await getJson(`${API}/${start}:${end}/${pkg}`));
    return { ok: true, days: toDatum(downloads) };
  } catch (err) {
    console.error(`[npm] range ${pkg} failed`, err);
    return { ok: false, days: [] };
  }
}

// A package that already had downloads at the start of a span existed before it, so look one span further.
const reachesBack = (days: Datum[]) => days.slice(0, 14).some((d) => d.downloads > 0);

/**
 * Stats for every package with as few requests as npm allows: one bulk call per year of history
 * for unscoped names, and one call per scoped name (plus older years only for old packages).
 */
async function fetchAll(pkgs: string[]): Promise<{ complete: boolean; stats: NpmPackageStatsData[] }> {
  const [latest, ...older] = spans(30);
  const unscoped = pkgs.filter((p) => !p.startsWith("@"));
  const scoped = pkgs.filter((p) => p.startsWith("@"));

  const recent = new Map<string, Series>([
    ...(await bulkRange(unscoped, latest)),
    ...(await Promise.all(scoped.map(async (p) => [p, await singleRange(p, latest)] as const))),
  ]);
  const allTime = new Map(pkgs.map((p) => [p, sum(recent.get(p)?.days ?? [])]));

  let pending = pkgs.filter((p) => reachesBack(recent.get(p)?.days ?? []));
  for (const span of older) {
    if (!pending.length) break;
    const page = new Map<string, Series>([
      ...(await bulkRange(
        pending.filter((p) => !p.startsWith("@")),
        span,
      )),
      ...(await Promise.all(
        pending.filter((p) => p.startsWith("@")).map(async (p) => [p, await singleRange(p, span)] as const),
      )),
    ]);
    for (const p of pending) allTime.set(p, (allTime.get(p) ?? 0) + sum(page.get(p)?.days ?? []));
    pending = pending.filter((p) => reachesBack(page.get(p)?.days ?? []));
  }

  const firstWeek = dayjs().subtract(90, "day").startOf("isoWeek").format("YYYY-MM-DD");
  const stats = pkgs.map((p): NpmPackageStatsData => {
    const days = [...(recent.get(p)?.days ?? [])];
    // Today's count isn't published until tomorrow; a trailing zero is "not yet", not "none".
    if (days.at(-1)?.downloads === 0) days.pop();
    return {
      withKeys: false,
      allTime: allTime.get(p) ?? 0,
      last30Days: days.slice(-30),
      last90Days: groupByWeek(days.filter((d) => d.date >= firstWeek)),
    };
  });
  return { complete: [...recent.values()].every((s) => s.ok), stats };
}

const cachedAll = edgeMemo("npm-stats", fetchAll, 86_400, (r) => r.complete);

/** One entry per package, same order as `pkgs`. */
export async function fetchNpmStats(pkgs: string[]): Promise<NpmPackageStatsData[]> {
  return (await cachedAll(pkgs)).stats;
}

function groupByWeek(data: Datum[]): Datum[] {
  const weeks = new Map<string, number>();
  for (const d of data) {
    const date = dayjs(d.date);
    const key = [`'${date.year() - 2000}`, date.isoWeek().toFixed().padStart(2, "0")].join("W");
    weeks.set(key, (weeks.get(key) ?? 0) + d.downloads);
  }
  return Array.from(weeks.entries()).map(([date, downloads]) => ({
    date,
    downloads,
  }));
}

export function combineStats(args: Record<string, NpmPackageStatsData>, withKeys = true): NpmPackageStatsData {
  function getCombined(key: "last30Days" | "last90Days"): Datum[] {
    const dateMap: Record<string, number> = {};
    for (const pkg of Object.values(args)) {
      for (const d of pkg[key]) {
        dateMap[d.date] = (dateMap[d.date] ?? 0) + (d.downloads as number);
      }
    }
    return Object.entries(dateMap)
      .map(([date, downloads]) => ({ date, downloads }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  function getWithKeys(key: "last30Days" | "last90Days"): MultiDatum[] {
    const dateMap: Record<string, Record<string, number>> = {};

    for (const [pkgName, pkg] of Object.entries(args)) {
      for (const d of pkg[key]) {
        if (!dateMap[d.date]) dateMap[d.date] = {};

        // Datum shape
        if ("downloads" in d) {
          dateMap[d.date][pkgName] = d.downloads as number;
        }

        // MultiDatum shape
        else {
          for (const [k, v] of Object.entries(d)) {
            if (k !== "date") dateMap[d.date][k] = v as number;
          }
        }
      }
    }

    return Object.entries(dateMap)
      .map(([date, obj]) => ({ date, ...obj }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
  if (withKeys) {
    return {
      withKeys: true,
      allTime: Object.values(args).reduce((sum, pkg) => sum + pkg.allTime, 0),
      last30Days: getWithKeys("last30Days"),
      last90Days: getWithKeys("last90Days"),
    };
  }
  return {
    withKeys: false,
    allTime: Object.values(args).reduce((sum, pkg) => sum + pkg.allTime, 0),
    last30Days: getCombined("last30Days"),
    last90Days: getCombined("last90Days"),
  };
}

// Re-export to avoid importing dayjs everywhere
// ISO weekday: 1 (Monday) - 7 (Sunday)
export function getIsoWeekday(date: string) {
  const lastDay = dayjs(date);
  return lastDay.isoWeekday();
}

export function getPartialPreviousWeekDownloads(data: Datum[]) {
  const lastDate = data.at(-1)?.date;
  if (!lastDate) return 0;
  const lastDay = dayjs(lastDate);
  const startOfLastWeek = lastDay.startOf("isoWeek").subtract(7, "day");
  const numDaysInCurrentWeek = lastDay.isoWeekday();
  const filtered = data.filter((d) => {
    const date = dayjs(d.date);
    return (
      date.isSame(startOfLastWeek) ||
      (date.isAfter(startOfLastWeek) && date.isBefore(startOfLastWeek.add(numDaysInCurrentWeek, "day")))
    );
  });
  return filtered.reduce((sum, d) => sum + d.downloads, 0);
}
