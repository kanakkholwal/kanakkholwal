import type { Growth } from "~/lib/analytics/types";

export const compact = (n: number) =>
  n.toLocaleString("en-GB", { notation: "compact", maximumFractionDigits: 1 });

export const full = (n: number) => Math.round(n).toLocaleString("en-GB");

export const fmtDuration = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return m ? `${m}m ${sec}s` : `${sec}s`;
};

export const percent = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

export const ratePct = (n: number) => `${Math.round(n * 100)}%`;

export function growth(current: number, previous: number): Growth {
  if (!previous) return { delta: current, percent: current ? 100 : 0, trend: current > 0 ? 1 : 0 };
  const delta = current - previous;
  return { delta, percent: (delta / previous) * 100, trend: delta > 0 ? 1 : delta < 0 ? -1 : 0 };
}
