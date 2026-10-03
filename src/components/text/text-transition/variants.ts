import { tv, type VariantProps } from "tailwind-variants";
import { TEXT_TRANSITION_VARIANTS } from "./presets";

/** Every value is a no-op class: the real per-variant difference lives in `presets.ts`
 * as CSS custom properties, not Tailwind classes. tv() only derives the type here. */
export const textTransition = tv({
  base: "text-transition inline-block",
  variants: {
    variant: Object.fromEntries(TEXT_TRANSITION_VARIANTS.map((v) => [v, ""])) as Record<
      (typeof TEXT_TRANSITION_VARIANTS)[number],
      string
    >,
  },
  defaultVariants: { variant: "blur-out-up" },
});

export type TextTransitionVariant = NonNullable<VariantProps<typeof textTransition>["variant"]>;
