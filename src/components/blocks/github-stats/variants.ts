import { tv, type VariantProps } from "tailwind-variants";
import type { GithubCalendarSize } from "@/components/blocks/github-calendar/variants";
import type { GITHUB_MIX_KEYS } from "./core";

export const githubStats = tv({
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
    controls: "flex flex-wrap items-center gap-2",
    yearTrigger: "h-8 w-auto gap-2 font-mono text-xs tabular-nums",
    insights: "mt-6 grid grid-cols-2 gap-x-8 gap-y-4 px-6 sm:flex sm:flex-wrap md:px-8",
    insight: "flex min-w-0 flex-col gap-0.5",
    insightLabel: "text-muted-foreground text-xs",
    insightValue: "font-medium text-foreground text-sm tabular-nums",
    insightNote: "font-normal text-muted-foreground",
    calendar: "min-w-0 px-6 pt-5 pb-6 md:px-8",
    panel: "card-fade-up mt-0 min-w-0 outline-none",
    // A 1px gap over a border-coloured grid draws every divider, with no doubled edges.
    counts: "grid grid-cols-2 gap-px border-border border-t bg-border sm:grid-cols-4",
    count: "flex min-w-0 flex-col gap-1 bg-background px-6 py-5 md:px-8",
    countValue: "font-heading font-semibold text-2xl text-foreground tabular-nums tracking-tight",
    countLabel: "text-muted-foreground text-xs",
    footer: "grid gap-8 border-border border-t px-6 py-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-12 md:px-8",
    sectionTitle: "font-medium text-muted-foreground text-xs",
    mix: "flex min-w-0 flex-col gap-3",
    mixBar: "flex h-2.5 w-full gap-[2px] overflow-hidden rounded-full",
    mixSegment: "h-full min-w-[3px]",
    mixLegend: "grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2",
    mixItem: "flex min-w-0 items-center gap-2 text-sm",
    mixSwatch: "size-2 shrink-0 rounded-full",
    mixLabel: "truncate text-muted-foreground",
    mixValue: "ml-auto font-medium font-mono text-foreground text-xs tabular-nums",
    where: "flex min-w-0 flex-col gap-3",
    repoList: "flex flex-col gap-1.5",
    repo: [
      "inline-flex min-w-0 max-w-full items-baseline rounded-sm font-mono text-sm outline-none",
      "decoration-border underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring",
    ],
    repoOwner: "shrink-0 text-muted-foreground",
    repoName: "truncate text-foreground",
    more: "w-fit rounded-sm text-muted-foreground text-xs outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
    orgs: "mt-1 flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground text-xs",
    org: "inline-flex items-center gap-1.5 rounded-sm text-foreground text-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring",
    orgAvatar: "size-5 rounded-[5px] text-xs",
  },
  variants: {
    /**
     * `default`: the year's total, its facts, the full calendar, counts and where the work went.
     * `compact`: the total, two facts and a small calendar for a sidebar. `minimal`: no chrome.
     */
    variant: {
      default: { root: "rounded-2xl border border-border bg-background" },
      compact: {
        root: "rounded-2xl border border-border bg-background",
        head: "px-5 pt-5 md:px-5 md:pt-5",
        heroValue: "text-4xl",
        insights: "mt-4 px-5 md:px-5 [&>*:nth-child(n+3)]:hidden",
        calendar: "px-5 pt-4 pb-5 md:px-5",
        counts: "sm:grid-cols-2",
        count: "px-5 py-4 md:px-5",
        countValue: "text-xl",
      },
      minimal: {
        head: "px-0 pt-0 md:px-0 md:pt-0",
        heroValue: "font-medium font-mono text-4xl tracking-tighter",
        insights: "px-0 md:px-0",
        insightLabel: "font-mono uppercase tracking-widest",
        insightValue: "font-mono",
        calendar: "px-0 md:px-0",
        counts: "flex flex-wrap gap-x-8 gap-y-2 border-dashed bg-transparent pt-4 sm:grid-cols-none",
        count: "flex-row items-baseline gap-2 bg-transparent p-0 md:p-0",
        countValue: "font-medium font-mono text-sm tracking-normal",
        countLabel: "font-mono",
      },
    },
  },
  defaultVariants: { variant: "default" },
});

export type GithubStatsVariant = NonNullable<VariantProps<typeof githubStats>["variant"]>;

/** Non-class differences per variant. */
export const GITHUB_STATS_LAYOUT: Record<
  GithubStatsVariant,
  { calendar: GithubCalendarSize; footer: boolean; animate: boolean }
> = {
  default: { calendar: "fluid", footer: true, animate: true },
  compact: { calendar: "sm", footer: false, animate: true },
  minimal: { calendar: "fluid", footer: false, animate: false },
};

/** One hue in falling strengths: identity comes from the labels beside the bar. */
export const GITHUB_MIX_FILL: Record<(typeof GITHUB_MIX_KEYS)[number], string> = {
  commits: "var(--success)",
  pullRequests: "color-mix(in oklch, var(--success) 62%, var(--card))",
  codeReviews: "color-mix(in oklch, var(--success) 38%, var(--card))",
  issues: "color-mix(in oklch, var(--success) 20%, var(--card))",
};
