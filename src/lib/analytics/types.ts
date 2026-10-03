export type AnalyticsSource = "ga" | "posthog" | "mock";

export type RangeKey = "24h" | "7d" | "30d" | "90d";

/** `hours` marks a rolling, hour-by-hour range; the rest are whole days ending yesterday. */
export const RANGES: { key: RangeKey; days: number; hours?: number; label: string; short: string }[] = [
  { key: "24h", days: 1, hours: 24, label: "24 hours", short: "24h" },
  { key: "7d", days: 7, label: "7 days", short: "7d" },
  { key: "30d", days: 30, label: "30 days", short: "30d" },
  { key: "90d", days: 90, label: "90 days", short: "90d" },
];

export interface AnalyticsPoint {
  /** `YYYY-MM-DD`, or `YYYY-MM-DDTHH:00` for hourly ranges; wall time in the property's timezone. */
  date: string;
  users: number;
  pageViews: number;
  sessions: number;
}

export interface AnalyticsTotals {
  users: number;
  pageViews: number;
  sessions: number;
  avgEngagementSeconds: number;
  bounceRate: number;
}

export interface AnalyticsBreakdownItem {
  label: string;
  value: number;
}

export interface AnalyticsSnapshot {
  source: AnalyticsSource;
  live: boolean;
  label: string;
  propertyId: string | null;
  range: { start: string; end: string; days: number; hourly?: boolean };
  totals: AnalyticsTotals;
  previousTotals: AnalyticsTotals;
  series: AnalyticsPoint[];
  topPages: AnalyticsBreakdownItem[];
  topCountries: AnalyticsBreakdownItem[];
  topReferrers: AnalyticsBreakdownItem[];
  devices: AnalyticsBreakdownItem[];
  generatedAt: string;
}

// A range-selectable result. ok=false means no data (show a banner + zeros), never fake numbers.
export interface AnalyticsResult {
  ok: boolean;
  error: string | null;
  label: string;
  source: AnalyticsSource;
  ranges: Record<RangeKey, AnalyticsSnapshot>;
  generatedAt: string;
}

export type Trend = -1 | 0 | 1;

export interface Growth {
  delta: number;
  percent: number;
  trend: Trend;
}

/** A point's date as a Date that, formatted in UTC, shows the property's own wall time. */
export const pointDate = (date: string) => new Date(date.length > 10 ? `${date}:00Z` : `${date}T00:00:00Z`);

/** "4 Oct" for a day, "13:00" for an hour, always in UTC so server and client render the same text. */
export function pointLabel(date: Date, hourly = false, opts: Intl.DateTimeFormatOptions = {}) {
  return hourly
    ? date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC", ...opts })
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC", ...opts });
}

/** "prior 7d" or "prior 24h", for comparison notes. */
export const rangeShort = (range: AnalyticsSnapshot["range"]) => (range.hourly ? "24h" : `${range.days}d`);
