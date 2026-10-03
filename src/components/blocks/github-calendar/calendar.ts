export type GithubCalendarLevel = 0 | 1 | 2 | 3 | 4;

export interface GithubCalendarDay {
  /** `YYYY-MM-DD` (read as a local date) or a Date. */
  date: string | Date;
  count: number;
  /** Pins the colour level; derived from `count` against the busiest day when omitted. */
  level?: GithubCalendarLevel;
}

export interface GithubCalendarLabels {
  /** Accessible name of the cell grid. */
  grid: string;
  total: string;
  contribution: string;
  contributions: string;
  on: string;
  less: string;
  more: string;
}

export const GITHUB_CALENDAR_LABELS: GithubCalendarLabels = {
  grid: "Contribution calendar",
  total: "contributions in the last year",
  contribution: "contribution",
  contributions: "contributions",
  on: "on",
  less: "Less",
  more: "More",
};

export type GithubCalendarWeekStart = "sunday" | "monday";

export interface GithubCalendarCell {
  key: string;
  date: Date;
  count: number;
  level: GithubCalendarLevel;
  col: number;
  row: number;
}

export interface GithubCalendarGrid {
  cells: GithubCalendarCell[];
  weeks: number;
  months: { col: number; date: Date }[];
  weekdays: Date[];
  total: number;
}

const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

function toLocalDay(value: string | Date): Date {
  const match = typeof value === "string" ? ISO_DAY.exec(value) : null;
  const date = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function dayKey(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export function levelOf(count: number, max: number, thresholds?: readonly number[]): GithubCalendarLevel {
  if (!(count > 0)) return 0;
  if (thresholds?.length) {
    let level = 1;
    for (const cut of thresholds) if (count > cut) level++;
    return Math.min(4, level) as GithubCalendarLevel;
  }
  return Math.min(4, Math.max(1, Math.ceil((count / (max || 1)) * 4))) as GithubCalendarLevel;
}

/** Every day from the first to the last entry, gaps as 0, laid out in week columns. */
export function buildGrid(
  days: readonly GithubCalendarDay[],
  weekStart: GithubCalendarWeekStart,
  thresholds?: readonly number[],
): GithubCalendarGrid {
  const byKey = new Map<string, { date: Date; count: number; level?: GithubCalendarLevel }>();
  for (const day of days) {
    const date = toLocalDay(day.date);
    if (Number.isNaN(date.getTime())) continue;
    const key = dayKey(date);
    const prev = byKey.get(key);
    const count = (prev?.count ?? 0) + (Number.isFinite(day.count) ? day.count : 0);
    byKey.set(key, { date, count, level: day.level ?? prev?.level });
  }
  const sorted = [...byKey.values()].sort((a, b) => a.date.getTime() - b.date.getTime());
  const first = sorted[0]?.date;
  const last = sorted.at(-1)?.date;
  if (!first || !last) return { cells: [], weeks: 0, months: [], weekdays: [], total: 0 };

  const start = weekStart === "monday" ? 1 : 0;
  const lead = (first.getDay() - start + 7) % 7;
  const max = Math.max(0, ...sorted.map((d) => d.count));
  const cells: GithubCalendarCell[] = [];
  const months: { col: number; date: Date }[] = [];
  let total = 0;
  for (let d = new Date(first), i = 0; d <= last; d.setDate(d.getDate() + 1), i++) {
    const date = new Date(d);
    const key = dayKey(date);
    const entry = byKey.get(key);
    const count = entry?.count ?? 0;
    const offset = i + lead;
    const col = Math.floor(offset / 7);
    total += count;
    if (i === 0 || date.getDate() === 1) months.push({ col, date });
    cells.push({
      key,
      date,
      count,
      level: entry?.level ?? levelOf(count, max, thresholds),
      col,
      row: offset % 7,
    });
  }
  const weekdays = Array.from({ length: 7 }, (_, row) => {
    const date = new Date(first);
    date.setDate(date.getDate() - lead + row);
    return date;
  });
  // A label within two weeks of the next one would overlap it.
  const spaced = months.filter((m, i) => {
    const next = months[i + 1];
    return !next || next.col - m.col >= 3;
  });
  return { cells, weeks: (cells.at(-1)?.col ?? 0) + 1, months: spaced, weekdays, total };
}

/** Up and Down step a day, Left and Right a week; Home and End jump to either end. */
export function moveIndex(key: string, index: number, count: number): number | null {
  const clamp = (next: number) => (next < 0 || next >= count ? index : next);
  if (key === "ArrowUp") return clamp(index - 1);
  if (key === "ArrowDown") return clamp(index + 1);
  if (key === "ArrowLeft") return clamp(index - 7);
  if (key === "ArrowRight") return clamp(index + 7);
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return null;
}
