import { tv, type VariantProps } from "tailwind-variants";

export const scrollProgress = tv({
  slots: {
    root: "pointer-events-none z-50 select-none",
    track: "relative",
    ticks: "flex h-full flex-col justify-between",
    tick: "block h-px w-full bg-foreground/25",
    fill: "absolute inset-0 [clip-path:inset(0_0_calc(100%-var(--scroll-progress)*1%)_0)]",
    fillTick: "block h-px w-full bg-foreground",
    label: "absolute top-[calc(var(--scroll-progress)*1%)] flex -translate-y-1/2 items-center gap-1",
    labelRule: "h-px w-2 bg-foreground",
    labelValue: "font-medium text-foreground text-xs tabular-nums",
  },
  variants: {
    position: {
      left: { root: "top-1/2 left-0 -translate-y-1/2", label: "left-full pl-1.5" },
      right: {
        root: "top-1/2 right-0 -translate-y-1/2",
        label: "right-full flex-row-reverse pr-1.5",
      },
      "bottom-left": { root: "bottom-2 left-0", label: "left-full pl-1.5" },
      "bottom-right": {
        root: "right-0 bottom-2",
        label: "right-full flex-row-reverse pr-1.5",
      },
    },
    scope: {
      page: { root: "fixed" },
      container: { root: "absolute" },
    },
  },
  defaultVariants: { position: "right", scope: "page" },
});

export type ScrollProgressPosition = NonNullable<VariantProps<typeof scrollProgress>["position"]>;

/** Scroll position of `el` (or the page) as 0 to 100. */
export function scrollPercent(el: HTMLElement | null): number {
  const top = el ? el.scrollTop : window.scrollY;
  const range = el
    ? el.scrollHeight - el.clientHeight
    : document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (range <= 0) return 0;
  return Math.min(100, Math.max(0, (top / range) * 100));
}
