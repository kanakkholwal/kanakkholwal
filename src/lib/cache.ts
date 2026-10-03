/**
 * Isolate-local TTL memo keyed by the JSON of the arguments; stands in for Next's data cache.
 * A rejected call is never stored, so the next request retries.
 */
export function memo<A extends unknown[], R>(fn: (...args: A) => Promise<R>, ttlSeconds = 3600) {
  const store = new Map<string, { value: R; expires: number }>();
  return async (...args: A): Promise<R> => {
    const key = JSON.stringify(args);
    const hit = store.get(key);
    if (hit && hit.expires > Date.now()) return hit.value;
    const value = await fn(...args);
    store.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
    return value;
  };
}

type EdgeCaches = CacheStorage & { default?: Cache };

/** The Worker's data-centre cache; undefined outside Workers (and a no-op on workers.dev). */
function edgeCache(): Cache | undefined {
  return typeof caches === "undefined" ? undefined : (caches as EdgeCaches).default;
}

// A result `keep` rejects (a failure, a missing key) is held this long, so a fix shows up quickly.
const RETRY_SECONDS = 60;

/**
 * `memo` backed by the Cache API, so one result serves every isolate in a data centre and a cold
 * isolate costs one cache read instead of the whole fan-out. `keep` vetoes caching partial results.
 */
export function edgeMemo<A extends unknown[], R>(
  name: string,
  fn: (...args: A) => Promise<R>,
  ttlSeconds = 3600,
  keep: (value: R) => boolean = () => true,
) {
  const local = new Map<string, { value: R; expires: number }>();
  return async (...args: A): Promise<R> => {
    const id = JSON.stringify(args);
    const held = local.get(id);
    if (held && held.expires > Date.now()) return held.value;

    const cache = edgeCache();
    const key = new Request(`https://edge-memo.internal/${name}/${encodeURIComponent(id)}`);
    const hit = await cache?.match(key).catch(() => undefined);
    if (hit) {
      const value = (await hit.json()) as R;
      local.set(id, { value, expires: Date.now() + ttlSeconds * 1000 });
      return value;
    }

    const value = await fn(...args);
    const good = keep(value);
    local.set(id, { value, expires: Date.now() + (good ? ttlSeconds : RETRY_SECONDS) * 1000 });
    if (cache && good) {
      const body = new Response(JSON.stringify(value), {
        headers: { "content-type": "application/json", "cache-control": `public, max-age=${ttlSeconds}` },
      });
      await cache.put(key, body).catch(() => {});
    }
    return value;
  };
}
