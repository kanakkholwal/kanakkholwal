import { tv, type VariantProps } from "tailwind-variants";

export const ogTagField = tv({
  slots: {
    root: "relative flex h-[630px] w-[1200px] flex-col justify-between overflow-hidden bg-background p-[64px] font-sans text-foreground",
    // Tilted with an explicit angle (takumi drops calc() angles) and faded toward the copy.
    field:
      "absolute top-[-170px] left-[430px] flex w-[1040px] rotate-[-18deg] flex-wrap gap-x-4 gap-y-5 [mask-image:linear-gradient(200deg,black_28%,transparent_72%)]",
    logo: "relative h-[76px] w-[76px] object-contain",
    title: "relative line-clamp-2 max-w-[1040px] font-medium text-[66px] leading-[1.12] tracking-[-0.03em]",
    accent: "",
  },
  variants: {
    mode: {
      light: {},
      dark: { root: "dark" },
    },
    tone: {
      chart: { accent: "text-chart-2" },
      primary: { accent: "text-primary" },
    },
  },
  defaultVariants: { mode: "dark", tone: "chart" },
});

export type OgTagFieldMode = NonNullable<VariantProps<typeof ogTagField>["mode"]>;
export type OgTagFieldTone = NonNullable<VariantProps<typeof ogTagField>["tone"]>;

/** One pill in the field; every fourth is lit so the field reads as a live index, not a wash. */
export const ogTagFieldTag = tv({
  base: "flex h-[52px] items-center rounded-full border border-foreground/10 px-6 text-[24px]",
  variants: {
    lit: {
      true: "bg-foreground/[0.09] text-foreground/85",
      false: "bg-foreground/[0.03] text-foreground/42",
    },
  },
});

/** Enough pills to fill the tilted field; `tags` cycles through them. */
export const OG_TAG_FIELD_SLOTS = 44;
