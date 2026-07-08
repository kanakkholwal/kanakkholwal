// Shared motion tokens so every story component eases the same way.
export const EASE = [0.22, 1, 0.36, 1] as const;

export const springSoft = { type: "spring", stiffness: 260, damping: 28 } as const;

/** Keep a scroll breakpoint inside [0,1] — required for WAAPI ScrollTimeline offsets. */
export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Zero-padded two-digit index for the log-style numbering. */
export const pad = (n: number) => String(n).padStart(2, "0");
