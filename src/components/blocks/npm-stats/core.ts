import type { NpmStatsRange } from "./variants";

/** Row shape for daily downloads (`YYYY-MM-DD`) or weekly buckets (`'YYWww`). */
export type NpmDaily = { date: string; downloads: number };

/** Daily entries for the last 30 days. */
export type Npm30Days = NpmDaily[];

/** Weekly buckets (`'YYWww`) over the last ~90 days. */
export type Npm90Days = NpmDaily[];

export interface NpmPackage {
  /** npm package name, e.g. `next`. */
  name: string;
  /** Cumulative downloads since package creation. */
  allTime: number;
  /** 30 daily buckets. */
  last30Days: Npm30Days;
  /** ~13 weekly buckets (ISO weeks, `'YYWww`); the first and last may be partial. */
  last90Days: Npm90Days;
}

export interface NpmStatsLabels {
  eyebrow: string;
  /** Accessible name of the range toggle. */
  rangeLabel: string;
  range30: string;
  range90: string;
  /** Unit after the period total, per range. */
  chartLast30: string;
  chartLast90: string;
  /** What each range's trend compares. */
  compare30: string;
  compare90: string;
  dailyAverage: string;
  peakDay: string;
  peakWeek: string;
  busiestWeekday: string;
  /** Note under the busiest weekday, e.g. `+18% over average`. */
  overAverage: (lift: string) => string;
  fastestGrowing: string;
  allTime: string;
  last7Days: string;
  packages: string;
  breakdownHeading: string;
  /** Trend chip text when the prior period had no downloads. */
  newLabel: string;
  emptyTitle: string;
  emptyDescription: string;
}

export const NPM_STATS_LABELS: NpmStatsLabels = {
  eyebrow: "npm downloads",
  rangeLabel: "Range",
  range30: "30 days",
  range90: "90 days",
  chartLast30: "in the last 30 days",
  chartLast90: "in the last 90 days",
  compare30: "last 7 days vs the 7 before",
  compare90: "last 4 weeks vs the 4 before",
  dailyAverage: "Daily average",
  peakDay: "Peak day",
  peakWeek: "Peak week",
  busiestWeekday: "Busiest weekday",
  overAverage: (lift) => `${lift} over average`,
  fastestGrowing: "Fastest growing",
  allTime: "all time",
  last7Days: "last 7 days",
  packages: "packages",
  breakdownHeading: "Packages",
  newLabel: "New",
  emptyTitle: "No packages yet",
  emptyDescription: "Pass at least one package to render its downloads.",
};

/** Locale-aware compact number: `1.2M`, `48K`. */
export function formatCompact(value: number, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** `+8.1%` / `−4%`; the sign is part of the text so the change never reads by colour alone. */
export function formatChange(ratio: number, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
  }).format(ratio);
}

/** `32%`: a package's share of the range. */
export function formatShare(ratio: number, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(ratio);
}

/** "Jun 17" style label; UTC because every bucket date is built at UTC midnight. */
export function formatDayTick(date: Date, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** "W22 '25" style label for a weekly bucket. */
export function formatWeekTick(label: string): string {
  const match = /^'(\d{2})W(\d{1,2})$/.exec(label);
  return match ? `W${match[2]} '${match[1]}` : label;
}

/** `Tuesday` for ISO weekday 2. */
export function formatWeekday(isoDay: number, locale?: string): string {
  // 1 Jan 2024 was a Monday, so day N of that week is ISO weekday N.
  return new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(2024, 0, isoDay)),
  );
}

/** True when the row label is a weekly bucket (`'YYWww`); false for daily `YYYY-MM-DD`. */
export function isWeekLabel(label: string): boolean {
  return /^'\d{2}W\d{1,2}$/.test(label);
}

/** Monday (UTC) of an ISO week label, or the parsed date for a `YYYY-MM-DD` row. */
export function weekToDate(label: string): Date {
  const match = /^'(\d{2})W(\d{1,2})$/.exec(label);
  if (!match) return new Date(`${label}T00:00:00Z`);
  const year = 2000 + Number(match[1]);
  const jan4 = Date.UTC(year, 0, 4);
  const jan4Day = new Date(jan4).getUTCDay() || 7;
  return new Date(jan4 + ((Number(match[2]) - 1) * 7 - (jan4Day - 1)) * 86_400_000);
}

/** ISO weekday of a `YYYY-MM-DD` row (1 = Mon .. 7 = Sun). */
export function isoWeekday(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay() || 7;
}

/** Sum of the most recent `n` buckets. */
export function trailingSum(rows: Array<{ total: number }>, n: number): number {
  return rows.slice(-n).reduce((sum, row) => sum + row.total, 0);
}

export interface NpmTotals {
  allTime: number;
  last30Days: Array<{ date: string; total: number }>;
  last90Days: Array<{ date: string; total: number }>;
}

/** Every package summed per bucket, so the chart draws one honest total line. */
export function combineTotals(packages: NpmPackage[]): NpmTotals {
  return {
    allTime: packages.reduce((sum, pkg) => sum + pkg.allTime, 0),
    last30Days: combineRows(packages.map((pkg) => pkg.last30Days)),
    last90Days: combineRows(packages.map((pkg) => pkg.last90Days)),
  };
}

function combineRows(series: NpmDaily[][]): Array<{ date: string; total: number }> {
  const buckets = new Map<string, number>();
  for (const rows of series) {
    for (const row of rows) buckets.set(row.date, (buckets.get(row.date) ?? 0) + row.downloads);
  }
  // By date, not by string: `'26W9` sorts after `'26W10` as text.
  return Array.from(buckets, ([date, total]) => ({ date, total })).sort(
    (a, b) => weekToDate(a.date).getTime() - weekToDate(b.date).getTime(),
  );
}

export interface PeriodChange {
  current: number;
  previous: number;
  /** Fractional change; null when the prior period had nothing to compare against. */
  ratio: number | null;
}

/** The last `window` buckets against the `window` just before them. */
export function periodChange(values: number[], window: number): PeriodChange {
  const sum = (list: number[]) => list.reduce((a, b) => a + b, 0);
  const current = sum(values.slice(-window));
  const previous = sum(values.slice(-2 * window, -window));
  return {
    current,
    previous,
    ratio: previous > 0 ? (current - previous) / previous : null,
  };
}

/**
 * 30 days: the last 7 days against the 7 before. 90 days: the last 4 complete weeks against
 * the 4 before, with the partial first and last buckets left out.
 */
export function rangeTrend(values: number[], range: NpmStatsRange): PeriodChange {
  if (range === "30d") return periodChange(values, 7);
  return periodChange(values.length > 2 ? values.slice(1, -1) : values, 4);
}

/** A package's rows for a range. */
export function rangeRows(pkg: NpmPackage, range: NpmStatsRange): NpmDaily[] {
  return range === "30d" ? pkg.last30Days : pkg.last90Days;
}

export interface NpmFacts {
  dailyAverage: number;
  peak: { date: Date; value: number } | null;
  /** From the daily rows whatever the range: weekly buckets hide the weekday. */
  weekday: { day: number; lift: number } | null;
  leader: { name: string; ratio: number } | null;
}

/** What the range says beyond its total, all derived from the rows passed in. */
export function npmFacts(packages: NpmPackage[], range: NpmStatsRange): NpmFacts {
  const totals = combineTotals(packages);
  const rows = range === "30d" ? totals.last30Days : totals.last90Days;
  const sum = rows.reduce((total, row) => total + row.total, 0);
  const span = range === "30d" ? Math.max(1, rows.length) : 90;
  const top = rows.reduce<(typeof rows)[number] | null>(
    (best, row) => (!best || row.total > best.total ? row : best),
    null,
  );

  const byDay = new Map<number, { sum: number; n: number }>();
  for (const row of totals.last30Days) {
    const day = isoWeekday(row.date);
    const entry = byDay.get(day) ?? { sum: 0, n: 0 };
    byDay.set(day, { sum: entry.sum + row.total, n: entry.n + 1 });
  }
  const mean = totals.last30Days.length
    ? trailingSum(totals.last30Days, totals.last30Days.length) / totals.last30Days.length
    : 0;
  let weekday: NpmFacts["weekday"] = null;
  if (totals.last30Days.length >= 14 && mean > 0) {
    for (const [day, entry] of byDay) {
      const lift = entry.sum / entry.n / mean - 1;
      if (!weekday || lift > weekday.lift) weekday = { day, lift };
    }
  }

  let leader: NpmFacts["leader"] = null;
  for (const pkg of packages) {
    const { ratio } = rangeTrend(
      rangeRows(pkg, range).map((row) => row.downloads),
      range,
    );
    if (ratio !== null && ratio > 0 && (!leader || ratio > leader.ratio)) {
      leader = { name: pkg.name, ratio };
    }
  }

  return {
    dailyAverage: sum / span,
    peak: top ? { date: weekToDate(top.date), value: top.total } : null,
    weekday,
    leader,
  };
}
