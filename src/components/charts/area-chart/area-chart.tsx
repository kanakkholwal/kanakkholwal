"use client";

import { createContext, useCallback, useContext, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useChart } from "@/components/charts/chart/chart";
import {
  type FadeEdges,
  fadeStops,
  interpolatePoints,
  linePath,
  seriesColor,
  seriesVisibleInPhase,
} from "@/components/charts/chart/core";
import { useActivePoint } from "@/components/charts/chart/frame";
import { CHART_DURATION, tween } from "@/components/charts/chart/motion";
import {
  TimeSeriesChart,
  type TimeSeriesChartProps,
  useExtentRegistry,
  usePlot,
} from "@/components/charts/chart/time-series";
import { HighlightBand } from "@/components/charts/chart-series/highlight";
import { LoadingPulse, LoadingSweep } from "@/components/charts/chart-series/loading";
import { SeriesMarkers } from "@/components/charts/chart-series/markers";
import type { SeriesLoadingStyle } from "@/components/charts/chart-series/variants";
import { LINE_CURVES, type LineCurve } from "@/components/charts/line-chart/variants";
import { cn } from "@/lib/cn";
import { areaPath, type Band, bandPoints, bandSignature, stackMax } from "./geometry";
import { type AreaVariant, area } from "./variants";

interface StackContextValue {
  stacked: boolean;
  keys: string[];
  register: (key: string) => () => void;
}

const StackContext = createContext<StackContextValue>({
  stacked: false,
  keys: [],
  register: () => () => {},
});

export interface AreaChartProps extends TimeSeriesChartProps {
  /** Stack areas in the order they render; the domain grows to the tallest total. */
  stacked?: boolean;
  /** Announced after the chart's name, e.g. "area chart". */
  roleDescription?: string;
}

export function AreaChart({ stacked = false, roleDescription = "area chart", ...props }: AreaChartProps) {
  const [keys, setKeys] = useState<string[]>([]);
  const register = useCallback((key: string) => {
    setKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
    return () => setKeys((prev) => prev.filter((k) => k !== key));
  }, []);
  const value = useMemo(() => ({ stacked, keys, register }), [stacked, keys, register]);
  return (
    <StackContext.Provider value={value}>
      <TimeSeriesChart roleDescription={roleDescription} {...props} />
    </StackContext.Provider>
  );
}

export interface AreaProps {
  dataKey: string;
  /** Defaults to the series colour from the chart config, `var(--color-<dataKey>)`. */
  color?: string;
  variant?: AreaVariant;
  curve?: LineCurve;
  /** Stroke the top edge. */
  line?: boolean;
  strokeWidth?: number;
  /** Top opacity of the gradient and solid fills. */
  fillOpacity?: number;
  /** Fade the area into the plot edges. */
  fadeEdges?: FadeEdges;
  showHighlight?: boolean;
  /** Point markers; ignored when stacked since they mark raw values. */
  showMarkers?: boolean;
  loadingStyle?: SeriesLoadingStyle;
  /** Set false to hide the loading visual while the chart loads. */
  loading?: boolean;
  className?: string;
}

/** Top and bottom edges morph together over 500ms when data, width or stacking change. */
function useMorphedBand(target: Band, signature: string): Band {
  const { phase, animate } = usePlot();
  const [progress, setProgress] = useState(1);
  const from = useRef<Band>({ top: [], bottom: [] });
  const shown = useRef<Band>(target);
  const prev = useRef(signature);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  useLayoutEffect(() => {
    if (prev.current === signature) return;
    prev.current = signature;
    if (phaseRef.current !== "ready" || !animate) {
      setProgress(1);
      return;
    }
    from.current = shown.current;
    setProgress(0);
    const playback = tween({ duration: CHART_DURATION.update, onUpdate: setProgress });
    return () => playback.stop();
  }, [signature, animate]);
  // The render that first sees new data holds the old shape; the layout effect starts the morph.
  const pending = prev.current !== signature && phase === "ready" && animate;
  const band = pending
    ? shown.current
    : progress >= 1
      ? target
      : {
          top: interpolatePoints(from.current.top, target.top, progress),
          bottom: interpolatePoints(from.current.bottom, target.bottom, progress),
        };
  if (!pending) shown.current = band;
  return band;
}

export function Area({
  dataKey,
  color: colorProp,
  variant = "gradient",
  curve = "natural",
  line = true,
  strokeWidth = 2,
  fillOpacity = 0.4,
  fadeEdges = false,
  showHighlight = true,
  showMarkers = false,
  loadingStyle = "pulse",
  loading = true,
  className,
}: AreaProps) {
  const plot = usePlot();
  const { register, data, x, xKey, xScale, yScale, series, innerWidth, phase, clipId } = plot;
  const stack = useContext(StackContext);
  const registerExtent = useExtentRegistry();
  const { active } = useActivePoint();
  const { hidden, highlighted } = useChart();
  const uid = useId().replace(/:/g, "");
  const color = colorProp ?? seriesColor(dataKey);

  useLayoutEffect(() => register({ key: dataKey, color }), [register, dataKey, color]);
  useLayoutEffect(() => stack.register(dataKey), [stack.register, dataKey]);

  const below = useMemo(() => {
    if (!stack.stacked) return [];
    const visible = stack.keys.filter((k) => !hidden.has(k));
    return visible.slice(0, Math.max(0, visible.indexOf(dataKey)));
  }, [stack.stacked, stack.keys, hidden, dataKey]);

  const top = useMemo(
    () => (stack.stacked && !hidden.has(dataKey) ? stackMax(data, dataKey, below) : 0),
    [stack.stacked, hidden, data, dataKey, below],
  );
  useLayoutEffect(() => {
    if (!top) return;
    return registerExtent(`${uid}-stack`, { y: [0, top] });
  }, [registerExtent, uid, top]);

  const [d0, d1] = yScale.domain() as [number, number];
  const floor = yScale(Math.min(Math.max(0, d0), d1));
  const target = useMemo(
    () => bandPoints({ data, key: dataKey, below, xKey, x, y: (v) => yScale(v), floor }),
    [data, dataKey, below, xKey, x, yScale, floor],
  );
  const signature = `${bandSignature(data, [dataKey, ...below], xKey, innerWidth)}|${xScale
    .domain()
    .map(Number)
    .join(",")}`;
  const band = useMorphedBand(target, signature);
  const curveFactory = LINE_CURVES[curve];
  const fillPath = areaPath(band, curveFactory);
  const topPath = linePath(band.top, curveFactory);

  const isHidden = hidden.has(dataKey);
  const dimmed = active !== null || Boolean(plot.selection) || (highlighted !== null && highlighted !== dataKey);
  const drawn = seriesVisibleInPhase(phase);
  const styles = area({ variant });
  const fade = fadeEdges !== false;
  const leads = series[0]?.key === dataKey;
  const fill = variant === "pattern" ? `url(#${uid}-pattern)` : variant === "gradient" ? `url(#${uid}-fill)` : color;

  return (
    <g data-slot="chart-area" data-series={dataKey} data-variant={variant}>
      <g
        clipPath={`url(#${clipId})`}
        className={cn(styles.layer(), className)}
        style={{ opacity: isHidden ? 0 : dimmed ? 0.6 : 1 }}
        mask={fade ? `url(#${uid}-fade)` : undefined}
      >
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          <pattern
            id={`${uid}-pattern`}
            width={6}
            height={6}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width={6} height={6} fill={color} fillOpacity={fillOpacity * 0.35} />
            <line x1={0} x2={0} y1={0} y2={6} stroke={color} strokeWidth={1.5} />
          </pattern>
          {fade ? (
            <>
              <linearGradient id={`${uid}-fade-g`} gradientUnits="userSpaceOnUse" x1={0} x2={innerWidth} y1={0} y2={0}>
                {fadeStops(fadeEdges).map((stop) => (
                  <stop key={stop.offset} offset={stop.offset} stopColor="white" stopOpacity={stop.opacity} />
                ))}
              </linearGradient>
              <mask id={`${uid}-fade`}>
                <rect
                  x={-8}
                  y={-8}
                  width={innerWidth + 16}
                  height={plot.innerHeight + 16}
                  fill={`url(#${uid}-fade-g)`}
                />
              </mask>
            </>
          ) : null}
        </defs>
        <path d={fillPath} className={styles.fill()} fill={drawn ? fill : "transparent"} />
        {line ? (
          <path
            d={topPath}
            className={styles.stroke()}
            stroke={drawn ? color : "transparent"}
            strokeWidth={strokeWidth}
          />
        ) : null}
      </g>
      {showHighlight && line && !isHidden ? (
        <HighlightBand d={topPath} stroke={color} strokeWidth={strokeWidth} />
      ) : null}
      {showMarkers && !stack.stacked ? <SeriesMarkers dataKey={dataKey} color={color} /> : null}
      {loading && leads && loadingStyle === "sweep" ? <LoadingSweep curve={curveFactory} withArea /> : null}
      {loading && leads && loadingStyle === "pulse" ? <LoadingPulse curve={curveFactory} /> : null}
    </g>
  );
}
