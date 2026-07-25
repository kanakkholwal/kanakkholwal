import { unstable_cache } from "next/cache";
import { appConfig } from "root/project.config";
import { fetchGaResult, type ServiceAccount } from "./ga";
import {
  RANGES,
  type AnalyticsResult,
  type AnalyticsSnapshot,
  type AnalyticsTotals,
  type Growth,
  type RangeKey,
} from "./types";

const REVALIDATE = 3600; // 1h; GA data isn't real-time

function serviceAccount(): ServiceAccount | null {
  const raw = process.env.GA_SERVICE_ACCOUNT_KEY;
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

function zeroSnapshot(days: number, label: string): AnalyticsSnapshot {
  return {
    source: "ga",
    live: false,
    label,
    propertyId: null,
    range: { start: "", end: "", days },
    totals: zeroTotals(),
    previousTotals: zeroTotals(),
    series: Array.from({ length: days }, () => ({ date: "", users: 0, pageViews: 0, sessions: 0 })),
    topPages: [],
    topCountries: [],
    topReferrers: [],
    devices: [],
    generatedAt: "",
  };
}

function zeroResult(label: string, error: string): AnalyticsResult {
  const ranges = Object.fromEntries(
    RANGES.map((r) => [r.key, zeroSnapshot(r.days, label)]),
  ) as Record<RangeKey, AnalyticsSnapshot>;
  return { ok: false, error, label, source: "ga", ranges, generatedAt: "" };
}

async function buildSiteData(): Promise<AnalyticsResult> {
  const sa = serviceAccount();
  const cfg = appConfig.analytics.site;
  const propertyId = process.env.GA_SITE_PROPERTY_ID || cfg.propertyId;
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
  const sa = serviceAccount();
  const entry = appConfig.analytics.projects.find((p) => p.id === id);
  if (!entry || entry.source !== "ga") return null;
  if (!sa || !entry.propertyId) return null;
  try {
    return await fetchGaResult({ sa, propertyId: entry.propertyId, label: entry.label });
  } catch (e) {
    console.error(`[analytics] project ${id} GA fetch failed:`, e);
    return zeroResult(entry.label, "Couldn't load analytics right now.");
  }
}

const fetchSiteData = unstable_cache(buildSiteData, ["analytics", "site", "v2"], {
  revalidate: REVALIDATE,
  tags: ["analytics:site"],
});

// Label applied after caching so multiple domains share one cached GA fetch.
export async function getSiteResult(label: string): Promise<AnalyticsResult> {
  const data = await fetchSiteData();
  const ranges = Object.fromEntries(
    Object.entries(data.ranges).map(([k, s]) => [k, { ...s, label }]),
  ) as Record<RangeKey, AnalyticsSnapshot>;
  return { ...data, label, ranges };
}

export function getProjectResult(id: string): Promise<AnalyticsResult | null> {
  return unstable_cache(() => buildProjectData(id), ["analytics", "project", "v2", id], {
    revalidate: REVALIDATE,
    tags: [`analytics:project:${id}`],
  })();
}

export function computeGrowth(current: number, previous: number): Growth {
  if (!previous) return { delta: current, percent: current ? 100 : 0, trend: current > 0 ? 1 : 0 };
  const delta = current - previous;
  return { delta, percent: (delta / previous) * 100, trend: delta > 0 ? 1 : delta < 0 ? -1 : 0 };
}
