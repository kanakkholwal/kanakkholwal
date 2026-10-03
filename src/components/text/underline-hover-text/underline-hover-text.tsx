import { type CSSProperties, createElement, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  type UnderlineHoverTextTone,
  type UnderlineHoverTextTrigger,
  type UnderlineHoverTextVariant,
  underlineHoverText,
} from "./variants";

export type { UnderlineHoverTextTone, UnderlineHoverTextTrigger, UnderlineHoverTextVariant };

export interface UnderlineHoverTextProps {
  children: ReactNode;
  as?: ElementType;
  /** With `as="a"`, the link target. */
  href?: string;
  variant?: UnderlineHoverTextVariant;
  tone?: UnderlineHoverTextTone;
  /** `hover` draws the stroke on hover and keyboard focus; `always` keeps it drawn. */
  trigger?: UnderlineHoverTextTrigger;
  /** How long the stroke takes, in ms. */
  durationMs?: number;
  className?: string;
}

export function UnderlineHoverText({
  children,
  as = "span",
  href,
  variant = "sweep",
  tone = "default",
  trigger = "hover",
  durationMs = 500,
  className,
}: UnderlineHoverTextProps) {
  const s = underlineHoverText({ variant, tone, trigger });
  return createElement(
    as,
    {
      href,
      "data-slot": "underline-hover-text",
      "data-variant": variant,
      className: cn(s.root(), className),
      style: { "--uht-duration": `${durationMs}ms` } as CSSProperties,
    },
    children,
    createElement("span", {
      key: "baseline",
      "aria-hidden": true,
      className: s.baseline(),
    }),
    createElement("span", { key: "stroke", "aria-hidden": true, className: s.stroke() }),
    createElement("span", { key: "top", "aria-hidden": true, className: s.top() }),
  );
}
