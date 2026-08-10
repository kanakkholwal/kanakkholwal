"use client";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

export const intents = {
  default: "bg-primary text-primary-foreground shadow-sm hoverable:bg-primary/88",
  default_soft:
    "bg-primary/10 text-primary hoverable:bg-primary/18 dark:bg-primary/15 dark:hoverable:bg-primary/25",
  secondary:
    "bg-secondary text-secondary-foreground hoverable:bg-secondary/80",
  tertiary:
    "bg-tertiary text-tertiary-foreground shadow-sm hoverable:bg-tertiary/88",
  accent: "bg-accent text-accent-foreground hoverable:bg-accent/70",
  muted: "bg-muted text-muted-foreground hoverable:bg-muted/70",

  // Semantic. These read from the tokens rather than raw palette steps, so the
  // label/fill pair is measured once in global.css instead of per variant.
  success:
    "bg-success text-success-foreground hoverable:bg-success/88",
  success_soft:
    "bg-success/12 text-success hoverable:bg-success/20",
  info: "bg-info text-info-foreground hoverable:bg-info/88",
  info_soft: "bg-info/12 text-info hoverable:bg-info/20",
  warning:
    "bg-warning text-warning-foreground hoverable:bg-warning/88",
  warning_soft:
    "bg-warning/12 text-warning hoverable:bg-warning/20",
  destructive:
    "bg-destructive text-destructive-foreground hoverable:bg-destructive/88",
  destructive_soft:
    "bg-destructive/12 text-destructive hoverable:bg-destructive/20",

  outline:
    "border border-input bg-card text-foreground hoverable:bg-accent hoverable:text-accent-foreground",
  ghost:
    "bg-transparent text-muted-foreground hoverable:bg-accent hoverable:text-accent-foreground",
  link: "text-primary underline underline-offset-4 decoration-primary/40 hoverable:decoration-primary",
  dark: "bg-foreground text-background hoverable:bg-foreground/88",
  glass:
    "border border-border bg-background/70 text-foreground backdrop-blur-md hoverable:bg-background/85",

  raw: "",
} as const;

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-medium",
    "cursor-pointer disabled:pointer-events-none disabled:opacity-55",
    // Never `transition-all`: it animates layout properties and fades the focus
    // ring in, which defeats the point of a focus ring.
    "transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-150 ease-out",
    // Full-opacity 2px ring. At `ring/50` this measured 1.92:1 against the page.
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "aria-invalid:outline-destructive aria-invalid:border-destructive",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: intents,
      // Heights step 24 / 32 / 40 / 44 / 56 with padding that steps with them.
      // Nothing below 24px — that is the WCAG 2.5.8 target floor.
      size: {
        xs: "h-6 gap-1.5 px-2.5 text-2xs [&_svg]:size-3",
        sm: "h-8 gap-1.5 px-3 text-xs [&_svg]:size-4",
        default: "h-10 px-4 text-sm [&_svg]:size-4",
        lg: "h-11 gap-2.5 px-6 text-base [&_svg]:size-5",
        xl: "h-14 gap-3 px-8 text-lg [&_svg]:size-6",
        icon_xs: "size-6 [&_svg]:size-3",
        icon_sm: "size-8 [&_svg]:size-4",
        icon: "size-10 [&_svg]:size-4",
        icon_lg: "size-11 [&_svg]:size-5",
        icon_xl: "size-14 [&_svg]:size-6",
        responsive_lg:
          "h-10 px-4 text-sm md:h-11 md:px-6 md:text-base [&_svg]:size-4 md:[&_svg]:size-5",
      },
      effect: {
        none: "",
        expandIcon: "group gap-0",
        ringHover:
          "hoverable:ring-2 hoverable:ring-primary/25 hoverable:ring-offset-2 hoverable:ring-offset-background",
        underline:
          "!no-underline after:absolute after:bottom-1.5 after:h-px after:w-2/3 after:origin-bottom-left after:scale-x-100 after:bg-current after:transition-transform after:duration-200 after:ease-out hoverable:after:origin-bottom-right hoverable:after:scale-x-0",
        hoverUnderline:
          "!no-underline after:absolute after:bottom-1.5 after:h-px after:w-2/3 after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out hoverable:after:origin-bottom-left hoverable:after:scale-x-100",
      },
      width: {
        default: "w-auto",
        full: "w-full",
        fit: "mx-auto w-fit",
        xs: "mx-auto w-full max-w-xs",
        sm: "mx-auto w-full max-w-sm",
        md: "mx-auto w-full max-w-md",
        lg: "mx-auto w-full max-w-lg",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        large: "rounded-lg",
        none: "rounded-none",
      },
      // 0.97 is the smallest press that reads as a press. The old default was
      // 0.99, which is below the perception threshold.
      transition: {
        none: "",
        damped: "active:scale-[0.97]",
        scale: "hoverable:scale-[1.02] active:scale-[0.97]",
        lift: "hoverable:-translate-y-0.5 hoverable:shadow-lg active:translate-y-0 active:scale-[0.98]",
        press: "active:translate-y-px active:scale-[0.98]",
      },
      shadow: {
        none: "shadow-none",
        default: "shadow-lg shadow-primary/25",
        default_soft: "shadow-md shadow-primary/15",
        destructive: "shadow-lg shadow-destructive/25",
        success: "shadow-md shadow-success/25",
        warning: "shadow-md shadow-warning/25",
        dark: "shadow-lg shadow-black/30",
        light: "shadow-md shadow-black/10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      transition: "damped",
      effect: "none",
      rounded: "default",
      shadow: "none",
    },
    compoundVariants: [
      { variant: "default", size: "lg", shadow: "none", className: "shadow-md shadow-primary/25" },
      { variant: "default_soft", shadow: "default_soft" },
      { variant: "destructive", shadow: "destructive" },
    ],
  },
);

interface IconProps {
  icon: React.ElementType;
  iconPlacement: "left" | "right";
}

interface IconRefProps {
  icon?: never;
  iconPlacement?: undefined;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  /** Swaps the label for a spinner and blocks interaction. */
  isLoading?: boolean;
  asChild?: boolean;
}

export type ButtonIconProps = IconProps | IconRefProps;

function Spinner() {
  return (
    <svg
      className="size-[1em] animate-spin motion-reduce:animate-none"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & ButtonIconProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      rounded,
      transition,
      width,
      effect,
      isLoading = false,
      disabled,
      icon: Icon,
      iconPlacement,
      type,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const expanding = effect === "expandIcon";

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
            transition,
            rounded,
            width,
            effect,
          }),
        )}
        ref={ref}
        // Without this, any Button inside a <form> submits it.
        type={asChild ? undefined : (type ?? "button")}
        disabled={asChild ? undefined : disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading ? <Spinner /> : null}
        {!isLoading && Icon && iconPlacement === "left" ? (
          expanding ? (
            <ExpandingIcon icon={Icon} placement="left" />
          ) : (
            <Icon />
          )
        ) : null}
        <Slottable>{children}</Slottable>
        {!isLoading && Icon && iconPlacement === "right" ? (
          expanding ? (
            <ExpandingIcon icon={Icon} placement="right" />
          ) : (
            <Icon />
          )
        ) : null}
      </Comp>
    );
  },
);
Button.displayName = "Button";

/**
 * The `expandIcon` reveal. Sizes itself to the icon via an animatable
 * `0fr → 1fr` grid track rather than a hard-coded width.
 *
 * The previous version paired `w-[1.25em]` with `group-hover:pl-2`. Preflight
 * makes that width border-box, so the padding came out of it: at `lg` the
 * content box was 12px for a 20px icon — 40% of the glyph clipped by
 * `overflow-hidden`, and every other size clipped too. `1.25em` was also below
 * the icon size at `xl` on its own, so no single constant could have worked
 * across a scale where font size and icon size step independently.
 */
function ExpandingIcon({
  icon: Icon,
  placement,
}: {
  icon: React.ElementType;
  placement: "left" | "right";
}) {
  return (
    <span
      className={cn(
        "grid grid-cols-[0fr] opacity-0 transition-[grid-template-columns,opacity,margin] duration-200 ease-out",
        "group-hover:grid-cols-[1fr] group-hover:opacity-100",
        // Margin, not padding — it sits outside the animated track instead of
        // being subtracted from it.
        placement === "right" ? "group-hover:ml-2" : "group-hover:mr-2",
      )}
    >
      <span className="overflow-hidden">
        <Icon />
      </span>
    </span>
  );
}

export { Button, buttonVariants };
