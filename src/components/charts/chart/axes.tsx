"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { cn } from "@/lib/cn";
import { useChart } from "./chart";
import { evenTickIndices, fittedTicks, toDate, Y_TICK_GAP } from "./core";
import { useActivePoint, useCartesian } from "./frame";
import { CHART_DURATION, CHART_EASE_CSS, type Playback, prefersReducedMotion, tween } from "./motion";
import { usePlot } from "./time-series";
import { type ChartGridVariant, chartAxis, chartGrid } from "./variants";

const slide = `transform ${CHART_DURATION.update}ms ${CHART_EASE_CSS}`;

export interface CartesianGridProps {
  variant?: ChartGridVariant;
  horizontal?: boolean;
  vertical?: boolean;
  /** Tick-count hint for rows; d3 may return a nearby count. */
  rows?: number;
  columns?: number;
  /** Fade row ends into the plot edges. */
  fade?: boolean;
  /** Sweep a highlight band across the rows while the chart is loading. */
  shimmer?: boolean;
  className?: string;
}

const SHIMMER_LENGTH = 140;
const SHIMMER_CYCLE = 2200;

export function CartesianGrid({
  variant = "dashed",
  horizontal = true,
  vertical = false,
  rows = 5,
  columns = 10,
  fade = true,
  shimmer = true,
  className,
}: CartesianGridProps) {
  const { rowScale, columnScale, innerWidth, innerHeight, phase } = useCartesian();
  const maskId = `${useId().replace(/:/g, "")}-grid-fade`;
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const line = cn(chartGrid({ variant }), className);
  const shimmering = shimmer && horizontal && phase === "loading" && innerWidth > 0;

  useEffect(() => {
    if (!shimmering || prefersReducedMotion()) return;
    let playback: Playback | null = null;
    const cycle = () => {
      playback = tween({
        duration: SHIMMER_CYCLE,
        onUpdate: (p) => {
          const x = -SHIMMER_LENGTH + p * (innerWidth + SHIMMER_LENGTH * 2);
          gradientRef.current?.setAttribute("gradientTransform", `translate(${x}, 0)`);
        },
        onComplete: cycle,
      });
    };
    cycle();
    return () => playback?.stop();
  }, [shimmering, innerWidth]);

  const rowTicks = horizontal && rowScale ? fittedTicks(rowScale, rows, innerHeight, Y_TICK_GAP) : [];
  const rowLines = (stroke?: string) =>
    rowTicks.map((tick) => (
      <line
        key={String(tick)}
        className={line}
        stroke={stroke}
        x1={0}
        x2={innerWidth}
        y1={0}
        y2={0}
        style={{
          transform: `translateY(${rowScale?.(tick) ?? 0}px)`,
          transition: slide,
        }}
      />
    ));

  return (
    <g data-slot="chart-grid">
      <defs>
        {horizontal && fade ? (
          <>
            <linearGradient id={`${maskId}-g`} x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity={0} />
              <stop offset="10%" stopColor="white" stopOpacity={1} />
              <stop offset="90%" stopColor="white" stopOpacity={1} />
              <stop offset="100%" stopColor="white" stopOpacity={0} />
            </linearGradient>
            <mask id={maskId}>
              <rect width={innerWidth} height={innerHeight} fill={`url(#${maskId}-g)`} />
            </mask>
          </>
        ) : null}
        {shimmering ? (
          <linearGradient
            ref={gradientRef}
            id={`${maskId}-shimmer`}
            gradientUnits="userSpaceOnUse"
            x1={0}
            x2={SHIMMER_LENGTH}
            y1={0}
            y2={0}
            className="text-foreground/70"
          >
            <stop offset="0%" stopColor="currentColor" stopOpacity={0} />
            <stop offset="35%" stopColor="currentColor" stopOpacity={0.45} />
            <stop offset="50%" stopColor="currentColor" stopOpacity={1} />
            <stop offset="65%" stopColor="currentColor" stopOpacity={0.45} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        ) : null}
      </defs>
      {horizontal ? (
        <g mask={fade ? `url(#${maskId})` : undefined}>
          {rowLines()}
          {shimmering ? <g data-slot="chart-grid-shimmer">{rowLines(`url(#${maskId}-shimmer)`)}</g> : null}
        </g>
      ) : null}
      {vertical && columnScale
        ? columnScale.ticks(columns).map((tick) => {
            const x = columnScale(tick);
            return <line key={String(tick)} className={line} x1={x} x2={x} y1={0} y2={innerHeight} />;
          })
        : null}
    </g>
  );
}

export interface YAxisProps {
  /** Tick-count hint; d3 may return a nearby count. */
  tickCount?: number;
  tickFormatter?: (value: number) => string;
  orientation?: "left" | "right";
  tickLine?: boolean;
  className?: string;
}

export function YAxis({ tickCount = 5, tickFormatter, orientation = "left", tickLine = false, className }: YAxisProps) {
  const { format } = useChart();
  const { yScale, innerWidth, innerHeight } = usePlot();
  const styles = chartAxis({ tickLine });
  const left = orientation === "left";
  const ticks = fittedTicks(yScale, tickCount, innerHeight, Y_TICK_GAP);
  return (
    <g data-slot="chart-y-axis" className={className}>
      {ticks.map((tick) => (
        <g
          key={tick}
          style={{
            transform: `translate(${left ? 0 : innerWidth}px, ${yScale(tick)}px)`,
            transition: slide,
          }}
        >
          <line className={styles.line()} x1={left ? -4 : 0} x2={left ? 0 : 4} />
          <text
            className={styles.tick()}
            x={left ? -8 : 8}
            dominantBaseline="middle"
            textAnchor={left ? "end" : "start"}
          >
            {tickFormatter ? tickFormatter(tick) : format.compact(tick)}
          </text>
        </g>
      ))}
    </g>
  );
}

export interface XAxisProps {
  tickCount?: number;
  tickFormatter?: (date: Date) => string;
  tickLine?: boolean;
  /** Labels within this many px of the crosshair fade out so the date pill can read. */
  clearance?: number;
  className?: string;
}

export function XAxis({ tickCount = 5, tickFormatter, tickLine = false, clearance = 50, className }: XAxisProps) {
  const { data, xKey, x, labels, innerHeight, margin } = usePlot();
  const { active } = useActivePoint();
  const styles = chartAxis({ tickLine });
  const indices = useMemo(
    () =>
      evenTickIndices(
        data.length,
        tickCount,
        (i) => (data[i] ? x(data[i]) : i),
        (i) => labels[i] ?? "",
      ),
    [data, tickCount, x, labels],
  );
  const fadeBuffer = 20;
  return (
    <g data-slot="chart-x-axis" className={className}>
      {indices.map((index) => {
        const datum = data[index];
        if (!datum) return null;
        const px = x(datum);
        let opacity = 1;
        if (active) {
          const distance = Math.abs(px - active.x);
          if (distance < clearance || index === active.index) opacity = 0;
          else if (distance < clearance + fadeBuffer) opacity = (distance - clearance) / fadeBuffer;
        }
        const date = toDate(datum[xKey]);
        return (
          <g
            key={date.getTime()}
            style={{
              transform: `translate(${px}px, ${innerHeight}px)`,
              transition: slide,
            }}
          >
            <line className={styles.line()} y2={4} />
            <text
              className={styles.tick()}
              y={margin.bottom - 12}
              textAnchor="middle"
              style={{
                opacity,
                transition: "opacity 400ms cubic-bezier(0.42, 0, 0.58, 1)",
              }}
            >
              {tickFormatter ? tickFormatter(date) : labels[index]}
            </text>
          </g>
        );
      })}
    </g>
  );
}
