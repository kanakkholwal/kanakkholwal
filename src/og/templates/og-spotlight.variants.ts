import { tv, type VariantProps } from "tailwind-variants";

export const ogSpotlight = tv({
  slots: {
    root: "relative flex h-[630px] w-[1200px] flex-col items-center justify-center overflow-hidden bg-[color-mix(in_oklab,var(--foreground)_3%,var(--background))] font-sans text-foreground",
    grid: "absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_44%_60%_at_50%_50%,black,transparent)]",
    face: "absolute rounded-[20px] object-cover shadow-[0_16px_32px_-16px_rgb(0_0_0/0.35)]",
    title:
      "relative line-clamp-2 max-w-[760px] text-center font-heading font-medium text-[92px] leading-[1.05] tracking-[-0.02em]",
    brand: "relative mt-10 flex items-center gap-5 text-muted-foreground",
    logo: "h-[60px] w-[60px] shrink-0 rounded-2xl object-cover",
    site: "line-clamp-1 max-w-[520px] font-medium text-[60px] tracking-[-0.03em]",
  },
  variants: {
    mode: {
      light: {},
      dark: { root: "dark" },
    },
  },
  defaultVariants: { mode: "light" },
});

export type OgSpotlightMode = NonNullable<VariantProps<typeof ogSpotlight>["mode"]>;

/** Portrait tiles around the headline, four per side; images cycle through them. */
export const OG_SPOTLIGHT_TILES = [
  { left: 136, top: -10, width: 116, height: 124 },
  { left: 22, top: 170, width: 116, height: 136 },
  { left: 168, top: 370, width: 116, height: 136 },
  { left: -6, top: 482, width: 96, height: 150 },
  { left: 872, top: -12, width: 116, height: 120 },
  { left: 1040, top: 116, width: 116, height: 136 },
  { left: 924, top: 342, width: 116, height: 136 },
  { left: 1062, top: 524, width: 116, height: 136 },
];
