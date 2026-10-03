import { type CSSProperties, createElement, type ElementType } from "react";
import { cn } from "@/lib/cn";
import { type ShimmerTextSize, shimmerText } from "./variants";

export type { ShimmerTextSize };

export interface ShimmerTextProps {
  text: string;
  /** One sweep across the text, in ms. */
  durationMs?: number;
  /** Band half-width in px per character, so long text gets a wider band. */
  spread?: number;
  size?: ShimmerTextSize;
  as?: ElementType;
  className?: string;
}

export function ShimmerText({
  text,
  durationMs = 2000,
  spread = 2,
  size = "inherit",
  as = "p",
  className,
}: ShimmerTextProps) {
  return createElement(
    as,
    {
      "data-slot": "shimmer-text",
      className: cn(shimmerText({ size }), className),
      style: {
        "--shimmer-spread": `${text.length * spread}px`,
        "--shimmer-duration": `${durationMs}ms`,
      } as CSSProperties,
    },
    text,
  );
}
