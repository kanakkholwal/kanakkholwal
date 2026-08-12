/**
 * Chart series colour by index, cycling the eight CVD-checked tokens.
 *
 * Listed, not interpolated. `var(--chart-${i + 1})` walks straight past the last
 * defined token — with eight tokens, a ninth series asks for `var(--chart-9)`,
 * which resolves to nothing and draws with no colour at all. A literal list is
 * also what the token audit can see.
 */
export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
] as const;

export function chartColor(index: number) {
  return CHART_COLORS[index % CHART_COLORS.length];
}
