import "@tanstack/react-start/server-only";
import { getRequestUrl, setResponseHeader } from "@tanstack/react-start/server";

/**
 * Lets the browser reuse a server function's response, so revisits and hover preloads don't hit
 * the upstream APIs again. Only the RPC response is marked: during SSR this would stamp the page.
 */
export function cacheResponse(maxAgeSeconds: number, staleSeconds = maxAgeSeconds * 12) {
  if (!getRequestUrl().pathname.startsWith("/_serverFn")) return;
  setResponseHeader("cache-control", `private, max-age=${maxAgeSeconds}, stale-while-revalidate=${staleSeconds}`);
}
