import { ImageResponse } from "takumi-js/response";
import type { ReactElement } from "react";
import { getFonts } from "./fonts";

export type OgImageOptions = {
  width?: number;
  height?: number;
  headers?: HeadersInit;
};

// Rendered once per URL; let browsers and the CDN keep them for a day.
const OG_CACHE = "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800";

export async function generateOgImage(element: ReactElement, options: OgImageOptions = {}) {
  const fonts = await getFonts();
  return new ImageResponse(element, {
    width: options.width ?? 1200,
    height: options.height ?? 630,
    fonts,
    emoji: "twemoji",
    headers: { "Cache-Control": OG_CACHE, ...options.headers },
  });
}
