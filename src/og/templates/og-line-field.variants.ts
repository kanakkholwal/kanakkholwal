import { tv, type VariantProps } from "tailwind-variants";

export const ogLineField = tv({
  slots: {
    root: "relative flex h-[630px] w-[1200px] items-center justify-center overflow-hidden bg-muted font-sans text-foreground",
    field:
      "absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_58%_62%_at_50%_50%,transparent_28%,black_80%)]",
    hairX: "absolute inset-x-0 top-[315px] h-px bg-foreground/10",
    hairY: "absolute inset-y-0 left-[600px] w-px bg-foreground/10",
    mark: "relative flex flex-col items-center gap-6",
    wordmark: "flex items-center gap-6",
    logo: "h-[96px] w-[96px] shrink-0 rounded-[22px] object-cover",
    name: "line-clamp-1 max-w-[900px] font-heading font-semibold text-[112px] leading-[1.1] tracking-[-0.045em]",
    tagline: "line-clamp-1 max-w-[860px] text-[30px] text-muted-foreground",
  },
  variants: {
    mode: {
      light: {},
      dark: { root: "dark" },
    },
    density: {
      fine: { field: "text-foreground/25" },
      bold: { field: "text-foreground/45" },
    },
  },
  defaultVariants: { mode: "light", density: "fine" },
});

export type OgLineFieldMode = NonNullable<VariantProps<typeof ogLineField>["mode"]>;
export type OgLineFieldDensity = NonNullable<VariantProps<typeof ogLineField>["density"]>;

/** Lens-warped grid: lines bulge away from the centre and ripple more toward the edges. */
export const OG_LINE_FIELD_PATHS: string[] = (() => {
  const cx = 600;
  const cy = 315;
  const shift = (x: number, y: number) => {
    const r = Math.hypot((x - cx) / cx, (y - cy) / cy);
    return { push: 0.2 * Math.exp(-r * r * 2.4), amp: 10 * Math.min(1, r) };
  };
  const paths: string[] = [];
  for (let x0 = 20; x0 <= 1180; x0 += 40) {
    const pts: string[] = [];
    for (let y = -15; y <= 645; y += 15) {
      const { push, amp } = shift(x0, y);
      const x = x0 + (x0 - cx) * push + amp * Math.sin((y * Math.PI) / 40);
      pts.push(`${pts.length ? "L" : "M"}${x.toFixed(1)} ${y}`);
    }
    paths.push(pts.join(" "));
  }
  for (let y0 = 15; y0 <= 615; y0 += 40) {
    const pts: string[] = [];
    for (let x = -15; x <= 1215; x += 15) {
      const { push, amp } = shift(x, y0);
      const y = y0 + (y0 - cy) * push + amp * Math.sin((x * Math.PI) / 40);
      pts.push(`${pts.length ? "L" : "M"}${x} ${y.toFixed(1)}`);
    }
    paths.push(pts.join(" "));
  }
  return paths;
})();
