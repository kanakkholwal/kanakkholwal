"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { cn } from "@/lib/cn";
import { TOAST_CLASSES } from "@/lib/toast-classes";

export type { ToasterProps } from "sonner";
export { toast } from "sonner";

const STROKE = {
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
} as const;

// One glyph per status.
const ICONS: ToasterProps["icons"] = {
  success: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
      <path d="m3.5 8.5 3 3 6-7" {...STROKE} strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
      <circle cx="8" cy="8" r="6.25" {...STROKE} />
      <path d="M8 5v3.5M8 11h.01" {...STROKE} />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
      <path d="M8 2.5 14 13H2z" {...STROKE} strokeLinejoin="round" />
      <path d="M8 6.5v3M8 11.5h.01" {...STROKE} />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
      <circle cx="8" cy="8" r="6.25" {...STROKE} />
      <path d="M8 7.5V11M8 5h.01" {...STROKE} />
    </svg>
  ),
  loading: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none">
      <path d="M14 8a6 6 0 0 0-6-6" {...STROKE} />
    </svg>
  ),
};

const DEFAULT_OFFSET = { top: 16, right: 16, bottom: 24, left: 16 };

// sonner owns stacking, swipe and timing; every class on the toast is ours.
export function Toaster({
  position = "bottom-right",
  visibleToasts = 4,
  duration = 4000,
  closeButton = true,
  expand = true,
  gap = 8,
  offset = DEFAULT_OFFSET,
  toastOptions,
  className,
  ...props
}: ToasterProps) {
  return (
    <Sonner
      position={position}
      visibleToasts={visibleToasts}
      duration={duration}
      closeButton={closeButton}
      expand={expand}
      gap={gap}
      offset={offset}
      className={cn("font-sans!", className)}
      icons={ICONS}
      toastOptions={{ unstyled: true, classNames: TOAST_CLASSES, ...toastOptions }}
      {...props}
    />
  );
}
