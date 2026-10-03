import "@tanstack/react-start/server-only";
import {
  type AnalyticsBreakdownItem,
  type AnalyticsResult,
  type AnalyticsSnapshot,
  RANGES,
  type RangeKey,
} from "./types";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const GA_BASE = "https://analyticsdata.googleapis.com/v1beta";

export type ServiceAccount = { client_email: string; private_key: string };

function base64Url(bytes: Uint8Array) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const encJson = (o: unknown) => base64Url(new TextEncoder().encode(JSON.stringify(o)));

async function importPrivateKey(pem: string) {
  const body = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    der.buffer as ArrayBuffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

// Mints a GA read token by signing a JWT with the service account key (edge-safe).
async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const signingInput = `${encJson({ alg: "RS256", typ: "JWT" })}.${encJson({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  })}`;
  const key = await importPrivateKey(sa.private_key);
  const sig = new Uint8Array(
    await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(signingInput)),
  );
  const jwt = `${signingInput}.${base64Url(sig)}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`GA token ${res.status}: ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

type GaRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
type GaReport = { rows?: GaRow[]; metadata?: { timeZone?: string } };
type ReportRequest = Record<string, unknown>;

// GA4 accepts at most five reports per batchRunReports call.
const BATCH = 5;

async function batchReports(token: string, propertyId: string, requests: ReportRequest[]): Promise<GaReport[]> {
  const chunks = Array.from({ length: Math.ceil(requests.length / BATCH) }, (_, i) =>
    requests.slice(i * BATCH, (i + 1) * BATCH),
  );
  const results = await Promise.all(
    chunks.map(async (chunk) => {
      const res = await fetch(`${GA_BASE}/properties/${propertyId}:batchRunReports`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ requests: chunk }),
      });
      if (!res.ok) throw new Error(`GA batchRunReports ${res.status}: ${await res.text()}`);
      return ((await res.json()) as { reports?: GaReport[] }).reports ?? [];
    }),
  );
  return results.flat();
}

const TOTAL_METRICS = ["activeUsers", "screenPageViews", "sessions", "averageSessionDuration", "bounceRate"].map(
  (name) => ({ name }),
);

const DIMENSIONS = [
  { key: "topPages", name: "pagePath", size: 5 },
  { key: "topCountries", name: "country", size: 5 },
  { key: "topReferrers", name: "sessionDefaultChannelGroup", size: 5 },
  { key: "devices", name: "deviceCategory", size: 3 },
] as const;

const ymd = (d: string) => `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

function toTotals(row: GaRow | undefined): AnalyticsSnapshot["totals"] {
  const m = row?.metricValues ?? [];
  return {
    users: +(m[0]?.value ?? 0),
    pageViews: +(m[1]?.value ?? 0),
    sessions: +(m[2]?.value ?? 0),
    avgEngagementSeconds: Math.round(+(m[3]?.value ?? 0)),
    bounceRate: +(+(m[4]?.value ?? 0)).toFixed(3),
  };
}

const dimensionRequests = (dateRanges: unknown[], dimensionFilter?: unknown) =>
  DIMENSIONS.map((d) => ({
    dateRanges,
    dimensions: [{ name: d.name }],
    metrics: [{ name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    limit: d.size,
    ...(dimensionFilter ? { dimensionFilter } : {}),
  }));

function toLists(reports: GaReport[]) {
  return Object.fromEntries(
    DIMENSIONS.map((d, i) => [
      d.key,
      (reports[i]?.rows ?? []).map((row) => ({
        label: row.dimensionValues?.[0]?.value || "(unknown)",
        value: +(row.metricValues?.[0]?.value ?? 0),
      })),
    ]),
  ) as Record<(typeof DIMENSIONS)[number]["key"], AnalyticsBreakdownItem[]>;
}

/** "2026100413" in `timeZone`, for the hour `hoursAgo` before now. */
function dateHour(timeZone: string, hoursAgo: number) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(Date.now() - hoursAgo * 3_600_000));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}${get("month")}${get("day")}${get("hour")}`;
}

const hourKey = (dh: string) => `${dh.slice(0, 4)}-${dh.slice(4, 6)}-${dh.slice(6, 8)}T${dh.slice(8, 10)}:00`;

/**
 * Every range in a handful of batched calls. Day ranges are whole days ending yesterday. The 24h range
 * needs the property's timezone (read from the first batch) to pick the last 24 hourly buckets.
 */
async function fetchSnapshots(token: string, propertyId: string, label: string): Promise<AnalyticsSnapshot[]> {
  const dayRanges = RANGES.filter((r) => !r.hours);
  const longest = Math.max(...dayRanges.map((r) => r.days));
  const requests: ReportRequest[] = [
    {
      dateRanges: [{ startDate: `${longest}daysAgo`, endDate: "yesterday" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }, { name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      keepEmptyRows: true,
    },
    {
      dateRanges: [{ startDate: "2daysAgo", endDate: "today" }],
      dimensions: [{ name: "dateHour" }],
      metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }, { name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: "dateHour" } }],
      keepEmptyRows: true,
    },
    ...dayRanges.map((r) => ({
      // Two named ranges in one report: GA answers with a row per range.
      dateRanges: [
        { startDate: `${r.days}daysAgo`, endDate: "yesterday", name: "current" },
        { startDate: `${r.days * 2}daysAgo`, endDate: `${r.days + 1}daysAgo`, name: "previous" },
      ],
      metrics: TOTAL_METRICS,
    })),
    ...dayRanges.flatMap((r) => dimensionRequests([{ startDate: `${r.days}daysAgo`, endDate: "yesterday" }])),
  ];
  const [daily, hourly, ...rest] = await batchReports(token, propertyId, requests);
  const totalsReports = rest.slice(0, dayRanges.length);
  const dimReports = rest.slice(dayRanges.length);

  // Last 24 complete hours and the 24 before them, as GA's own dateHour keys.
  const tz = hourly?.metadata?.timeZone ?? "UTC";
  const current = Array.from({ length: 24 }, (_, i) => dateHour(tz, 24 - i));
  const previous = Array.from({ length: 24 }, (_, i) => dateHour(tz, 48 - i));
  const inHours = (values: string[]) => ({ filter: { fieldName: "dateHour", inListFilter: { values } } });
  const span48 = [{ startDate: "3daysAgo", endDate: "today" }];
  const [now24, prev24, ...dims24] = await batchReports(token, propertyId, [
    { dateRanges: span48, metrics: TOTAL_METRICS, dimensionFilter: inHours(current) },
    { dateRanges: span48, metrics: TOTAL_METRICS, dimensionFilter: inHours(previous) },
    ...dimensionRequests(span48, inHours(current)),
  ]);

  const series = (daily?.rows ?? []).map((row) => ({
    date: ymd(row.dimensionValues?.[0]?.value ?? ""),
    users: +(row.metricValues?.[0]?.value ?? 0),
    pageViews: +(row.metricValues?.[1]?.value ?? 0),
    sessions: +(row.metricValues?.[2]?.value ?? 0),
  }));
  const hourRows = new Map((hourly?.rows ?? []).map((row) => [row.dimensionValues?.[0]?.value ?? "", row]));
  const hours = current.map((dh) => {
    const m = hourRows.get(dh)?.metricValues ?? [];
    return { date: hourKey(dh), users: +(m[0]?.value ?? 0), pageViews: +(m[1]?.value ?? 0), sessions: +(m[2]?.value ?? 0) };
  });

  const generatedAt = new Date().toISOString();
  return RANGES.map((r): AnalyticsSnapshot => {
    if (r.hours) {
      return {
        source: "ga",
        live: true,
        label,
        propertyId,
        range: { start: hours[0].date, end: hours.at(-1)?.date ?? "", days: r.days, hourly: true },
        totals: toTotals(now24?.rows?.[0]),
        previousTotals: toTotals(prev24?.rows?.[0]),
        series: hours,
        ...toLists(dims24),
        generatedAt,
      };
    }
    const di = dayRanges.indexOf(r);
    const totalsRows = totalsReports[di]?.rows ?? [];
    const byRange = (name: string) => totalsRows.find((row) => row.dimensionValues?.[0]?.value === name);
    const points = series.filter((p) => p.date >= daysAgo(r.days));
    return {
      source: "ga",
      live: true,
      label,
      propertyId,
      range: { start: points[0]?.date ?? "", end: points.at(-1)?.date ?? "", days: r.days },
      totals: toTotals(byRange("current")),
      previousTotals: toTotals(byRange("previous")),
      series: points,
      ...toLists(dimReports.slice(di * DIMENSIONS.length, (di + 1) * DIMENSIONS.length)),
      generatedAt,
    };
  });
}

/** Every selectable range from one minted token and three batched report calls. */
export async function fetchGaResult({
  sa,
  propertyId,
  label,
}: {
  sa: ServiceAccount;
  propertyId: string;
  label: string;
}): Promise<AnalyticsResult> {
  const token = await getAccessToken(sa);
  const snapshots = await fetchSnapshots(token, propertyId, label);
  const ranges = Object.fromEntries(RANGES.map((r, i) => [r.key, snapshots[i]])) as Record<RangeKey, AnalyticsSnapshot>;
  return { ok: true, error: null, label, source: "ga", ranges, generatedAt: new Date().toISOString() };
}
