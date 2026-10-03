import { tv, type VariantProps } from "tailwind-variants";

export const githubCalendar = tv({
  slots: {
    root: "flex w-full max-w-full flex-col gap-3 text-foreground",
    header: "flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm",
    title: "font-semibold",
    total: "text-muted-foreground tabular-nums",
    scroller: "max-w-full overflow-x-auto p-1",
    grid: "grid w-max",
    month: "w-0 overflow-visible whitespace-nowrap pb-1.5 text-xs text-muted-foreground leading-none",
    weekday: "self-center pr-2 text-xs text-muted-foreground leading-none",
    cell: "github-calendar-cell relative block bg-[var(--cell)] outline-none transition-[scale,box-shadow,background-color] duration-(--duration-base) ease-[var(--ease-out)] hover:z-10 hover:scale-125 motion-reduce:hover:scale-100 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring data-[active]:z-10 data-[active]:ring-2 data-[active]:ring-foreground/70 motion-reduce:transition-none",
    legend: "flex items-center justify-end gap-1 text-muted-foreground text-xs",
    swatch: "block bg-[var(--cell)]",
    tip: "flex items-baseline gap-1 whitespace-nowrap",
    tipCount: "font-semibold tabular-nums",
    tipText: "text-muted-foreground",
  },
  variants: {
    variant: {
      default: {},
      glow: {
        cell: "shadow-[0_0_6px_var(--cell)] data-[level=0]:shadow-none data-[level=4]:shadow-[0_0_12px_var(--cell)]",
      },
      minimal: { cell: "scale-[0.7] hover:scale-100 motion-reduce:hover:scale-[0.7]" },
    },
    shape: {
      square: { cell: "rounded-none", swatch: "rounded-none" },
      rounded: { cell: "rounded-[3px]", swatch: "rounded-[3px]" },
      circle: { cell: "rounded-full", swatch: "rounded-full" },
    },
    size: {
      sm: { cell: "size-2.5", swatch: "size-2.5", grid: "gap-[2px]" },
      md: { cell: "size-3", swatch: "size-3", grid: "gap-[3px]" },
      lg: { cell: "size-4", swatch: "size-4", grid: "gap-1" },
      // Cells share the width; below 10px they hold and the grid scrolls instead.
      fluid: { cell: "aspect-square w-full", swatch: "size-3", grid: "w-full gap-[3px]" },
    },
    tone: {
      scale: {},
      primary: {},
      success: {},
    },
  },
  defaultVariants: { variant: "default", shape: "rounded", size: "md", tone: "scale" },
});

export type GithubCalendarVariant = NonNullable<VariantProps<typeof githubCalendar>["variant"]>;
export type GithubCalendarShape = NonNullable<VariantProps<typeof githubCalendar>["shape"]>;
export type GithubCalendarSize = NonNullable<VariantProps<typeof githubCalendar>["size"]>;
export type GithubCalendarTone = NonNullable<VariantProps<typeof githubCalendar>["tone"]>;

/** Week column track per size; only `fluid` stretches. */
export const WEEK_TRACK: Record<GithubCalendarSize, string> = {
  sm: "auto",
  md: "auto",
  lg: "auto",
  fluid: "minmax(0.625rem, 1fr)",
};

const EMPTY = "color-mix(in oklch, var(--foreground) 7%, transparent)";

/** Fill per level 0 to 4; `scale` matches HeatmapChart's steps. */
export const TONE_FILL: Record<GithubCalendarTone, readonly string[]> = {
  scale: [EMPTY, "var(--chart-scale-2)", "var(--chart-scale-3)", "var(--chart-scale-4)", "var(--chart-scale-5)"],
  primary: [
    EMPTY,
    "color-mix(in oklch, var(--primary) 30%, transparent)",
    "color-mix(in oklch, var(--primary) 55%, transparent)",
    "color-mix(in oklch, var(--primary) 80%, transparent)",
    "var(--primary)",
  ],
  success: [
    EMPTY,
    "color-mix(in oklch, var(--success) 30%, transparent)",
    "color-mix(in oklch, var(--success) 55%, transparent)",
    "color-mix(in oklch, var(--success) 80%, transparent)",
    "var(--success)",
  ],
};
