"use client";

import type { CSSProperties } from "react";
import { useMemo } from "react";

// A stable accent per project, so each placeholder feels branded and distinct
// without the garish solid-color block the old fallback used.
const ACCENTS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
];

function accentFor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCENTS[Math.abs(hash) % ACCENTS.length];
}

/**
 * Branded placeholder shown when a project has no image/video. Reads like an OG
 * card: a monogram + wordmark lockup with the project's tagline underneath.
 */
export function ProjectFallback({
  title,
  description,
  meta,
}: {
  title: string;
  description?: string;
  /** Optional small line under the tagline (e.g. dates) — only pass it when the
   * surrounding card doesn't already show this info. */
  meta?: string;
}) {
  const accent = useMemo(() => accentFor(title), [title]);
  const initial = title.trim().charAt(0).toUpperCase() || "•";

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-zinc-50 px-8 text-center dark:bg-zinc-900"
      style={{ "--accent": accent } as CSSProperties}
    >
      {/* Dotted grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgb(130 130 140 / 0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Logo lockup: monogram + wordmark */}
      <div className="relative z-10 flex items-center justify-center gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border text-lg font-bold"
          style={{
            borderColor: "color-mix(in oklab, var(--accent) 35%, transparent)",
            background: "color-mix(in oklab, var(--accent) 12%, transparent)",
            color: "var(--accent)",
          }}
        >
          {initial}
        </div>
        <span className="text-2xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </span>
      </div>

      {/* Tagline */}
      {description && (
        <p className="relative z-10 mt-4 line-clamp-2 max-w-[85%] font-mono text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      )}

      {/* Optional meta (e.g. dates) */}
      {meta && (
        <p className="relative z-10 mt-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {meta}
        </p>
      )}
    </div>
  );
}
