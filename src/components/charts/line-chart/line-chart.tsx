"use client";

import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useChart } from "@/components/charts/chart/chart";
import {
  type FadeEdges,
  fadeStops,
  interpolatePoints,
  linePath,
  type PathPoint,
  seriesColor,
  seriesPoints,
  seriesVisibleInPhase,
  toDate,
} from "@/components/charts/chart/core";
import { useActivePoint } from "@/components/charts/chart/frame";
import { CHART_DURATION, tween } from "@/components/charts/chart/motion";
import { TimeSeriesChart, type TimeSeriesChartProps, usePlot } from "@/components/charts/chart/time-series";
import { splitAtBaseline } from "@/components/charts/chart-series/core";
import { DashTail } from "@/components/charts/chart-series/dash-tail";
import { HighlightBand } from "@/components/charts/chart-series/highlight";
import { LoadingPulse, LoadingSweep } from "@/components/charts/chart-series/loading";
import { SeriesMarkers, TerminalMarker } from "@/components/charts/chart-series/markers";
import type { SeriesLoadingStyle, SeriesMarkerAppearance } from "@/components/charts/chart-series/variants";
import { cn } from "@/lib/cn";
import { LINE_CURVES, type LineCurve, type LineVariant, line, type ProfitLossEncoding, profitLoss } from "./variants";

export interface LineChartProps extends TimeSeriesChartProps {
  /** Announced after the chart's name, e.g. "line chart". */
  roleDescription?: string;
}

export function LineChart({ roleDescription = "line chart", ...props }: LineChartProps) {
  return <TimeSeriesChart roleDescription={roleDescription} {...props} />;
}

export interface LineProps {
  dataKey: string;
  /** Defaults to the series colour from the chart config, `var(--color-<dataKey>)`. */
  stroke?: string;
  strokeWidth?: number;
  curve?: LineCurve;
  variant?: LineVariant;
  /** Fade the stroke into the plot edges. */
  fadeEdges?: FadeEdges;
  /** Brighten the stroke around the active point. */
  showHighlight?: boolean;
  showMarkers?: boolean;
  markerAppearance?: SeriesMarkerAppearance;
  /** Hollow ring on the last datum. */
  terminalMarker?: boolean;
  /** Data index from which the stroke turns dashed, e.g. an incomplete period. */
  dashFromIndex?: number;
  loadingStyle?: SeriesLoadingStyle;
  /** Set false to hide the loading visual while the chart loads. */
  loading?: boolean;
  className?: string;
}

/** Morphs point by point when data, width or x-domain change; y-domain moves come from the plot. */
function useMorphedPoints(dataKey: string) {
  const { data, x, xKey, xScale, yScale, innerWidth, phase, animate } = usePlot();
  const target = useMemo(
    () => seriesPoints(data, dataKey, x, (v) => yScale(v), xKey),
    [data, dataKey, x, yScale, xKey],
  );
  const signature = `${innerWidth}|${xScale.domain().map(Number).join(",")}|${data
    .map((d) => `${toDate(d[xKey]).getTime()}:${String(d[dataKey])}`)
    .join(",")}`;
  const [progress, setProgress] = useState(1);
  const from = useRef<PathPoint[]>([]);
  const shown = useRef<PathPoint[]>(target);
  const prevSignature = useRef(signature);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  useLayoutEffect(() => {
    if (prevSignature.current === signature) return;
    prevSignature.current = signature;
    if (phaseRef.current !== "ready" || !animate) {
      setProgress(1);
      return;
    }
    from.current = shown.current;
    setProgress(0);
    const playback = tween({ duration: CHART_DURATION.update, onUpdate: setProgress });
    return () => playback.stop();
  }, [signature, animate]);
  const points = progress >= 1 ? target : interpolatePoints(from.current, target, progress);
  shown.current = points;
  return points;
}

export function Line({
  dataKey,
  stroke,
  strokeWidth = 2.5,
  curve = "natural",
  variant = "solid",
  fadeEdges = true,
  showHighlight = true,
  showMarkers = false,
  markerAppearance = "ring",
  terminalMarker = false,
  dashFromIndex,
  loadingStyle = "pulse",
  loading = true,
  className,
}: LineProps) {
  const { register, data, x, series, innerWidth, phase, clipId, selection } = usePlot();
  const { active } = useActivePoint();
  const { hidden, highlighted } = useChart();
  const gradientId = `${useId().replace(/:/g, "")}-line`;
  const color = stroke ?? seriesColor(dataKey);

  useLayoutEffect(() => register({ key: dataKey, color }), [register, dataKey, color]);

  const points = useMorphedPoints(dataKey);
  const curveFactory = LINE_CURVES[curve];
  const d = linePath(points, curveFactory);
  const isHidden = hidden.has(dataKey);
  const dimmed = active !== null || Boolean(selection) || (highlighted !== null && highlighted !== dataKey);
  const drawn = seriesVisibleInPhase(phase);
  const fade = fadeEdges !== false;
  const paint = drawn ? (fade ? `url(#${gradientId})` : color) : "transparent";
  const opacity = isHidden ? 0 : dimmed ? 0.3 : 1;
  const dashDatum =
    dashFromIndex !== undefined && dashFromIndex >= 0 && dashFromIndex < data.length - 1
      ? data[dashFromIndex]
      : undefined;
  const leads = series[0]?.key === dataKey;
  const lineClass = cn(line({ curve, variant }), className);

  return (
    <g data-slot="chart-line" data-series={dataKey}>
      <g clipPath={`url(#${clipId})`}>
        {fade ? (
          <defs>
            <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={0} x2={innerWidth} y1={0} y2={0}>
              {fadeStops(fadeEdges).map((stop) => (
                <stop key={stop.offset} offset={stop.offset} stopColor={color} stopOpacity={stop.opacity} />
              ))}
            </linearGradient>
          </defs>
        ) : null}
        {dashDatum ? (
          <DashTail
            d={d}
            fromX={x(dashDatum)}
            stroke={paint}
            strokeWidth={strokeWidth}
            className={lineClass}
            style={{ opacity }}
          />
        ) : (
          <path d={d} className={lineClass} stroke={paint} strokeWidth={strokeWidth} style={{ opacity }} />
        )}
      </g>
      {showHighlight && !isHidden ? <HighlightBand d={d} stroke={color} strokeWidth={strokeWidth} /> : null}
      {showMarkers ? <SeriesMarkers dataKey={dataKey} color={color} appearance={markerAppearance} /> : null}
      {terminalMarker ? <TerminalMarker dataKey={dataKey} color={color} /> : null}
      {loading && leads && loadingStyle === "sweep" ? <LoadingSweep curve={curveFactory} /> : null}
      {loading && leads && loadingStyle === "pulse" ? <LoadingPulse curve={curveFactory} /> : null}
    </g>
  );
}

export interface ProfitLossLineProps {
  dataKey: string;
  /** Values at or above this sit on the positive side. */
  baseline?: number;
  curve?: LineCurve;
  strokeWidth?: number;
  /** How the negative side differs beyond colour. */
  encoding?: ProfitLossEncoding;
  className?: string;
}

/** One series split at the baseline: positive and negative runs in their own tokens and dash. */
export function ProfitLossLine({
  dataKey,
  baseline = 0,
  curve = "linear",
  strokeWidth = 2.5,
  encoding = "dashed",
  className,
}: ProfitLossLineProps) {
  const { register, data, x, yScale, phase, clipId } = usePlot();
  const { active } = useActivePoint();
  const { hidden } = useChart();

  useLayoutEffect(() => register({ key: dataKey, color: "var(--chart-positive)" }), [register, dataKey]);

  const segments = useMemo(() => {
    const values = data.flatMap((datum) => {
      const value = datum[dataKey];
      return typeof value === "number" ? [{ x: x(datum), value }] : [];
    });
    return splitAtBaseline(values, baseline, (v) => yScale(v));
  }, [data, dataKey, x, yScale, baseline]);

  const activeValue = active?.datum[dataKey];
  const focus = typeof activeValue === "number" ? activeValue >= baseline : null;
  const drawn = seriesVisibleInPhase(phase);
  const styles = profitLoss({ encoding });
  if (hidden.has(dataKey)) return null;
  return (
    <g data-slot="chart-profit-loss" data-series={dataKey} clipPath={`url(#${clipId})`} className={className}>
      {segments.map((segment, i) => (
        <path
          key={`${i}-${segment.positive}`}
          data-sign={segment.positive ? "positive" : "negative"}
          d={linePath(
            segment.points.map((p, j) => ({ key: String(j), ...p })),
            LINE_CURVES[curve],
          )}
          className={cn(styles.segment(), segment.positive ? styles.positive() : styles.negative())}
          strokeWidth={strokeWidth}
          style={{
            visibility: drawn ? "visible" : "hidden",
            opacity: focus !== null && focus !== segment.positive ? 0.25 : 1,
          }}
        />
      ))}
    </g>
  );
}
