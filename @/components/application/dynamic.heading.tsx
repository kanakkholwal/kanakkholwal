"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// The Dynamic variant's section opener. Six sections had built this by hand and
// drifted apart: the serif phrase ran at three different mutings, the eyebrow at
// two sizes and two idioms (`// Career` against `Portfolio`), two sections
// centred while three sat left, and the lede appeared at three sizes. Used only
// by Dynamic — Minimal has Panel headers, Static its own, Story its chapters.

export function DynamicHeading({
  id,
  label,
  icon: Icon,
  serif,
  children,
  lead,
  aside,
  className,
}: {
  /** Drives the `layoutId` pair, so the eyebrow and heading morph on a variant swap. */
  id: string;
  label: string;
  icon: LucideIcon;
  /** The muted serif phrase that opens the heading. */
  serif: string;
  /** The bold remainder. */
  children: ReactNode;
  lead?: ReactNode;
  /** Optional trailing control — a filter, a link — kept out of the text column. */
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl space-y-3">
        <motion.span
          layoutId={`${id}-label`}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground"
        >
          <Icon className="size-3.5" />
          {label}
        </motion.span>
        <motion.h2
          layoutId={`${id}-heading`}
          className="text-4xl font-bold leading-none tracking-tighter md:text-6xl"
        >
          {/* One muting. `/70` measured 3.05:1 — passing for large text only,
              and the same role rendered at three strengths across the page. */}
          <span className="mr-3 font-serif font-normal italic text-muted-foreground">
            {serif}
          </span>
          {children}
        </motion.h2>
        {lead ? (
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
            {lead}
          </p>
        ) : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
