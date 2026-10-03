"use client";

import type { CSSProperties } from "react";
import { useChart } from "@/components/charts/chart/chart";
import { useActivePoint } from "@/components/charts/chart/frame";
import { CHART_EASE_CSS } from "@/components/charts/chart/motion";
import { usePlot } from "@/components/charts/chart/time-series";
import { cn } from "@/lib/cn";
import { MARKER_ENTER, REVEAL_DURATION } from "./core";
import { type SeriesMarkerAppearance, seriesMarker } from "./variants";

const RING_GAP = 2;
const RING_WIDTH = 2;

function MarkerShape({
  color,
  radius,
  appearance,
}: {
  color: string;
  radius: number;
  appearance: SeriesMarkerAppearance;
}) {
  const styles = seriesMarker({ appearance });
  const hollow = appearance === "hollow";
  return (
    <>
      <circle
        className={styles.dot()}
        r={radius}
        fill={hollow ? undefined : color}
        stroke={hollow ? color : undefined}
        strokeWidth={hollow ? RING_WIDTH : undefined}
      />
      <circle
        className={styles.ring()}
        r={radius + RING_GAP + RING_WIDTH / 2}
        stroke={color}
        strokeWidth={RING_WIDTH}
      />
    </>
  );
}

export interface SeriesMarkersProps {
  dataKey: string;
  color: string;
  appearance?: SeriesMarkerAppearance;
  radius?: number;
  /** Dim and blur the other points while one is active. */
  fadeOnHover?: boolean;
  className?: string;
}

/** One marker per datum; they fade in with the reveal edge, so the delay follows x. */
export function SeriesMarkers({
  dataKey,
  color,
  appearance = "ring",
  radius = 5,
  fadeOnHover = true,
  className,
}: SeriesMarkersProps) {
  const { data, x, yScale, innerWidth, phase } = usePlot();
  const { active } = useActivePoint();
  const { hidden, highlighted } = useChart();
  const styles = seriesMarker({ appearance });
  const extent = radius + RING_GAP + RING_WIDTH;
  const shown = phase === "revealing" || phase === "ready" || phase === "concealing";
  const points = data.flatMap((datum, index) => {
    const value = datum[dataKey];
    if (typeof value !== "number") return [];
    const cx = x(datum);
    const delay = innerWidth > 0 ? (Math.max(0, cx - extent) / innerWidth) * REVEAL_DURATION : 0;
    return [{ index, cx, cy: yScale(value), delay }];
  });
  const dim = fadeOnHover && (active !== null || (highlighted !== null && highlighted !== dataKey));
  const activePoint = active ? points.find((p) => p.index === active.index) : undefined;
  if (hidden.has(dataKey)) return null;
  return (
    <g data-slot="chart-series-markers" data-series={dataKey} className={className}>
      <g className={styles.layer()} style={{ opacity: dim ? 0.5 : 1, filter: dim ? "blur(2px)" : "none" }}>
        {points.map((p) => (
          <g
            key={p.index}
            transform={`translate(${p.cx}, ${p.cy})`}
            className={cn(
              "starting:opacity-0 starting:blur-[2px]",
              shown ? "opacity-100 blur-none" : "opacity-0 blur-[2px]",
            )}
            style={
              {
                transition: `opacity ${MARKER_ENTER}ms ${CHART_EASE_CSS} ${p.delay}ms, filter ${MARKER_ENTER}ms ${CHART_EASE_CSS} ${p.delay}ms`,
              } as CSSProperties
            }
          >
            <MarkerShape color={color} radius={radius} appearance={appearance} />
          </g>
        ))}
      </g>
      {activePoint && fadeOnHover ? (
        <g
          data-slot="chart-series-marker-active"
          transform={`translate(${activePoint.cx}, ${activePoint.cy}) scale(1.35)`}
        >
          <MarkerShape color={color} radius={radius} appearance={appearance} />
        </g>
      ) : null}
    </g>
  );
}

export interface TerminalMarkerProps {
  dataKey: string;
  color: string;
  radius?: number;
  className?: string;
}

/** Hollow ring on the last datum; scales from 0.55, never from zero. */
export function TerminalMarker({ dataKey, color, radius = 5, className }: TerminalMarkerProps) {
  const { data, x, yScale, phase } = usePlot();
  const { hidden } = useChart();
  const last = data.at(-1);
  const value = last?.[dataKey];
  if (!last || typeof value !== "number" || hidden.has(dataKey)) return null;
  const visible = phase === "ready" || phase === "concealing";
  return (
    <g transform={`translate(${x(last)}, ${yScale(value)})`}>
      <circle
        data-slot="chart-terminal-marker"
        r={radius}
        stroke={color}
        strokeWidth={1.5}
        className={cn(
          "fill-background transition-[opacity,scale] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-box:fill-box] [transform-origin:center] starting:scale-[0.55] starting:opacity-0",
          visible ? "scale-100 opacity-100" : "scale-[0.55] opacity-0",
          className,
        )}
      />
    </g>
  );
}
