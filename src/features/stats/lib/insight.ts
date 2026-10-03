import "@tanstack/react-start/server-only";
import { memo } from "~/lib/cache";
import type { ProjectConfig } from "../config";

export interface UserCountAndGrowthResult {
  currentPeriodCount: number;
  totalUsers: number;
  growth: number;
  growthPercent: number;
  trend: -1 | 1 | 0;
  periodStart: Date;
  periodEnd: Date;
  previousPeriodCount: number;
  graphData: GraphDataPoint[];
  summary: {
    currentPeriod: PeriodSummary;
    previousPeriod: PeriodSummary;
  };
}
export interface SessionCountAndGrowthResult {
  currentPeriodCount: number;
  totalSessions: number;
  activeSessions: number;
  growth: number;
  growthPercent: number;
  trend: -1 | 1 | 0;
  periodStart: Date;
  periodEnd: Date;
  previousPeriodCount: number;
  graphData: GraphDataPoint[];
  summary: {
    currentPeriod: PeriodSummary;
    previousPeriod: PeriodSummary;
  };
  uniqueUsers: number;
  avgSessionsPerUser: number;
}
export type TimeInterval = "last_hour" | "last_24_hours" | "last_week" | "last_month" | "last_year";
export interface DateRange {
  start: Date;
  end: Date;
}
export interface GraphDataPoint {
  timestamp: string;
  count: number;
  label: string;
  cumulativeCount: number;
}

export interface PeriodSummary {
  start: Date;
  end: Date;
  count: number;
  label: string;
}
export type projectInsightStats = {
  visitors: number;
  users: UserCountAndGrowthResult;
  sessions: SessionCountAndGrowthResult;
};

export type InsightResponse = {
  data: projectInsightStats;
  message: string;
  success?: boolean;
  error?: any;
};

export const getProjectInsight = memo(
  async (project: ProjectConfig, headers: Record<string, string> = {}): Promise<InsightResponse> => {
    try {
      const res = await fetch(project.endpoint, {
        headers,
      });
      if (!res.ok) {
        console.warn("No stats data received");
        console.error(`Failed to fetch project insight data: ${res.status} ${res.statusText}`);
        return Promise.resolve({
          data: {
            visitors: 0,
            users: {
              currentPeriodCount: 0,
              totalUsers: 0,
              growth: 0,
              growthPercent: 0,
              trend: 0,
              periodStart: new Date(),
              periodEnd: new Date(),
              previousPeriodCount: 0,
              graphData: [],
              summary: {
                currentPeriod: { start: new Date(), end: new Date(), count: 0, label: "" },
                previousPeriod: { start: new Date(), end: new Date(), count: 0, label: "" },
              },
            },
            sessions: {
              currentPeriodCount: 0,
              totalSessions: 0,
              activeSessions: 0,
              growth: 0,
              growthPercent: 0,
              trend: 0,
              periodStart: new Date(),
              periodEnd: new Date(),
              previousPeriodCount: 0,
              graphData: [],
              summary: {
                currentPeriod: { start: new Date(), end: new Date(), count: 0, label: "" },
                previousPeriod: { start: new Date(), end: new Date(), count: 0, label: "" },
              },
              uniqueUsers: 0,
              avgSessionsPerUser: 0,
            },
          },
          message: "Failed to fetch project insight data",
          success: false,
          error: res.statusText,
        });
      }
      const stats = (await res.json()) as InsightResponse;

      return Promise.resolve(stats);
    } catch (err) {
      console.error("Error fetching project insight data:", err);
      return Promise.reject(err);
    }
  },
);

export function cumulateStats(usersStats: UserCountAndGrowthResult, sessionsStats: SessionCountAndGrowthResult) {
  const allTimestamps = new Set([
    ...usersStats.graphData.map((d: any) => new Date(d.timestamp).getTime()),
    ...sessionsStats.graphData.map((d: any) => new Date(d.timestamp).getTime()),
  ]);
  const userMap = new Map(usersStats.graphData.map((d: any) => [new Date(d.timestamp).getTime(), d.count]));
  const sessionMap = new Map(sessionsStats.graphData.map((d: any) => [new Date(d.timestamp).getTime(), d.count]));
  return Array.from(allTimestamps)
    .sort((a, b) => a - b)
    .map((timestamp) => ({
      timestamp: new Date(timestamp),
      // Null, not 0: a bucket missing from one source would otherwise plot as a fake dip.
      users: userMap.get(timestamp) ?? null,
      sessions: sessionMap.get(timestamp) ?? null,
    }));
}
