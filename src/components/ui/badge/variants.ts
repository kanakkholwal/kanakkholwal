import { tv, type VariantProps } from "tailwind-variants";

export const badge = tv({
  base: "inline-flex shrink-0 items-center gap-1.5 rounded-md border font-medium whitespace-nowrap transition-colors duration-(--duration-fast)",
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground",
      secondary: "border-transparent bg-card text-foreground",
      outline: "border-border bg-transparent text-foreground",
      success: "border-transparent bg-[color-mix(in_oklch,var(--success)_15%,transparent)] text-success-strong",
      warning: "border-transparent bg-[color-mix(in_oklch,var(--warning)_15%,transparent)] text-warning-strong",
      destructive:
        "border-transparent bg-[color-mix(in_oklch,var(--destructive)_15%,transparent)] text-destructive-strong",
      info: "border-transparent bg-[color-mix(in_oklch,var(--info)_15%,transparent)] text-info-strong",
    },
    size: {
      sm: "h-5 px-1.5 text-xs",
      md: "h-6 px-2 text-xs",
      lg: "h-7 px-2.5 text-sm",
      xl: "h-8 px-3 text-sm",
    },
  },
  defaultVariants: { variant: "secondary", size: "md" },
});

export type BadgeVariant = NonNullable<VariantProps<typeof badge>["variant"]>;
export type BadgeSize = NonNullable<VariantProps<typeof badge>["size"]>;
