"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { type SeparatorVariant, separator } from "./variants";

export type { SeparatorVariant };

export interface SeparatorProps extends ComponentProps<typeof SeparatorPrimitive> {
  variant?: SeparatorVariant;
  /** Purely visual: hidden from assistive tech. */
  decorative?: boolean;
}

export function Separator({
  className,
  orientation = "horizontal",
  decorative = false,
  variant = "solid",
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(separator({ variant }), className)}
      {...(decorative ? { role: "none", "aria-orientation": undefined } : {})}
      {...props}
    />
  );
}
