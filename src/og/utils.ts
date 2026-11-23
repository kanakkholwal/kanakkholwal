export async function getRemoteImageAsBase64(url: string) {
  try {
    // 1. Fetch the image
    const res = await fetch(url, {
      headers: {
        // Some CDNs (like GitHub) require a User-Agent
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);

    // 2. Convert to Buffer -> Base64
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const base64 = Buffer.from(buffer).toString("base64");

    // 3. Return the Data URL
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("Error fetching remote image:", error);
    return null;
  }
}

const LOGO_TIMEOUT_MS = 4000;
const SVG_OR_PNG = /\.(svg|png)(\?|$)/i;

async function fetchImageDataUri(url: string) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(LOGO_TIMEOUT_MS) });
    const type = res.headers.get("content-type")?.split(";")[0].trim() ?? "";
    // Decision (code): the renderer paints .ico as blank, so only SVG/PNG/JPEG/WebP count as a logo.
    if (!res.ok || !/^image\/(svg\+xml|png|jpeg|webp)$/.test(type)) return null;
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

/** `<link rel="icon|apple-touch-icon">` hrefs from a page, vector and PNG first; .ico is dropped later. */
async function iconLinks(origin: string) {
  try {
    const res = await fetch(origin, { signal: AbortSignal.timeout(LOGO_TIMEOUT_MS) });
    if (!res.ok) return [];
    const html = await res.text();
    const hrefs = [...html.matchAll(/<link\b[^>]*>/gi)]
      .map((m) => m[0])
      .filter((tag) => /rel=["'][^"']*icon[^"']*["']/i.test(tag))
      .map((tag) => /href=["']([^"']+)["']/i.exec(tag)?.[1])
      .filter((h): h is string => !!h)
      .map((h) => new URL(h, origin).href);
    return hrefs.toSorted((a, b) => Number(SVG_OR_PNG.test(b)) - Number(SVG_OR_PNG.test(a)));
  } catch {
    return [];
  }
}

/**
 * Logo as a data URI for a project card: explicit `logo`, then the site's declared icons,
 * then common favicon paths. Null means the caller should draw its fallback icon.
 */
export async function resolveProjectLogo(logo?: string, href?: string) {
  const candidates: string[] = logo ? [logo] : [];
  if (href) {
    try {
      const { origin } = new URL(href);
      // A GitHub repo URL has no favicon of its own; skip discovery there.
      if (!/(^|\.)github\.com$/.test(new URL(href).hostname)) {
        candidates.push(...(await iconLinks(origin)), `${origin}/favicon.svg`, `${origin}/apple-touch-icon.png`);
      }
    } catch {}
  }
  for (const url of new Set(candidates)) {
    const data = await fetchImageDataUri(url);
    if (data) return data;
  }
  return null;
}

/** First-letter mark for projects whose site exposes no usable icon. */
export function monogram(title: string, dark = false) {
  const letter = (title.trim()[0] ?? "?").toUpperCase().replace(/[<>&"']/g, "");
  const [bg, fg] = dark ? ["#fafafa", "#18181b"] : ["#18181b", "#fafafa"];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="22" fill="${bg}"/><text x="48" y="66" text-anchor="middle" font-family="Geist" font-weight="600" font-size="56" fill="${fg}">${letter}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
