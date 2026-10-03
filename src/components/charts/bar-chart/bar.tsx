"use client";

import { type CSSProperties, useId, useLayoutEffect, useRef } from "react";
import { useChart } from "@/components/charts/chart/chart";
import { seriesColor } from "@/components/charts/chart/core";
import { CHART_EASE, type Playback, prefersReducedMotion, tween } from "@/components/charts/chart/motion";
import { cn } from "@/lib/cn";
import { type DisplayedBar, useBarChart, useBarRegistration } from "./bar-chart";
import {
  depthFaces,
  EASE_IN_OUT,
  ENTER_MS,
  PULSE_MS,
  pulseRect,
  type Rect,
  squareColumn,
  squareDelay,
} from "./bar-core";
import { type BarLineCap, barChart } from "./variants";

export interface BarProps {
  dataKey: string;
  /** Defaults to the series colour from the chart config, `var(--color-<dataKey>)`. */
  fill?: string;
  lineCap?: BarLineCap;
  /** Hatch the bars (45° or 135° by series order) so series read without colour. */
  texture?: boolean;
  className?: string;
}

const SQUARE_RADIUS = 0.25;

export function Bar({ dataKey, fill, lineCap = "round", texture = false, className }: BarProps) {
  const chart = useBarChart();
  const { highlighted } = useChart();
  const color = fill ?? seriesColor(dataKey);
  useBarRegistration(dataKey, color);
  const uid = useId().replace(/:/g, "");
  const vertical = chart.orientation === "vertical";
  const styles = barChart({
    orientation: chart.orientation,
    variant: chart.variant,
    lineCap,
    entrance: chart.entrance,
  });
  const seriesIndex = Math.max(
    0,
    chart.series.findIndex((s) => s.key === dataKey),
  );
  const bars = [...chart.displayed.values()].filter((d) => d.target.series === dataKey);
  const base = chart.value(0);

  return (
    <g data-slot="chart-bar" data-series={dataKey}>
      <defs>
        {texture ? (
          <pattern
            id={`${uid}-hatch`}
            width={6}
            height={6}
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(${seriesIndex % 2 === 0 ? 45 : 135})`}
          >
            <path d="M0 0V6" className="stroke-background/60" strokeWidth={1.5} />
          </pattern>
        ) : null}
        {chart.variant === "depth" ? (
          <linearGradient id={`${uid}-glass`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity={0.2} />
            <stop offset="30%" stopColor="white" stopOpacity={0} />
            <stop offset="100%" stopColor="black" stopOpacity={0.12} />
          </linearGradient>
        ) : null}
      </defs>
      {bars.map((d) => {
        const dimmed =
          (chart.activeIndex !== null && d.target.index !== chart.activeIndex) ||
          (highlighted !== null && highlighted !== dataKey);
        const fade = chart.entrance === "fade" ? d.progress : 1;
        const style: CSSProperties = {
          opacity: (dimmed ? 0.3 : 1) * fade,
          filter: fade < 1 ? `blur(${(1 - fade) * 2}px)` : undefined,
        };
        const thickness = vertical ? d.rect.width : d.rect.height;
        const radius = lineCap === "round" && d.target.cap ? Math.min(thickness / 2, 8) : 0;
        return (
          <g key={d.target.key} className={cn(styles.bar(), className)} style={style}>
            {chart.variant === "squares" ? (
              <Squares d={d} vertical={vertical} color={color} />
            ) : chart.variant === "depth" ? (
              <Depth
                d={d}
                color={color}
                glass={`url(#${uid}-glass)`}
                base={base}
                pulse={chart.activeIndex === d.target.index}
                side={styles.side()}
                lid={styles.lid()}
              />
            ) : (
              <rect
                x={d.rect.x}
                y={d.rect.y}
                width={Math.max(0, d.rect.width)}
                height={Math.max(0, d.rect.height)}
                rx={radius}
                fill={color}
              />
            )}
            {texture && chart.variant !== "squares" ? (
              <rect
                x={d.rect.x}
                y={d.rect.y}
                width={Math.max(0, d.rect.width)}
                height={Math.max(0, d.rect.height)}
                rx={radius}
                fill={`url(#${uid}-hatch)`}
              />
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

/** Bar squares: cells cascade bottom to top over 40% of the entrance. */
function Squares({ d, vertical, color }: { d: DisplayedBar; vertical: boolean; color: string }) {
  const size = vertical ? d.rect.width : d.rect.height;
  const length = vertical ? d.rect.height : d.rect.width;
  const cells = squareColumn(length, size);
  const negative = d.target.value < 0;
  const rx = size * SQUARE_RADIUS;
  return (
    <>
      {cells.map((offset, j) => {
        const p =
          d.elapsed === null
            ? 1
            : CHART_EASE(Math.min(1, Math.max(0, (d.elapsed - squareDelay(j, cells.length)) / ENTER_MS)));
        const grown = size * p;
        let cell: Rect;
        if (vertical) {
          const edge = negative ? d.rect.y + offset : d.rect.y + d.rect.height - offset;
          cell = {
            x: d.rect.x,
            y: negative ? edge : edge - grown,
            width: size,
            height: grown,
          };
        } else {
          const edge = negative ? d.rect.x + d.rect.width - offset : d.rect.x + offset;
          cell = {
            x: negative ? edge - grown : edge,
            y: d.rect.y,
            width: grown,
            height: size,
          };
        }
        return (
          <rect
            key={j}
            x={cell.x}
            y={cell.y}
            width={Math.max(0, cell.width)}
            height={Math.max(0, cell.height)}
            rx={rx}
            fill={color}
          />
        );
      })}
    </>
  );
}

function Depth({
  d,
  color,
  glass,
  base,
  pulse,
  side,
  lid,
}: {
  d: DisplayedBar;
  color: string;
  glass: string;
  base: number;
  pulse: boolean;
  side: string;
  lid: string;
}) {
  const chart = useBarChart();
  const vertical = chart.orientation === "vertical";
  const axis = { orientation: chart.orientation, negative: d.target.value < 0, base };
  const faces = depthFaces(d.rect, {
    ...axis,
    center: (vertical ? chart.innerWidth : chart.innerHeight) / 2,
    step: chart.band.step(),
    bandwidth: chart.band.bandwidth(),
  });
  const front = faces?.front ?? d.rect;
  return (
    <>
      {faces ? <path d={faces.side} fill={color} className={side} /> : null}
      <rect x={front.x} y={front.y} width={Math.max(0, front.width)} height={Math.max(0, front.height)} fill={color} />
      <rect x={front.x} y={front.y} width={Math.max(0, front.width)} height={Math.max(0, front.height)} fill={glass} />
      {faces ? <path d={faces.lid} fill={color} className={lid} /> : null}
      {pulse && front.height > 0 && front.width > 0 ? <PulseWave rect={front} axis={axis} /> : null}
    </>
  );
}

/** A white band sweeps base to tip every 2.4s, ease-in-out, clipped to the bar. */
function PulseWave({ rect, axis }: { rect: Rect; axis: Parameters<typeof pulseRect>[1] }) {
  const uid = useId().replace(/:/g, "");
  const waveRef = useRef<SVGRectElement>(null);
  const latest = useRef({ rect, axis });
  latest.current = { rect, axis };
  const start = pulseRect(rect, axis, 0);
  const vertical = axis.orientation === "vertical";
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    let playback: Playback | null = null;
    const cycle = () => {
      playback = tween({
        duration: PULSE_MS,
        ease: EASE_IN_OUT,
        onUpdate: (p) => {
          const wave = pulseRect(latest.current.rect, latest.current.axis, p);
          waveRef.current?.setAttribute("x", String(wave.x));
          waveRef.current?.setAttribute("y", String(wave.y));
        },
        onComplete: cycle,
      });
    };
    cycle();
    return () => playback?.stop();
  }, []);
  return (
    <g data-slot="bar-pulse">
      <defs>
        <clipPath id={`${uid}-clip`}>
          <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} />
        </clipPath>
        <linearGradient id={`${uid}-wave`} x1="0" y1="0" x2={vertical ? "0" : "1"} y2={vertical ? "1" : "0"}>
          <stop offset="0%" stopColor="white" stopOpacity={0} />
          <stop offset="50%" stopColor="white" stopOpacity={0.85} />
          <stop offset="100%" stopColor="white" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect
        ref={waveRef}
        clipPath={`url(#${uid}-clip)`}
        x={start.x}
        y={start.y}
        width={start.width}
        height={start.height}
        fill={`url(#${uid}-wave)`}
      />
    </g>
  );
}
