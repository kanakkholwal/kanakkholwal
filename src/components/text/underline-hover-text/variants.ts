import { tv, type VariantProps } from "tailwind-variants";

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Four hover strokes: `sweep` from the centre, `double` a lifting second hairline, `draw` a
 * hairline from the start, `bar` a thick bar that slides in and out past the end. */
export const underlineHoverText = tv({
  slots: {
    root: "group/underline relative inline-block cursor-pointer outline-none",
    baseline: "pointer-events-none absolute left-0 hidden w-full",
    stroke: "pointer-events-none absolute hidden",
    top: "pointer-events-none absolute left-0 hidden h-px w-full",
  },
  variants: {
    variant: {
      sweep: {
        root: `px-1 pb-1.5 transition-transform duration-[var(--uht-duration,500ms)] ${ease} will-change-transform`,
        baseline: "bottom-0 block h-px bg-current opacity-25",
        stroke: `-bottom-px left-1/2 block h-[3px] w-0 -translate-x-1/2 rounded-full transition-[width] duration-[var(--uht-duration,500ms)] ${ease}`,
      },
      double: {
        root: "font-medium",
        baseline: `-bottom-[3px] block h-px bg-gradient-to-r from-transparent via-current/70 to-transparent transition-opacity duration-[var(--uht-duration,500ms)] ${ease}`,
        top: `block bg-gradient-to-r from-transparent via-current to-transparent transition-[top,opacity] duration-[var(--uht-duration,500ms)] ${ease}`,
      },
      draw: {
        stroke: `inset-x-0 top-full block h-px origin-left scale-x-0 opacity-0 transition-[scale,opacity] duration-[var(--uht-duration,500ms)] ${ease}`,
      },
      // The origin flips with the hover, so the bar grows in from the start and shrinks off the end.
      bar: {
        root: "pb-2",
        stroke: `inset-x-0 bottom-0 block h-1 origin-right scale-x-0 rounded-full transition-[scale] duration-[var(--uht-duration,500ms)] ${ease}`,
      },
    },
    tone: {
      default: { root: "text-foreground", stroke: "bg-foreground" },
      primary: { root: "text-primary", stroke: "bg-primary" },
      accent: { root: "text-accent", stroke: "bg-accent" },
    },
    trigger: { hover: {}, always: {} },
  },
  compoundVariants: [
    {
      variant: "sweep",
      trigger: "hover",
      class: {
        root: "hover:-translate-y-[2px] focus-visible:-translate-y-[2px]",
        stroke: "group-hover/underline:w-full group-focus-visible/underline:w-full",
      },
    },
    { variant: "sweep", trigger: "always", class: { stroke: "w-full" } },
    {
      variant: "double",
      trigger: "hover",
      class: {
        baseline: "opacity-100 group-hover/underline:opacity-50 group-focus-visible/underline:opacity-50",
        top: "top-[calc(100%-3px)] opacity-0 group-hover/underline:-top-px group-hover/underline:opacity-100 group-focus-visible/underline:-top-px group-focus-visible/underline:opacity-100",
      },
    },
    {
      variant: "double",
      trigger: "always",
      class: { baseline: "opacity-50", top: "-top-px opacity-100" },
    },
    {
      variant: "draw",
      trigger: "hover",
      class: {
        stroke:
          "group-hover/underline:scale-x-100 group-hover/underline:opacity-100 group-focus-visible/underline:scale-x-100 group-focus-visible/underline:opacity-100",
      },
    },
    { variant: "draw", trigger: "always", class: { stroke: "scale-x-100 opacity-100" } },
    {
      variant: "bar",
      trigger: "hover",
      class: {
        stroke:
          "group-hover/underline:origin-left group-hover/underline:scale-x-100 group-focus-visible/underline:origin-left group-focus-visible/underline:scale-x-100",
      },
    },
    { variant: "bar", trigger: "always", class: { stroke: "scale-x-100" } },
  ],
  defaultVariants: { variant: "sweep", tone: "default", trigger: "hover" },
});

export type UnderlineHoverTextVariant = NonNullable<VariantProps<typeof underlineHoverText>["variant"]>;
export type UnderlineHoverTextTone = NonNullable<VariantProps<typeof underlineHoverText>["tone"]>;
export type UnderlineHoverTextTrigger = NonNullable<VariantProps<typeof underlineHoverText>["trigger"]>;
