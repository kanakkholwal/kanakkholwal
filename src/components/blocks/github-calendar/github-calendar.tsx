"use client";

import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip/tooltip";
import { cn } from "@/lib/cn";
import {
  buildGrid,
  GITHUB_CALENDAR_LABELS,
  type GithubCalendarDay,
  type GithubCalendarLabels,
  type GithubCalendarLevel,
  type GithubCalendarWeekStart,
  moveIndex,
} from "./calendar";
import {
  type GithubCalendarShape,
  type GithubCalendarSize,
  type GithubCalendarTone,
  type GithubCalendarVariant,
  githubCalendar,
  TONE_FILL,
  WEEK_TRACK,
} from "./variants";

export type {
  GithubCalendarDay,
  GithubCalendarLabels,
  GithubCalendarLevel,
  GithubCalendarShape,
  GithubCalendarSize,
  GithubCalendarTone,
  GithubCalendarVariant,
  GithubCalendarWeekStart,
};

const LEVELS: GithubCalendarLevel[] = [0, 1, 2, 3, 4];

export interface GithubCalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "defaultValue" | "onChange"> {
  /** One entry per day; gaps between the first and last day render as 0. */
  days: GithubCalendarDay[];
  variant?: GithubCalendarVariant;
  shape?: GithubCalendarShape;
  size?: GithubCalendarSize;
  tone?: GithubCalendarTone;
  title?: string;
  showTotal?: boolean;
  showLegend?: boolean;
  weekStart?: GithubCalendarWeekStart;
  /** Upper bounds of levels 1 to 3; quarters of the busiest day when omitted. */
  thresholds?: number[];
  /** Selected day as `YYYY-MM-DD`. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  labels?: Partial<GithubCalendarLabels>;
  locale?: string;
}

export function GithubCalendar({
  days,
  variant = "default",
  shape = "rounded",
  size = "md",
  tone = "scale",
  title,
  showTotal = true,
  showLegend = true,
  weekStart = "sunday",
  thresholds,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  labels,
  locale,
  className,
  ...props
}: GithubCalendarProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internal;
  const l = { ...GITHUB_CALENDAR_LABELS, ...labels };
  const s = githubCalendar({ variant, shape, size, tone });
  const fills = TONE_FILL[tone];

  const grid = useMemo(() => buildGrid(days, weekStart, thresholds), [days, weekStart, thresholds]);
  const formats = useMemo(
    () => ({
      month: new Intl.DateTimeFormat(locale, { month: "short" }),
      weekday: new Intl.DateTimeFormat(locale, { weekday: "short" }),
      day: new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
      number: new Intl.NumberFormat(locale),
    }),
    [locale],
  );
  const selected = grid.cells.findIndex((c) => c.key === value);
  const tabStop = selected >= 0 ? selected : grid.cells.length - 1;

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  function select(next: string | null) {
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = moveIndex(event.key, tabStop, grid.cells.length);
    if (next === null) return;
    event.preventDefault();
    const cell = grid.cells[next];
    if (!cell) return;
    select(cell.key);
    scrollerRef.current?.querySelectorAll<HTMLElement>("[data-day]")[next]?.focus();
  }

  const describe = (count: number, date: Date) =>
    `${formats.number.format(count)} ${count === 1 ? l.contribution : l.contributions} ${l.on} ${formats.day.format(date)}`;

  return (
    <div data-slot="github-calendar" className={cn(s.root(), className)} {...props}>
      {title || showTotal ? (
        <div className={s.header()}>
          {title ? <span className={s.title()}>{title}</span> : <span />}
          {showTotal ? (
            <span className={s.total()}>
              {formats.number.format(grid.total)} {l.total}
            </span>
          ) : null}
        </div>
      ) : null}
      <div ref={scrollerRef} className={s.scroller()}>
        <TooltipProvider>
          <div
            role="toolbar"
            tabIndex={-1}
            aria-label={l.grid}
            onKeyDown={onKeyDown}
            className={s.grid()}
            style={{
              gridTemplateColumns: `auto repeat(${grid.weeks}, ${WEEK_TRACK[size]})`,
              gridTemplateRows: "auto repeat(7, auto)",
            }}
          >
            {grid.months.map((m) => (
              <span key={m.col} aria-hidden className={s.month()} style={{ gridColumn: m.col + 2, gridRow: 1 }}>
                {formats.month.format(m.date)}
              </span>
            ))}
            {grid.weekdays.map((d, row) =>
              row % 2 === 1 ? (
                <span key={d.getTime()} aria-hidden className={s.weekday()} style={{ gridColumn: 1, gridRow: row + 2 }}>
                  {formats.weekday.format(d)}
                </span>
              ) : null,
            )}
            {grid.cells.map((cell, i) => (
              <Tooltip key={cell.key} delay={100}>
                <TooltipTrigger
                  data-day=""
                  data-level={cell.level}
                  data-active={i === selected ? "" : undefined}
                  tabIndex={i === tabStop ? 0 : -1}
                  aria-label={describe(cell.count, cell.date)}
                  aria-pressed={i === selected}
                  onClick={() => select(i === selected ? null : cell.key)}
                  className={s.cell()}
                  style={
                    {
                      "--cell": fills[cell.level],
                      "--col": cell.col,
                      gridColumn: cell.col + 2,
                      gridRow: cell.row + 2,
                    } as CSSProperties
                  }
                />
                <TooltipContent>
                  <span className={s.tip()}>
                    <span className={s.tipCount()}>{formats.number.format(cell.count)}</span>
                    <span className={s.tipText()}>
                      {cell.count === 1 ? l.contribution : l.contributions} {l.on} {formats.day.format(cell.date)}
                    </span>
                  </span>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
      {showLegend ? (
        <div className={s.legend()} aria-hidden>
          <span className="mr-1">{l.less}</span>
          {LEVELS.map((level) => (
            <span key={level} className={s.swatch()} style={{ "--cell": fills[level] } as CSSProperties} />
          ))}
          <span className="ml-1">{l.more}</span>
        </div>
      ) : null}
    </div>
  );
}
