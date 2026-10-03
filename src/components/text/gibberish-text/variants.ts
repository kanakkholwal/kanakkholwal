import { tv, type VariantProps } from "tailwind-variants";

export const gibberishText = tv({
  base: "inline-block min-w-[1ch] text-center font-mono",
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: { size: "md" },
});

export type GibberishTextSize = NonNullable<VariantProps<typeof gibberishText>["size"]>;
