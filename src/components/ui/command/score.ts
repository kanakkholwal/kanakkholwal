export function rankCommandMatch(base: number, value: string, search: string): number {
  if (base <= 0) return 0;
  const query = search.trim().toLowerCase();
  if (!query) return base;
  const name = value.trim().toLowerCase();
  if (name === query) return 2;
  if (name.startsWith(query)) return 1 + base / 2;
  return base;
}
