import {
  RANGES,
  type AnalyticsBreakdownItem,
  type AnalyticsResult,
  type AnalyticsSnapshot,
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

type GaRow = { dimensionValues: { value: string }[]; metricValues: { value: string }[] };

async function runReport(token: string, propertyId: string, body: Record<string, unknown>) {
  const res = await fetch(`${GA_BASE}/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GA runReport ${res.status}: ${await res.text()}`);
  return (await res.json()) as { rows?: GaRow[] };
}

async function snapshotForRange(
  token: string,
  propertyId: string,
  label: string,
  days: number,
): Promise<AnalyticsSnapshot> {
  const ts = await runReport(token, propertyId, {
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "yesterday" }],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }, { name: "sessions" }],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });
  const series = (ts.rows || []).map((r) => {
    const d = r.dimensionValues[0].value;
    return {
      date: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`,
      users: +r.metricValues[0].value,
      pageViews: +r.metricValues[1].value,
      sessions: +r.metricValues[2].value,
    };
  });

  const totalsFor = async (range: { startDate: string; endDate: string }) => {
    const rep = await runReport(token, propertyId, {
      dateRanges: [range],
      metrics: [
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "sessions" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
      ],
    });
    const m = rep.rows?.[0]?.metricValues || [];
    return {
      users: +(m[0]?.value ?? 0),
      pageViews: +(m[1]?.value ?? 0),
      sessions: +(m[2]?.value ?? 0),
      avgEngagementSeconds: Math.round(+(m[3]?.value ?? 0)),
      bounceRate: +(+(m[4]?.value ?? 0)).toFixed(3),
    };
  };

  const dim = async (name: string, size = 5): Promise<AnalyticsBreakdownItem[]> => {
    const rep = await runReport(token, propertyId, {
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "yesterday" }],
      dimensions: [{ name }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: size,
    });
    return (rep.rows || []).map((r) => ({
      label: r.dimensionValues[0].value || "(unknown)",
      value: +r.metricValues[0].value,
    }));
  };

  const [totals, previousTotals, topPages, topCountries, topReferrers, devices] = await Promise.all([
    totalsFor({ startDate: `${days}daysAgo`, endDate: "yesterday" }),
    totalsFor({ startDate: `${days * 2}daysAgo`, endDate: `${days + 1}daysAgo` }),
    dim("pagePath"),
    dim("country"),
    dim("sessionDefaultChannelGroup"),
    dim("deviceCategory", 3),
  ]);

  return {
    source: "ga",
    live: true,
    label,
    propertyId,
    range: { start: series[0]?.date ?? "", end: series.at(-1)?.date ?? "", days },
    totals,
    previousTotals,
    series,
    topPages,
    topCountries,
    topReferrers,
    devices,
    generatedAt: new Date().toISOString(),
  };
}

// Fetches every selectable range with a single minted token.
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
  const snapshots = await Promise.all(
    RANGES.map((r) => snapshotForRange(token, propertyId, label, r.days)),
  );
  const ranges = Object.fromEntries(
    RANGES.map((r, i) => [r.key, snapshots[i]]),
  ) as Record<RangeKey, AnalyticsSnapshot>;

  return {
    ok: true,
    error: null,
    label,
    source: "ga",
    ranges,
    generatedAt: new Date().toISOString(),
  };
}
