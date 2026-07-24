import { unstable_cache } from "next/cache";
import { appConfig } from "root/project.config";
import fallbackData from "~/data/analytics.json";
import { fetchGaSnapshot, type ServiceAccount } from "./ga";
import type { AnalyticsFile, AnalyticsSnapshot, Growth } from "./types";

const REVALIDATE = 3600; // 1h — GA data isn't real-time
const fallback = fallbackData as AnalyticsFile;

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

async function buildSite(): Promise<AnalyticsSnapshot> {
  const sa = serviceAccount();
  const cfg = appConfig.analytics.site;
  const propertyId = process.env.GA_SITE_PROPERTY_ID || cfg.propertyId;
  if (sa && propertyId) {
    try {
      return await fetchGaSnapshot({ sa, propertyId, label: cfg.label });
    } catch (e) {
      console.error("[analytics] site GA fetch failed, using fallback:", e);
    }
  }
  return { ...fallback.site, label: cfg.label };
}

async function buildProject(id: string): Promise<AnalyticsSnapshot | null> {
  const sa = serviceAccount();
  const entry = appConfig.analytics.projects.find((p) => p.id === id);
  if (sa && entry && entry.source === "ga" && entry.propertyId) {
    try {
      return await fetchGaSnapshot({ sa, propertyId: entry.propertyId, label: entry.label });
    } catch (e) {
      console.error(`[analytics] project ${id} GA fetch failed, using fallback:`, e);
    }
  }
  return fallback.projects?.[id] ?? null;
}

export const getSiteSnapshot = unstable_cache(buildSite, ["analytics", "site"], {
  revalidate: REVALIDATE,
  tags: ["analytics:site"],
});

export function getProjectSnapshot(id: string): Promise<AnalyticsSnapshot | null> {
  return unstable_cache(() => buildProject(id), ["analytics", "project", id], {
    revalidate: REVALIDATE,
    tags: [`analytics:project:${id}`],
  })();
}

export function computeGrowth(current: number, previous: number): Growth {
  if (!previous) return { delta: current, percent: current ? 100 : 0, trend: current > 0 ? 1 : 0 };
  const delta = current - previous;
  return { delta, percent: (delta / previous) * 100, trend: delta > 0 ? 1 : delta < 0 ? -1 : 0 };
}
