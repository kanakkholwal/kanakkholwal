import "@tanstack/react-start/server-only";
import {
  type AnalyticsBreakdownItem,
  type AnalyticsPoint,
  type AnalyticsResult,
  type AnalyticsSnapshot,
  type AnalyticsTotals,
  RANGES,
  type RangeKey,
} from "./types";

export type PosthogRegion = "us" | "eu";

// The private API lives on the app host, not the `*.i.posthog.com` ingestion host.
const API_HOST: Record<PosthogRegion, string> = {
  us: "https://us.posthog.com",
  eu: "https://eu.posthog.com",
};

type Cell = string | number | boolean | null;

type Query = (sql: string) => Promise<Cell[][]>;

function client(apiKey: string, projectId: string, region: PosthogRegion): Query {
  return async (sql) => {
    const res = await fetch(`${API_HOST[region]}/api/projects/${projectId}/query/`, {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ query: { kind: "HogQLQuery", query: sql } }),
    });
    if (!res.ok) throw new Error(`PostHog query ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return ((await res.json()) as { results?: Cell[][] }).results ?? [];
  };
}

const num = (v: Cell | undefined) => (typeof v === "number" ? v : Number(v ?? 0)) || 0;
const day = (offset: number) => new Date(Date.now() - offset * 86_400_000).toISOString().slice(0, 10);

// HogQL strings are single-quoted; event names come from config, but escape anyway.
const quote = (s: string) => `'${s.replaceAll("\\", "\\\\").replaceAll("'", "\\'")}'`;

/** Daily series for the longest range; shorter ranges slice it, filling days with no events. */
async function series(q: Query, event: string, days: number): Promise<Map<string, AnalyticsPoint>> {
  const rows = await q(`
    SELECT toString(toDate(timestamp)) AS day, uniq(distinct_id), count(), uniq(properties.$session_id)
    FROM events
    WHERE event = ${quote(event)} AND toDate(timestamp) >= today() - ${days} AND toDate(timestamp) < today()
    GROUP BY day ORDER BY day`);
  return new Map(
    rows.map((r) => [
      String(r[0]),
      { date: String(r[0]), users: num(r[1]), pageViews: num(r[2]), sessions: num(r[3]) },
    ]),
  );
}

const inRange = (col: string, from: number, to: number) =>
  `toDate(${col}) >= today() - ${from} AND toDate(${col}) < today() - ${to}`;

/** Current and previous totals for every range: one events query, one sessions query. */
async function totals(q: Query, event: string): Promise<[AnalyticsTotals, AnalyticsTotals][]> {
  const longest = Math.max(...RANGES.map((r) => r.days)) * 2;
  const windows = RANGES.flatMap((r) => [
    [r.days, 0],
    [r.days * 2, r.days],
  ]);
  const [ev = []] = await q(`
    SELECT ${windows
      .map(([from, to]) => {
        const w = inRange("timestamp", from, to);
        return `uniqIf(distinct_id, ${w}), countIf(${w}), uniqIf(properties.$session_id, ${w})`;
      })
      .join(", ")}
    FROM events
    WHERE event = ${quote(event)} AND toDate(timestamp) >= today() - ${longest} AND toDate(timestamp) < today()`);
  // Session length and bounce live in the sessions table; a project without it keeps zeros.
  const [se = []] = await q(`
    SELECT ${windows
      .map(([from, to]) => {
        const w = inRange("$start_timestamp", from, to);
        return `avgIf($session_duration, ${w}), avgIf(toFloat($is_bounce), ${w})`;
      })
      .join(", ")}
    FROM sessions
    WHERE toDate($start_timestamp) >= today() - ${longest} AND toDate($start_timestamp) < today()`).catch(() => []);

  const make = (w: number): AnalyticsTotals => ({
    users: num(ev[w * 3]),
    pageViews: num(ev[w * 3 + 1]),
    sessions: num(ev[w * 3 + 2]),
    avgEngagementSeconds: Math.round(num(se[w * 2])),
    bounceRate: +num(se[w * 2 + 1]).toFixed(3),
  });
  return RANGES.map((_, i) => [make(i * 2), make(i * 2 + 1)]);
}

const BREAKDOWNS = [
  { kind: "page", expr: "properties.$pathname", size: 5 },
  { kind: "country", expr: "properties.$geoip_country_name", size: 5 },
  { kind: "referrer", expr: "properties.$referring_domain", size: 5 },
  { kind: "device", expr: "properties.$device_type", size: 3 },
] as const;

type Lists = Pick<AnalyticsSnapshot, "topPages" | "topCountries" | "topReferrers" | "devices">;

/** Every top-N list for every range in one round trip. */
async function breakdowns(q: Query, event: string): Promise<Lists[]> {
  const parts = RANGES.flatMap((r) =>
    BREAKDOWNS.map(
      (b) => `SELECT * FROM (
        SELECT '${b.kind}:${r.days}' AS kind, toString(${b.expr}) AS label, uniq(distinct_id) AS value
        FROM events
        WHERE event = ${quote(event)} AND ${inRange("timestamp", r.days, 0)}
        GROUP BY label ORDER BY value DESC LIMIT ${b.size})`,
    ),
  );
  const rows = await q(parts.join(" UNION ALL "));
  return RANGES.map((r) => {
    const pick = (kind: string): AnalyticsBreakdownItem[] =>
      rows
        .filter((row) => row[0] === `${kind}:${r.days}`)
        .map((row) => {
          const label = row[1] ? String(row[1]) : "(unknown)";
          return { label: label === "$direct" ? "Direct" : label, value: num(row[2]) };
        });
    return {
      topPages: pick("page"),
      topCountries: pick("country"),
      topReferrers: pick("referrer"),
      devices: pick("device"),
    };
  });
}

/** Same shape as the GA provider, so every analytics view renders PostHog data unchanged. */
export async function fetchPosthogResult({
  apiKey,
  projectId,
  region,
  label,
  event = "$pageview",
}: {
  apiKey: string;
  projectId: string;
  region: PosthogRegion;
  label: string;
  event?: string;
}): Promise<AnalyticsResult> {
  const q = client(apiKey, projectId, region);
  const longest = Math.max(...RANGES.map((r) => r.days));
  const [daily, allTotals, allLists] = await Promise.all([
    series(q, event, longest),
    totals(q, event),
    breakdowns(q, event),
  ]);

  const snapshots = RANGES.map((r, i): AnalyticsSnapshot => {
    const points = Array.from({ length: r.days }, (_, d) => {
      const date = day(r.days - d);
      return daily.get(date) ?? { date, users: 0, pageViews: 0, sessions: 0 };
    });
    const [current, previous] = allTotals[i];
    return {
      source: "posthog",
      live: true,
      label,
      propertyId: projectId,
      range: { start: points[0]?.date ?? "", end: points.at(-1)?.date ?? "", days: r.days },
      totals: current,
      previousTotals: previous,
      series: points,
      ...allLists[i],
      generatedAt: new Date().toISOString(),
    };
  });

  return {
    ok: true,
    error: null,
    label,
    source: "posthog",
    ranges: Object.fromEntries(RANGES.map((r, i) => [r.key, snapshots[i]])) as Record<RangeKey, AnalyticsSnapshot>,
    generatedAt: new Date().toISOString(),
  };
}
