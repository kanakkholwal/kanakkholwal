export type AnalyticsSource = "ga" | "posthog" | "mock";

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

export interface AnalyticsFile {
  site: AnalyticsSnapshot;
  projects: Record<string, AnalyticsSnapshot>;
}

export type Trend = -1 | 0 | 1;

export interface Growth {
  delta: number;
  percent: number;
  trend: Trend;
}
