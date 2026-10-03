export interface StarDatum {
  date: Date;
  stars: number;
}

export interface StarHistoryData {
  /** `owner/name` of the repository. */
  repo: string;
  /** ISO date when the repository was created. */
  createdAt: string | Date;
  /** Cumulative star count per day, oldest first. The chart ends at the last row. */
  data: StarDatum[];
}

export interface StarHistoryLabels {
  /** Unit after the total. */
  subhead: string;
  /** What the trend compares. */
  compare: string;
  recent: string;
  bestDay: string;
  milestone: string;
  nextMilestone: string;
  /** Note under the next milestone, e.g. `~140 days at this pace`. */
  eta: (days: number) => string;
  firstStar: string;
  avgPerDay: string;
  lastStar: string;
  /** Accessible name of the mode tabs. */
  modeLabel: string;
  modeCumulative: string;
  modeDaily: string;
  /** Series name in the tooltip, per mode and bucket. */
  seriesCumulative: string;
  seriesPerDay: string;
  seriesPerWeek: string;
  /** Trend chip text when the prior window earned nothing. */
  newLabel: string;
  emptyTitle: string;
  emptyDescription: string;
}

export const STAR_HISTORY_LABELS: StarHistoryLabels = {
  subhead: "stars",
  compare: "last 30 days vs the 30 before",
  recent: "Last 30 days",
  bestDay: "Best day",
  milestone: "Latest milestone",
  nextMilestone: "Next milestone",
  eta: (days) => `~${days} ${days === 1 ? "day" : "days"} at this pace`,
  firstStar: "first star",
  avgPerDay: "stars per day",
  lastStar: "last star",
  modeLabel: "Chart",
  modeCumulative: "Total",
  modeDaily: "Gained",
  seriesCumulative: "Stars",
  seriesPerDay: "Stars per day",
  seriesPerWeek: "Stars per week",
  newLabel: "New",
  emptyTitle: "No star history yet",
  emptyDescription: "Pass a `data` array of cumulative daily counts to render the chart.",
};

const DAY = 86_400_000;

/** Round numbers worth calling out, in order. */
export const STAR_MILESTONES = [
  10, 50, 100, 250, 500, 1_000, 2_500, 5_000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000,
];

/** Cumulative stars to stars gained per row; unstars clamp to zero. */
export function dailyGains(data: StarDatum[]): StarDatum[] {
  let previous = 0;
  return data.map((row) => {
    const gained = Math.max(0, row.stars - previous);
    previous = row.stars;
    return { date: row.date, stars: gained };
  });
}

/**
 * Gains to plot: per day up to ~4 months, per week beyond, where hundreds of day bars
 * would be thinner than a pixel. Each week sits on its UTC Monday.
 */
export function gainSeries(data: StarDatum[]): {
  unit: "day" | "week";
  rows: StarDatum[];
} {
  const gains = dailyGains(data);
  const first = gains[0];
  const last = gains.at(-1);
  if (!first || !last || last.date.getTime() - first.date.getTime() <= 120 * DAY) {
    return { unit: "day", rows: gains };
  }
  const weeks = new Map<number, number>();
  for (const row of gains) {
    const weekday = row.date.getUTCDay() || 7;
    const day = Date.UTC(row.date.getUTCFullYear(), row.date.getUTCMonth(), row.date.getUTCDate());
    const monday = day - (weekday - 1) * DAY;
    weeks.set(monday, (weeks.get(monday) ?? 0) + row.stars);
  }
  return {
    unit: "week",
    rows: Array.from(weeks, ([time, stars]) => ({ date: new Date(time), stars })),
  };
}

/** The first date with any stars, or `null` when the repo has none. */
export function firstStarDate(data: StarDatum[]): Date | null {
  return data.find((row) => row.stars > 0)?.date ?? null;
}

/** The last date the count went up: the real "last star", not the last row. */
export function lastStarDate(data: StarDatum[]): Date | null {
  for (let i = data.length - 1; i > 0; i--) {
    const row = data[i];
    const before = data[i - 1];
    if (row && before && row.stars > before.stars) return row.date;
  }
  return data[0] && data[0].stars > 0 ? data[0].date : null;
}

/** Last known star total: where the cumulative line ends. */
export function currentStars(data: StarDatum[]): number {
  return data.at(-1)?.stars ?? 0;
}

/** Average stars per day across the history, rounded to 1 decimal. */
export function averagePerDay(data: StarDatum[]): number {
  const first = data[0];
  const last = data.at(-1);
  if (!first || !last || data.length < 2) return 0;
  const days = Math.max(1, Math.round((last.date.getTime() - first.date.getTime()) / DAY));
  return Math.round(((last.stars - first.stars) / days) * 10) / 10;
}

/** Stars gained in the last `days` against the `days` before; ratio is null with no prior gain. */
export function recentGain(data: StarDatum[], days = 30): { current: number; previous: number; ratio: number | null } {
  const last = data.at(-1);
  if (!last) return { current: 0, previous: 0, ratio: null };
  const at = (time: number) => {
    let stars = data[0]?.stars ?? 0;
    for (const row of data) {
      if (row.date.getTime() > time) break;
      stars = row.stars;
    }
    return stars;
  };
  const end = last.date.getTime();
  const current = last.stars - at(end - days * DAY);
  const previous = at(end - days * DAY) - at(end - 2 * days * DAY);
  return {
    current,
    previous,
    ratio: previous > 0 ? (current - previous) / previous : null,
  };
}

/** The most stars gained in one day; the first row is skipped, it holds any starting count. */
export function bestDay(data: StarDatum[]): StarDatum | null {
  let best: StarDatum | null = null;
  for (const row of dailyGains(data).slice(1)) {
    if (row.stars > 0 && (!best || row.stars > best.stars)) best = row;
  }
  return best;
}

export interface StarMilestones {
  reached: { value: number; date: Date } | null;
  /** `days` is null when the last 30 days gained nothing, so no pace to project from. */
  next: { value: number; days: number | null } | null;
}

/** The last round number crossed and when, and the next one at the last 30 days' pace. */
export function starMilestones(data: StarDatum[]): StarMilestones {
  const stars = currentStars(data);
  const crossed = STAR_MILESTONES.filter((value) => value <= stars).at(-1);
  const upcoming = STAR_MILESTONES.find((value) => value > stars);
  const date = crossed ? data.find((row) => row.stars >= crossed)?.date : undefined;
  const pace = recentGain(data).current / 30;
  return {
    reached: crossed && date ? { value: crossed, date } : null,
    next: upcoming ? { value: upcoming, days: pace > 0 ? Math.ceil((upcoming - stars) / pace) : null } : null,
  };
}

/** Compact number formatter. */
export function formatCompact(value: number, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** `+8.1%`; the sign is in the text so a trend never reads by colour alone. */
export function formatChange(ratio: number, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
  }).format(ratio);
}

/** Dates are UTC midnights, so format in UTC or the day shifts west of Greenwich. */
export function formatDate(date: Date, locale: string | undefined, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).format(date);
}
