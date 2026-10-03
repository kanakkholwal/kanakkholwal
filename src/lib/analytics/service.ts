import "@tanstack/react-start/server-only";
import { appConfig } from "root/project.config";
import { edgeMemo } from "~/lib/cache";
import { getServerEnv } from "~/server/env.server";
import { fetchGaResult, type ServiceAccount } from "./ga";
import { fetchPosthogResult } from "./posthog";
import {
  type AnalyticsResult,
  type AnalyticsSnapshot,
  type AnalyticsSource,
  type AnalyticsTotals,
  type Growth,
  RANGES,
  type RangeKey,
} from "./types";

const REVALIDATE = 3600; // 1h; GA data isn't real-time

function serviceAccount(): ServiceAccount | null {
  const raw = getServerEnv().GA_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ServiceAccount;
  } catch {
    console.error("[analytics] GA_SERVICE_ACCOUNT_KEY is not valid JSON");
    return null;
  }
}

const zeroTotals = (): AnalyticsTotals => ({
  users: 0,
  pageViews: 0,
  sessions: 0,
  avgEngagementSeconds: 0,
  bounceRate: 0,
});

function zeroSnapshot(range: (typeof RANGES)[number], label: string, source: AnalyticsSource): AnalyticsSnapshot {
  const days = range.days;
  return {
    source,
    live: false,
    label,
    propertyId: null,
    range: { start: "", end: "", days, hourly: Boolean(range.hours) },
    totals: zeroTotals(),
    previousTotals: zeroTotals(),
    series: Array.from({ length: range.hours ?? days }, () => ({ date: "", users: 0, pageViews: 0, sessions: 0 })),
    topPages: [],
    topCountries: [],
    topReferrers: [],
    devices: [],
    generatedAt: "",
  };
}

function zeroResult(label: string, error: string, source: AnalyticsSource = "ga"): AnalyticsResult {
  const ranges = Object.fromEntries(RANGES.map((r) => [r.key, zeroSnapshot(r, label, source)])) as Record<
    RangeKey,
    AnalyticsSnapshot
  >;
  return { ok: false, error, label, source, ranges, generatedAt: "" };
}

async function buildSiteData(): Promise<AnalyticsResult> {
  const sa = serviceAccount();
  const cfg = appConfig.analytics.site;
  const propertyId = getServerEnv().GA_SITE_PROPERTY_ID || cfg.propertyId;
  if (!sa) return zeroResult(cfg.label, "Analytics isn't connected yet.");
  if (!propertyId) return zeroResult(cfg.label, "Analytics property isn't set yet.");
  try {
    return await fetchGaResult({ sa, propertyId, label: cfg.label });
  } catch (e) {
    console.error("[analytics] site GA fetch failed:", e);
    return zeroResult(cfg.label, "Couldn't load analytics right now.");
  }
}

async function buildProjectData(id: string): Promise<AnalyticsResult | null> {
  const entry = appConfig.analytics.projects.find((p) => p.id === id);
  if (!entry) return null;

  if (entry.source === "posthog") {
    const apiKey = getServerEnv().POSTHOG_PERSONAL_API_KEY;
    // Not connected yet: hide the section rather than show a block of zeros.
    if (!apiKey || !entry.projectId) return null;
    try {
      return await fetchPosthogResult({ apiKey, projectId: entry.projectId, region: entry.host, label: entry.label });
    } catch (e) {
      console.error(`[analytics] project ${id} PostHog fetch failed:`, e);
      return zeroResult(entry.label, "Couldn't load analytics right now.", "posthog");
    }
  }

  const sa = serviceAccount();
  if (!sa || !entry.propertyId) return null;
  try {
    return await fetchGaResult({ sa, propertyId: entry.propertyId, label: entry.label });
  } catch (e) {
    console.error(`[analytics] project ${id} GA fetch failed:`, e);
    return zeroResult(entry.label, "Couldn't load analytics right now.");
  }
}

// Failed fetches return ok=false and stay out of the shared cache, so the next request retries.
const fetchSiteData = edgeMemo("analytics-site", buildSiteData, REVALIDATE, (r) => r.ok);

// Label applied after caching so multiple domains share one cached GA fetch.
export async function getSiteResult(label: string): Promise<AnalyticsResult> {
  const data = await fetchSiteData();
  const ranges = Object.fromEntries(Object.entries(data.ranges).map(([k, s]) => [k, { ...s, label }])) as Record<
    RangeKey,
    AnalyticsSnapshot
  >;
  return { ...data, label, ranges };
}

export const getProjectResult = edgeMemo("analytics-project", buildProjectData, REVALIDATE, (r) => r?.ok === true);

export function computeGrowth(current: number, previous: number): Growth {
  if (!previous) return { delta: current, percent: current ? 100 : 0, trend: current > 0 ? 1 : 0 };
  const delta = current - previous;
  return { delta, percent: (delta / previous) * 100, trend: delta > 0 ? 1 : delta < 0 ? -1 : 0 };
}
