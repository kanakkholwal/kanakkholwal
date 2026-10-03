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
