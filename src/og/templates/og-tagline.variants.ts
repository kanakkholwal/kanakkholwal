import { tv, type VariantProps } from "tailwind-variants";

export const ogTagline = tv({
  slots: {
    root: "relative flex h-[630px] w-[1200px] flex-col items-center justify-center gap-[48px] overflow-hidden bg-background font-sans text-foreground",
    brand: "flex items-center gap-3",
    logo: "h-[44px] w-[44px] shrink-0 object-contain",
    name: "line-clamp-1 max-w-[600px] font-semibold text-[38px] tracking-[-0.02em]",
    lines: "flex flex-col items-center text-center font-heading text-[92px] leading-[1.08] tracking-[-0.03em]",
    line: "line-clamp-1 max-w-[1060px]",
    accent: "line-clamp-1 max-w-[1060px]",
  },
  variants: {
    mode: {
      light: {},
      dark: { root: "dark" },
    },
    // The second line carries the one accent colour.
    tone: {
      success: { accent: "text-success" },
      primary: { accent: "text-primary" },
      info: { accent: "text-info" },
      warning: { accent: "text-warning" },
    },
  },
  defaultVariants: { mode: "dark", tone: "success" },
});

export type OgTaglineMode = NonNullable<VariantProps<typeof ogTagline>["mode"]>;
export type OgTaglineTone = NonNullable<VariantProps<typeof ogTagline>["tone"]>;
