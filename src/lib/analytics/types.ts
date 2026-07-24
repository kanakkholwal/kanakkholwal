export type AnalyticsSource = "ga" | "posthog" | "mock";

export type RangeKey = "7d" | "30d" | "90d";

export const RANGES: { key: RangeKey; days: number; label: string; short: string }[] = [
  { key: "7d", days: 7, label: "7 days", short: "7d" },
  { key: "30d", days: 30, label: "30 days", short: "30d" },
  { key: "90d", days: 90, label: "90 days", short: "90d" },
];

export interface AnalyticsPoint {
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
  range: { start: string; end: string; days: number };
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
