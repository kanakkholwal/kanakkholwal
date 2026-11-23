import { tv, type VariantProps } from "tailwind-variants";

// Negative angles are written `rotate-[-28deg]`: takumi rejects the calc() that `-rotate-*` compiles to.
export const ogSoftFocus = tv({
  slots: {
    root: "relative flex h-[630px] w-[1200px] items-center justify-center overflow-hidden bg-[color-mix(in_oklab,var(--foreground)_30%,var(--background))] font-sans text-background",
    form: "absolute -top-[160px] left-[360px] h-[960px] w-[520px] rotate-[-28deg] rounded-full bg-foreground blur-[56px]",
    ripplesA:
      "absolute -top-[260px] -right-[240px] h-[900px] w-[900px] rounded-full bg-[repeating-radial-gradient(circle,transparent_0_14px,var(--foreground)_14px_18px)] opacity-30 blur-[2px] [mask-image:radial-gradient(circle,black_25%,transparent_68%)]",
    ripplesB:
      "absolute -bottom-[300px] -left-[260px] h-[800px] w-[800px] rounded-full bg-[repeating-radial-gradient(circle,transparent_0_12px,var(--foreground)_12px_16px)] opacity-25 blur-[2px] [mask-image:radial-gradient(circle,black_25%,transparent_68%)]",
    mark: "relative flex flex-col items-center gap-6",
    wordmark: "flex items-center gap-6",
    logo: "h-[96px] w-[96px] shrink-0 rounded-[22px] object-cover",
    name: "line-clamp-1 max-w-[900px] font-heading font-semibold text-[112px] leading-[1.1] tracking-[-0.045em]",
    tagline: "line-clamp-1 max-w-[860px] text-[30px] text-background/70",
  },
  variants: {
    mode: {
      light: {},
      dark: { root: "dark" },
    },
  },
  defaultVariants: { mode: "light" },
});

export type OgSoftFocusMode = NonNullable<VariantProps<typeof ogSoftFocus>["mode"]>;
