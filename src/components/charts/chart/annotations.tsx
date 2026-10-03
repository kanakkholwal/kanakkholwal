"use client";

import { useId, useRef } from "react";
import { cn } from "@/lib/cn";
import type { ChartPhase } from "./core";
import { useCartesian } from "./frame";
import { usePlot } from "./time-series";
import {
  type ChartBackgroundVariant,
  type ChartReferenceTone,
  type ChartSelectionEdge,
  chartBackground,
  chartReferenceArea,
  chartSelection,
} from "./variants";

/** Bands show from the grid retween on, so they settle with the series. */
const bandVisible = (phase: ChartPhase) => phase === "ready" || phase === "revealing" || phase === "gridTweenReady";

export interface ReferenceAreaProps {
  /** Value range in data units; either end defaults to the plot edge. */
  y1?: number;
  y2?: number;
  /** Category or date range on the x axis; either end defaults to the plot edge. */
  x1?: unknown;
  x2?: unknown;
  label?: string;
  tone?: ChartReferenceTone;
  /** Dashed rules on the band's value edges. */
  edges?: boolean;
  className?: string;
}

export function ReferenceArea({ y1, y2, x1, x2, label, tone = "muted", edges = true, className }: ReferenceAreaProps) {
  const { rowScale, columnScale, innerWidth, innerHeight, phase } = useCartesian();
  const styles = chartReferenceArea({ tone });
  const toY = (v: number | undefined, edge: number) => (v === undefined || !rowScale ? edge : rowScale(v));
  const toX = (v: unknown, edge: number) => (v === undefined || !columnScale ? edge : columnScale(v));
  const top = Math.max(0, Math.min(toY(y1, 0), toY(y2, 0)));
  const bottom = Math.min(innerHeight, Math.max(toY(y1, innerHeight), toY(y2, innerHeight)));
  const left = Math.max(0, Math.min(toX(x1, 0), toX(x2, 0)));
  const right = Math.min(innerWidth, Math.max(toX(x1, innerWidth), toX(x2, innerWidth)));
  if (!(bottom > top && right > left)) return null;
  return (
    <g
      data-slot="chart-reference-area"
      className={cn(styles.area(), className)}
      style={{ opacity: bandVisible(phase) ? 1 : 0 }}
    >
      <rect x={left} y={top} width={right - left} height={bottom - top} />
      {edges && y2 !== undefined ? <line className={styles.edge()} x1={left} x2={right} y1={top} y2={top} /> : null}
      {edges && y1 !== undefined ? (
        <line className={styles.edge()} x1={left} x2={right} y1={bottom} y2={bottom} />
      ) : null}
      {label ? (
        <text className={styles.label()} x={right - 6} y={top + 14} textAnchor="end">
          {label}
        </text>
      ) : null}
    </g>
  );
}

export interface BackgroundProps {
  variant?: ChartBackgroundVariant;
  className?: string;
}

export function Background({ variant = "dots", className }: BackgroundProps) {
  const { innerWidth, innerHeight, phase } = useCartesian();
  const id = `${useId().replace(/:/g, "")}-bg`;
  return (
    <g
      data-slot="chart-background"
      className={cn(chartBackground({ variant }), className)}
      style={{ opacity: phase === "ready" || phase === "revealing" ? 1 : 0 }}
    >
      <defs>
        {variant === "gradient" ? (
          <linearGradient id={id} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity={1} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        ) : (
          <pattern id={id} width={12} height={12} patternUnits="userSpaceOnUse">
            {variant === "dots" ? <circle cx={6} cy={6} r={1} fill="currentColor" /> : null}
            {variant === "lines" ? <path d="M0 12 12 0" stroke="currentColor" strokeWidth={1} /> : null}
            {variant === "grid" ? <path d="M12 0H0V12" fill="none" stroke="currentColor" strokeWidth={1} /> : null}
          </pattern>
        )}
      </defs>
      <rect width={innerWidth} height={innerHeight} fill={`url(#${id})`} />
    </g>
  );
}

export interface SelectionAreaProps {
  edge?: ChartSelectionEdge;
  className?: string;
}

/** The dragged or Shift+Arrow range; fades in and out over 150ms. */
export function SelectionArea({ edge = "dashed", className }: SelectionAreaProps) {
  const { selectionX, innerHeight } = usePlot();
  const last = useRef<[number, number] | null>(null);
  if (selectionX) last.current = selectionX;
  const shown = last.current;
  const styles = chartSelection({ edge });
  if (!shown) return null;
  const [x0, x1] = shown;
  return (
    <g data-slot="chart-selection" className={cn(styles.root(), className)} style={{ opacity: selectionX ? 1 : 0 }}>
      <rect className={styles.area()} x={x0} width={x1 - x0} height={innerHeight} />
      <line className={styles.edge()} x1={x0} x2={x0} y2={innerHeight} />
      <line className={styles.edge()} x1={x1} x2={x1} y2={innerHeight} />
    </g>
  );
}
