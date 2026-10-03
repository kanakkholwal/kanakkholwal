import { tv, type VariantProps } from "tailwind-variants";

export const npmStats = tv({
  slots: {
    root: "flex min-w-0 flex-col",
    head: "flex flex-wrap items-start justify-between gap-x-8 gap-y-4 px-6 pt-6 md:px-8 md:pt-8",
    eyebrow: "font-medium text-muted-foreground text-xs",
    hero: "mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1",
    heroValue: "font-heading font-semibold text-5xl text-foreground tabular-nums tracking-tight",
    heroUnit: "text-muted-foreground text-sm",
    trendRow: "mt-2.5 flex flex-wrap items-center gap-1.5",
    trend: "gap-1 font-medium tabular-nums [&_svg]:size-3",
    compare: "text-muted-foreground text-xs",
    facts: "mt-6 grid grid-cols-2 gap-x-8 gap-y-4 px-6 sm:flex sm:flex-wrap md:px-8",
    fact: "flex min-w-0 flex-col gap-0.5",
    factLabel: "text-muted-foreground text-xs",
    factValue: "truncate font-medium text-foreground text-sm tabular-nums",
    factNote: "font-normal text-muted-foreground",
    chart: "min-w-0 px-5 pt-4 pb-6 md:px-7",
    // A 1px gap over a border-coloured grid draws every divider, with no doubled edges.
    counts: "grid grid-cols-3 gap-px border-border border-t bg-border",
    count: "flex min-w-0 flex-col gap-1 bg-background px-6 py-5 md:px-8",
    countValue: "font-heading font-semibold text-2xl text-foreground tabular-nums tracking-tight",
    countLabel: "text-muted-foreground text-xs",
    footer: "flex min-w-0 flex-col gap-4 border-border border-t px-6 py-6 md:px-8",
    sectionTitle: "font-medium text-muted-foreground text-xs",
    shareBar: "flex h-2.5 w-full gap-[2px] overflow-hidden rounded-full",
    // flex-grow, not width, so a range switch glides without measuring anything.
    shareSegment:
      "h-full min-w-[3px] transition-[flex-grow] duration-300 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
    list: "flex flex-col divide-y divide-border",
    row: [
      "grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-4 py-2.5",
      "sm:grid-cols-[minmax(0,1fr)_3rem_6rem_4.5rem_4.75rem]",
    ],
    rowName: "flex min-w-0 items-center gap-2 font-mono text-foreground text-sm",
    rowSwatch: "size-2 shrink-0 rounded-full",
    rowShare: "hidden text-end text-muted-foreground text-xs tabular-nums sm:block",
    spark: "hidden h-6 w-24 text-[var(--chart-1)] sm:block",
    rowTotal: "text-end font-medium text-foreground text-sm tabular-nums",
    rowTrend: "justify-self-end",
  },
  variants: {
    /**
     * `default`: the range total and its trend, the facts behind it, the chart, counts and packages.
     * `compact`: the total, two facts and the chart for a sidebar. `minimal`: no chrome.
     */
    variant: {
      default: { root: "rounded-2xl border border-border bg-background" },
      compact: {
        root: "rounded-2xl border border-border bg-background",
        head: "px-5 pt-5 md:px-5 md:pt-5",
        heroValue: "text-4xl",
        facts: "mt-4 px-5 md:px-5 [&>*:nth-child(n+3)]:hidden",
        chart: "px-4 pt-3 pb-5 md:px-4",
        count: "px-5 py-4 md:px-5",
        countValue: "text-xl",
      },
      minimal: {
        head: "px-0 pt-0 md:px-0 md:pt-0",
        heroValue: "font-medium font-mono text-4xl tracking-tighter",
        facts: "px-0 md:px-0",
        factLabel: "font-mono uppercase tracking-widest",
        factValue: "font-mono",
        chart: "px-0 md:px-0",
        counts: "flex flex-wrap gap-x-8 gap-y-2 border-dashed bg-transparent pt-4",
        count: "flex-row items-baseline gap-2 bg-transparent p-0 md:p-0",
        countValue: "font-medium font-mono text-sm tracking-normal",
        countLabel: "font-mono",
        footer: "border-dashed px-0 md:px-0",
        shareBar: "hidden",
        sectionTitle: "font-mono uppercase tracking-widest",
      },
    },
    /** Which window the hero, facts, chart and packages show. */
    range: {
      "30d": {},
      "90d": {},
    },
  },
  defaultVariants: { variant: "default", range: "30d" },
});

export type NpmStatsVariant = NonNullable<VariantProps<typeof npmStats>["variant"]>;
export type NpmStatsRange = NonNullable<VariantProps<typeof npmStats>["range"]>;

/** Non-class differences per variant. */
export const NPM_STATS_LAYOUT: Record<NpmStatsVariant, { grid: boolean; packages: boolean; animate: boolean }> = {
  default: { grid: true, packages: true, animate: true },
  compact: { grid: false, packages: false, animate: true },
  minimal: { grid: false, packages: true, animate: false },
};

/** Package `index` of `count` as one hue in falling strength, so a package keeps its shade. */
export function packageFill(index: number, count: number): string {
  const strength = count < 2 ? 100 : Math.round(100 - (index / (count - 1)) * 72);
  return strength >= 100 ? "var(--chart-1)" : `color-mix(in oklch, var(--chart-1) ${strength}%, var(--card))`;
}
