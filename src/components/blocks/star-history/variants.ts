import { tv, type VariantProps } from "tailwind-variants";

export const starHistory = tv({
  slots: {
    root: "flex min-w-0 flex-col",
    head: "flex flex-wrap items-start justify-between gap-x-8 gap-y-4 px-6 pt-6 md:px-8 md:pt-8",
    repo: "flex min-w-0 items-center gap-1.5 font-medium text-muted-foreground text-xs",
    repoName: "truncate font-mono",
    repoIcon: "size-3.5 shrink-0 text-warning-strong",
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
    panel: "card-fade-up mt-0 min-w-0 outline-none",
    // A 1px gap over a border-coloured grid draws every divider, with no doubled edges.
    counts: "grid grid-cols-3 gap-px border-border border-t bg-border",
    count: "flex min-w-0 flex-col gap-1 bg-background px-6 py-5 md:px-8",
    countValue: "truncate font-heading font-semibold text-foreground text-xl tabular-nums tracking-tight",
    countLabel: "text-muted-foreground text-xs",
  },
  variants: {
    /**
     * `default`: the total and its trend, milestones, the chart and the history's span.
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
        countValue: "text-base",
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
      },
    },
    /** What the chart draws: the running total, or stars gained per bucket. */
    mode: {
      cumulative: {},
      daily: {},
    },
  },
  defaultVariants: { variant: "default", mode: "cumulative" },
});

export type StarHistoryVariant = NonNullable<VariantProps<typeof starHistory>["variant"]>;
export type StarHistoryMode = NonNullable<VariantProps<typeof starHistory>["mode"]>;

/** Non-class differences per variant. */
export const STAR_HISTORY_LAYOUT: Record<StarHistoryVariant, { grid: boolean; animate: boolean }> = {
  default: { grid: true, animate: true },
  compact: { grid: false, animate: true },
  minimal: { grid: false, animate: false },
};
