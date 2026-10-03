"use client";

import { type CSSProperties, type ReactNode, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { useChart } from "./chart";
import { type ActivePoint, type Datum, toDate } from "./core";
import { ActivePointProvider, useActivePoint } from "./frame";
import { CHART_SPRING, Spring, type SpringConfig } from "./motion";
import { usePlot } from "./time-series";
import { type ChartTooltipIndicator, chartTooltip } from "./variants";

const TICKER_ROW = 24;
const COMPACT_TICKER = 60;
const BOX_OFFSET = 16;

/** One spring per value; `apply` writes straight to the DOM so following the cursor never re-renders. */
function useSpring(config: SpringConfig, apply: (value: number) => void) {
  const applyRef = useRef(apply);
  applyRef.current = apply;
  const ref = useRef<Spring | null>(null);
  if (!ref.current) ref.current = new Spring(0, config, (v) => applyRef.current(v));
  useLayoutEffect(() => () => ref.current?.stop(), []);
  return ref.current;
}

/** Jumps on first show and for keyboard moves; springs otherwise. */
function useFollow(spring: Spring, target: number | null, instant: boolean) {
  const shown = useRef(false);
  useLayoutEffect(() => {
    if (target === null) {
      shown.current = false;
      return;
    }
    if (!shown.current || instant) spring.jump(target);
    else spring.set(target);
    shown.current = true;
  }, [spring, target, instant]);
}

function Crosshair({ active, instant }: { active: ActivePoint | null; instant: boolean }) {
  const { innerHeight } = usePlot();
  const gradientId = `${useId().replace(/:/g, "")}-crosshair`;
  const rectRef = useRef<SVGRectElement>(null);
  const spring = useSpring(CHART_SPRING.tooltip, (v) => rectRef.current?.setAttribute("x", String(v - 0.5)));
  useFollow(spring, active?.x ?? null, instant);
  if (!active) return null;
  return (
    <g data-slot="chart-cursor" className="pointer-events-none text-muted-foreground">
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0} />
          <stop offset="10%" stopColor="currentColor" stopOpacity={1} />
          <stop offset="90%" stopColor="currentColor" stopOpacity={1} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect ref={rectRef} width={1} height={innerHeight} fill={`url(#${gradientId})`} />
    </g>
  );
}

function Dot({ color, x, y, instant }: { color: string; x: number | null; y: number | null; instant: boolean }) {
  const ref = useRef<SVGCircleElement>(null);
  const sx = useSpring(CHART_SPRING.tooltip, (v) => ref.current?.setAttribute("cx", String(v)));
  const sy = useSpring(CHART_SPRING.tooltip, (v) => ref.current?.setAttribute("cy", String(v)));
  useFollow(sx, x, instant);
  useFollow(sy, y, instant);
  if (x === null || y === null) return null;
  return <circle ref={ref} r={5} fill={color} className="stroke-background" strokeWidth={2} />;
}

function DatePill({ active, instant }: { active: ActivePoint | null; instant: boolean }) {
  const { data, xKey, labels, margin } = usePlot();
  const { format } = useChart();
  const styles = chartTooltip();
  const pillRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const left = useSpring(CHART_SPRING.tooltip, (v) => {
    if (pillRef.current) pillRef.current.style.left = `${v}px`;
  });
  const translate = (el: HTMLDivElement | null) => (v: number) => {
    if (el) el.style.transform = `translateY(${v}px)`;
  };
  const day = useSpring(CHART_SPRING.ticker, (v) => translate(dayRef.current)(v));
  const month = useSpring(CHART_SPRING.ticker, (v) => translate(monthRef.current)(v));

  const compact = data.length > COMPACT_TICKER;
  const { days, months, monthOf } = useMemo(() => {
    const dates = data.map((d) => toDate(d[xKey]));
    const segments: { key: string; label: string }[] = [];
    const owner: number[] = [];
    dates.forEach((date, i) => {
      const label = format.month(date);
      if (segments.at(-1)?.label !== label) segments.push({ key: `${label}-${i}`, label });
      owner.push(segments.length - 1);
    });
    return {
      days: dates.map((date) => format.day(date)),
      months: segments,
      monthOf: owner,
    };
  }, [data, xKey, format]);

  useFollow(left, active ? active.x + margin.left : null, instant);
  const shown = useRef(false);
  useLayoutEffect(() => {
    if (!active || compact) {
      shown.current = false;
      return;
    }
    const dayTarget = -active.index * TICKER_ROW;
    const monthTarget = -(monthOf[active.index] ?? 0) * TICKER_ROW;
    if (!shown.current) {
      day.jump(0);
      month.jump(0);
    }
    if (instant) {
      day.jump(dayTarget);
      month.jump(monthTarget);
    } else {
      day.set(dayTarget);
      month.set(monthTarget);
    }
    shown.current = true;
  }, [active, instant, compact, monthOf, day, month]);

  if (!active) return null;
  return (
    <div
      ref={pillRef}
      data-slot="chart-date-pill"
      aria-hidden="true"
      className="-translate-x-1/2 absolute bottom-1 z-20"
    >
      <div className={styles.pill()}>
        {compact ? (
          <span className="whitespace-nowrap">{labels[active.index]}</span>
        ) : (
          <div className="flex h-6 items-start gap-1 overflow-hidden">
            <div ref={monthRef} className="flex flex-col">
              {months.map((m) => (
                <span key={m.key} className="flex h-6 items-center whitespace-nowrap">
                  {m.label}
                </span>
              ))}
            </div>
            <div ref={dayRef} className="flex flex-col">
              {days.map((d, i) => (
                <span key={i} className="flex h-6 items-center justify-center tabular-nums">
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export interface ChartTooltipPanelProps {
  /** Point the panel sits beside, in plot-element pixels; null hides it. */
  anchor: { x: number; y: number } | null;
  instant: boolean;
  /** Plot size, so the panel flips and clamps inside it. */
  bounds: { width: number; height: number };
  className?: string;
  children: ReactNode;
}

/** The floating panel: 100/20 follow spring, and a 300/25 entrance that replays on every flip. */
export function ChartTooltipPanel({ anchor, instant, bounds, className, children }: ChartTooltipPanelProps) {
  const activeContext = useActivePoint();
  const outerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ w: 180, h: 80 });
  const [flipped, setFlipped] = useState(false);
  const lastActive = useRef<ActivePoint | null>(null);
  if (activeContext.active) lastActive.current = activeContext.active;
  const left = useSpring(CHART_SPRING.tooltipBox, (v) => {
    if (outerRef.current) outerRef.current.style.left = `${v}px`;
  });
  const top = useSpring(CHART_SPRING.tooltipBox, (v) => {
    if (outerRef.current) outerRef.current.style.top = `${v}px`;
  });
  const entrance = useSpring(CHART_SPRING.panel, (p) => {
    const panel = panelRef.current;
    if (!panel) return;
    const offset = (1 - p) * (panel.dataset.flipped === "true" ? 20 : -20);
    panel.style.transform = `translateX(${offset}px) scale(${0.85 + 0.15 * p})`;
    panel.style.opacity = String(Math.min(1, Math.max(0, p)));
  });

  const ax = anchor?.x ?? null;
  const ay = anchor?.y ?? 0;
  const shown = useRef(false);
  useLayoutEffect(() => {
    if (ax === null) {
      shown.current = false;
      return;
    }
    const el = outerRef.current;
    if (el) sizeRef.current = { w: el.offsetWidth || 180, h: el.offsetHeight || 80 };
    const { w, h } = sizeRef.current;
    const flip = ax + w + BOX_OFFSET > bounds.width;
    const tx = flip ? ax - BOX_OFFSET - w : ax + BOX_OFFSET;
    const ty = Math.max(BOX_OFFSET, Math.min(ay - h / 2, bounds.height - h - BOX_OFFSET));
    if (!shown.current || instant) {
      left.jump(tx);
      top.jump(ty);
    } else {
      left.set(tx);
      top.set(ty);
    }
    if (!shown.current || flip !== flipped) {
      if (panelRef.current) panelRef.current.dataset.flipped = String(flip);
      entrance.jump(0);
      entrance.set(1);
      if (flip !== flipped) setFlipped(flip);
    }
    shown.current = true;
  }, [ax, ay, instant, bounds.width, bounds.height, flipped, left, top, entrance]);

  return (
    <div
      ref={outerRef}
      data-slot="chart-tooltip"
      data-open={anchor ? "" : undefined}
      aria-hidden="true"
      className="pointer-events-none absolute z-30 opacity-0 transition-opacity duration-[var(--duration-exit)] ease-[var(--ease-out)] data-open:opacity-100 data-open:duration-(--duration-instant)"
    >
      <div
        ref={panelRef}
        className={cn(chartTooltip().panel(), className)}
        style={{ transformOrigin: flipped ? "right top" : "left top" }}
      >
        <ActivePointProvider value={{ ...activeContext, active: activeContext.active ?? lastActive.current }}>
          {children}
        </ActivePointProvider>
      </div>
    </div>
  );
}

export interface ChartTooltipContentProps {
  indicator?: ChartTooltipIndicator;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  /** Read the title from this key instead of the chart's own label for the datum. */
  labelKey?: string;
  labelFormatter?: (label: string, datum: Datum) => ReactNode;
  formatter?: (value: number, key: string, datum: Datum) => ReactNode;
  className?: string;
}

export function ChartTooltipContent({
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  labelKey,
  labelFormatter,
  formatter,
  className,
}: ChartTooltipContentProps) {
  const { config, format } = useChart();
  const { active, title, rows } = useActivePoint();
  if (!active) return null;
  const styles = chartTooltip({ indicator });
  const label = labelKey ? String(active.datum[labelKey] ?? "") : title(active.datum);
  return (
    <div className={className}>
      {hideLabel ? null : (
        <div className={styles.title()}>{labelFormatter ? labelFormatter(label, active.datum) : label}</div>
      )}
      <div className={styles.rows()}>
        {rows(active.datum).map((row) => {
          const Icon = config[row.key]?.icon;
          return (
            <div key={row.key} className={styles.row()}>
              {Icon ? (
                <Icon />
              ) : hideIndicator ? null : (
                <span className={styles.indicator()} style={{ "--indicator": row.color } as CSSProperties} />
              )}
              <span className={styles.label()}>{row.label}</span>
              {row.value !== null ? (
                <span className={styles.value()}>
                  {formatter ? formatter(row.value, row.key, active.datum) : format.number(row.value)}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface ChartTooltipProps {
  /** Panel body; defaults to `<ChartTooltipContent />`. */
  content?: ReactNode;
  /** Vertical crosshair that follows the active point. */
  cursor?: boolean;
  dots?: boolean;
  /** Date ticker pinned under the crosshair. */
  datePill?: boolean;
  className?: string;
}

export function ChartTooltip({ content, cursor = true, dots = true, datePill = true, className }: ChartTooltipProps) {
  const { plotEl, series, width, height, margin } = usePlot();
  const { active, instant } = useActivePoint();
  return (
    <>
      {cursor ? <Crosshair active={active} instant={instant} /> : null}
      {dots
        ? series.map((s) => (
            <Dot
              key={s.key}
              color={s.color}
              x={active ? active.x : null}
              y={active ? (active.y[s.key] ?? null) : null}
              instant={instant}
            />
          ))
        : null}
      {plotEl
        ? createPortal(
            <>
              <ChartTooltipPanel
                anchor={active ? { x: active.x + margin.left, y: margin.top } : null}
                instant={instant}
                bounds={{ width, height }}
                className={className}
              >
                {content ?? <ChartTooltipContent />}
              </ChartTooltipPanel>
              {datePill ? <DatePill active={active} instant={instant} /> : null}
            </>,
            plotEl,
          )
        : null}
    </>
  );
}
