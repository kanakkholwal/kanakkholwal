import { cache } from "react";
import { ProjectConfig } from "../_components/insight";

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
export type TimeInterval =
  | "last_hour"
  | "last_24_hours"
  | "last_week"
  | "last_month"
  | "last_year";
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

export const getProjectInsight = cache(
  async (project: ProjectConfig): Promise<InsightResponse> => {
    try {
      const res = await fetch(project.endpoint, {
        headers: project.headers || {},
        next: { revalidate: 3600 }, // Revalidate every 60 minutes
      });
      if (!res.ok) {
        console.warn("No stats data received");
        return Promise.reject(
          new Error(
            `Failed to fetch project insight data: ${res.status} ${res.statusText}`,
          ),
        );
      }
      const stats = (await res.json()) as InsightResponse;

      return Promise.resolve(stats);
    } catch (err) {
      console.error("Error fetching project insight data:", err);
      return Promise.reject(err);
    }
  },
);

export function cumulateStats(
  usersStats: UserCountAndGrowthResult,
  sessionsStats: SessionCountAndGrowthResult,
) {
  const allTimestamps = new Set([
    ...usersStats.graphData.map((d: any) => new Date(d.timestamp).getTime()),
    ...sessionsStats.graphData.map((d: any) => new Date(d.timestamp).getTime()),
  ]);
  const userMap = new Map(
    usersStats.graphData.map((d: any) => [
      new Date(d.timestamp).getTime(),
      d.count,
    ]),
  );
  const sessionMap = new Map(
    sessionsStats.graphData.map((d: any) => [
      new Date(d.timestamp).getTime(),
      d.count,
    ]),
  );
  return Array.from(allTimestamps)
    .sort((a, b) => a - b)
    .map((timestamp) => ({
      timestamp: new Date(timestamp),
      users: userMap.get(timestamp) || 0,
      sessions: sessionMap.get(timestamp) || 0,
    }));
}
