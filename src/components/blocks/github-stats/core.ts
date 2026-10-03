import type { GithubCalendarDay } from "@/components/blocks/github-calendar/calendar";

export type { GithubCalendarDay };

export interface GithubCounts {
  followers: number;
  stars: number;
  repos: number;
  forks: number;
}

/** Share of contributions per kind, in percent, as GitHub's activity overview reports it. */
export interface GithubContributionMix {
  commits: number;
  pullRequests: number;
  codeReviews: number;
  issues: number;
}

export interface GithubOrganization {
  name: string;
  url: string;
  /** Falls back to the name's initials when missing or broken. */
  avatarUrl?: string;
}

export interface GithubRepository {
  owner: string;
  name: string;
  url: string;
}

export interface GithubStatsData {
  counts: GithubCounts;
  /** Daily contributions keyed by year, e.g. `{ "2026": [...] }`. */
  contributions: Record<string, GithubCalendarDay[]>;
  mix?: GithubContributionMix;
  organizations?: GithubOrganization[];
  repositories?: GithubRepository[];
  /** Where "and N more" links; the list stops at five without it. */
  profileUrl?: string;
}

export type GithubStatsView = "days" | "weeks";

export interface GithubStatsLabels {
  eyebrow: string;
  followers: string;
  stars: string;
  repos: string;
  forks: string;
  /** Accessible name of the year select. */
  year: string;
  /** Accessible name of the days/weeks toggle. */
  view: string;
  days: string;
  weeks: string;
  /** Unit after the year's total, e.g. `in 2026`. */
  totalIn: (year: string) => string;
  /** Comparison window of the trend, e.g. `vs same days of 2025`. */
  compare: (year: string) => string;
  newLabel: string;
  longestStreak: string;
  currentStreak: string;
  bestDay: string;
  activeDays: string;
  dayCount: (count: number) => string;
  contributions: string;
  weekOf: string;
  mixTitle: string;
  commits: string;
  pullRequests: string;
  codeReviews: string;
  issues: string;
  contributedTo: string;
  alongside: string;
  more: (count: number) => string;
  emptyTitle: string;
  emptyDescription: string;
}

export const GITHUB_STATS_LABELS: GithubStatsLabels = {
  eyebrow: "Contributions",
  followers: "followers",
  stars: "stars earned",
  repos: "public repos",
  forks: "forks",
  year: "Contribution year",
  view: "Calendar view",
  days: "Days",
  weeks: "Weeks",
  totalIn: (year) => `in ${year}`,
  compare: (year) => `vs same days of ${year}`,
  newLabel: "New",
  longestStreak: "Longest streak",
  currentStreak: "Current streak",
  bestDay: "Best day",
  activeDays: "Active days",
  dayCount: (count) => `${count} ${count === 1 ? "day" : "days"}`,
  contributions: "Contributions",
  weekOf: "Week of",
  mixTitle: "Where the work went",
  commits: "Commits",
  pullRequests: "Pull requests",
  codeReviews: "Code review",
  issues: "Issues",
  contributedTo: "Contributed to",
  alongside: "Alongside",
  more: (count) => `+${count} more`,
  emptyTitle: "No contributions yet",
  emptyDescription: "Pass `contributions` keyed by year to draw the calendar.",
};

export const GITHUB_COUNT_KEYS = ["followers", "stars", "repos", "forks"] as const;

/** Fixed order: a kind keeps its shade whatever its share. */
export const GITHUB_MIX_KEYS = ["commits", "pullRequests", "codeReviews", "issues"] as const;

const DAY = 86_400_000;

/** Years with data, newest first. */
export function contributionYears(contributions: Record<string, GithubCalendarDay[]>): string[] {
  return Object.keys(contributions).sort((a, b) => b.localeCompare(a));
}

export function yearTotal(days: GithubCalendarDay[]): number {
  return days.reduce((sum, day) => sum + day.count, 0);
}

function utcDay(date: string | Date): number {
  if (typeof date === "string") return Date.parse(`${date.slice(0, 10)}T00:00:00Z`);
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function sortedDays(days: GithubCalendarDay[]): Array<{ time: number; count: number }> {
  return days
    .map((day) => ({ time: utcDay(day.date), count: day.count }))
    .filter((day) => !Number.isNaN(day.time))
    .sort((a, b) => a.time - b.time);
}

export interface ContributionInsights {
  longestStreak: number;
  /** Run of active days ending today, or yesterday when today is still empty. */
  currentStreak: number;
  best: { date: Date; count: number } | null;
  activeDays: number;
}

export function contributionInsights(days: GithubCalendarDay[]): ContributionInsights {
  const sorted = sortedDays(days);
  let longest = 0;
  let run = 0;
  let previous = Number.NaN;
  let best: ContributionInsights["best"] = null;
  let activeDays = 0;
  for (const day of sorted) {
    if (day.count > 0) {
      activeDays += 1;
      run = day.time - previous === DAY ? run + 1 : 1;
      previous = day.time;
      longest = Math.max(longest, run);
      if (!best || day.count > best.count) best = { date: new Date(day.time), count: day.count };
    }
  }
  let current = 0;
  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const day = sorted[i];
    if (!day) break;
    if (day.count > 0) current += 1;
    else if (i < sorted.length - 1 || current > 0) break;
  }
  return { longestStreak: longest, currentStreak: current, best, activeDays };
}

/**
 * The year against the same calendar days of the year before, so a year in progress
 * is never compared with a whole one. Null when the earlier year is missing or empty.
 */
export function sameDaysChange(
  contributions: Record<string, GithubCalendarDay[]>,
  year: string,
): { previousYear: string; ratio: number | null } | null {
  const days = contributions[year] ?? [];
  const previousYear = String(Number(year) - 1);
  const before = contributions[previousYear];
  if (!before?.length || !days.length) return null;
  const last = sortedDays(days).at(-1);
  if (!last) return null;
  const cutoff = new Date(last.time);
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 1);
  const previous = sortedDays(before)
    .filter((day) => day.time <= cutoff.getTime())
    .reduce((sum, day) => sum + day.count, 0);
  const total = yearTotal(days);
  return { previousYear, ratio: previous > 0 ? (total - previous) / previous : null };
}

/** Mix as shares of 1 in fixed order, rescaled in case the parts don't sum to 100. */
export function mixShares(mix: GithubContributionMix): Array<{ key: (typeof GITHUB_MIX_KEYS)[number]; share: number }> {
  const sum = GITHUB_MIX_KEYS.reduce((total, key) => total + Math.max(0, mix[key]), 0);
  return GITHUB_MIX_KEYS.map((key) => ({
    key,
    share: sum > 0 ? Math.max(0, mix[key]) / sum : 0,
  }));
}

/** Daily counts to weekly sums, each on its Sunday as GitHub's calendar columns are. */
export function weeklyContributions(days: GithubCalendarDay[]): Array<{ date: Date; count: number }> {
  const weeks = new Map<number, number>();
  for (const day of sortedDays(days)) {
    const sunday = day.time - new Date(day.time).getUTCDay() * DAY;
    weeks.set(sunday, (weeks.get(sunday) ?? 0) + day.count);
  }
  return Array.from(weeks, ([time, count]) => ({ date: new Date(time), count }));
}

export function formatCount(value: number, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(share: number, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(share);
}

/** `+18%`; the sign is in the text so a trend never reads by colour alone. */
export function formatChange(ratio: number, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
    signDisplay: "exceptZero",
  }).format(ratio);
}

export function formatDay(date: Date, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function initials(name: string): string {
  return name
    .split(/[\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
