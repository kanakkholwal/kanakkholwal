import { tv, type VariantProps } from "tailwind-variants";

export const ogWordPicker = tv({
  slots: {
    root: "relative flex h-[630px] w-[1200px] overflow-hidden bg-background font-sans text-foreground",
    wash: "absolute inset-0",
    brand: "absolute top-[176px] left-[88px] flex items-center gap-4",
    logo: "h-12 w-12 shrink-0 rounded-xl object-cover",
    site: "line-clamp-1 max-w-[360px] font-medium text-[36px] tracking-tight",
    title:
      "absolute top-[250px] left-[84px] line-clamp-1 max-w-[420px] font-heading text-[100px] leading-[110px] tracking-[-0.035em]",
    cta: "absolute top-[392px] left-[88px] flex items-center gap-3 rounded-full bg-foreground px-8 py-4 font-medium text-[26px] text-background",
    words: "absolute left-[520px] flex flex-col",
    box: "absolute -inset-x-1 inset-y-1 border-2 border-foreground/80 border-dashed",
    handle: "absolute -mt-2 -ml-2 h-4 w-4 rounded-full border-2 border-foreground bg-background",
    cursor: "absolute -right-[58px] -bottom-[62px] h-[72px] w-[72px] text-foreground",
  },
  variants: {
    mode: {
      light: {},
      dark: { root: "dark" },
    },
    tone: {
      neutral: {
        wash: "bg-[linear-gradient(105deg,transparent_35%,color-mix(in_oklab,var(--foreground)_22%,transparent)_100%)]",
        box: "bg-foreground/10",
      },
      chart: {
        wash: "bg-[linear-gradient(105deg,transparent_35%,color-mix(in_oklab,var(--chart-2)_70%,transparent)_100%)]",
        box: "bg-chart-2/25",
      },
      primary: {
        wash: "bg-[linear-gradient(105deg,transparent_35%,color-mix(in_oklab,var(--primary)_70%,transparent)_100%)]",
        box: "bg-primary/25",
      },
    },
  },
  defaultVariants: { mode: "dark", tone: "primary" },
});

/** Rows fade and blur with their distance from the selected word. */
export const ogWordPickerRow = tv({
  base: "relative flex h-[120px] shrink-0 items-center whitespace-nowrap px-6 text-[88px] leading-none tracking-[-0.03em]",
  variants: {
    step: {
      0: "",
      1: "opacity-50 blur-[1px]",
      2: "opacity-25 blur-[3px]",
      3: "opacity-10 blur-[5px]",
    },
  },
  defaultVariants: { step: 0 },
});

export type OgWordPickerMode = NonNullable<VariantProps<typeof ogWordPicker>["mode"]>;
export type OgWordPickerTone = NonNullable<VariantProps<typeof ogWordPicker>["tone"]>;
export type OgWordPickerStep = NonNullable<VariantProps<typeof ogWordPickerRow>["step"]>;

export const OG_WORD_PICKER_STEPS: OgWordPickerStep[] = [0, 1, 2, 3];

/** Row height (px) and the canvas line the selected row centres on, level with the lead word. */
export const OG_WORD_PICKER_ROW = 120;
export const OG_WORD_PICKER_AXIS = 305;

/** Selection handles as percent offsets around the box. */
export const OG_WORD_PICKER_HANDLES = [
  [0, 0],
  [50, 0],
  [100, 0],
  [0, 50],
  [100, 50],
  [0, 100],
  [50, 100],
  [100, 100],
];
