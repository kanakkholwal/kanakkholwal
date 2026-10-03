"use client";

import type { CurveFactory } from "d3-shape";
import { area as d3Area } from "d3-shape";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { type ChartPhase, fadeStops, linePath } from "@/components/charts/chart/core";
import { useCartesian } from "@/components/charts/chart/frame";
import { CHART_EASE_CSS, type Playback, prefersReducedMotion, tween } from "@/components/charts/chart/motion";
import { cn } from "@/lib/cn";
import {
  PULSE_CLIP_PAD,
  PULSE_CYCLE,
  PULSE_PAUSE,
  pulseClip,
  pulseExitPlan,
  pulseSkeleton,
  SWEEP_CYCLE,
  SWEEP_EXIT,
  skeletonHeights,
  sweepStops,
} from "./core";
import { seriesLoading } from "./variants";

type Mode = "loop" | "exit" | null;

/** Loops while loading; once status flips it exits from its current progress, then unmounts. */
function useLoadingMode(phase: ChartPhase): { mode: Mode; finish: () => void } {
  const wasLoading = useRef(phase === "loading");
  const [finished, setFinished] = useState(false);
  if (phase === "loading" && !wasLoading.current) wasLoading.current = true;
  if (phase === "loading" && finished) setFinished(false);
  const exiting = phase === "gridTweenReady" || phase === "revealing";
  const mode: Mode = phase === "loading" ? "loop" : exiting && wasLoading.current && !finished ? "exit" : null;
  return {
    mode,
    finish: () => {
      wasLoading.current = false;
      setFinished(true);
    },
  };
}

function silhouette(
  values: number[],
  innerWidth: number,
  innerHeight: number,
): { key: string; x: number; y: number }[] {
  return values.map((v, i) => ({
    key: String(i),
    x: (i / Math.max(1, values.length - 1)) * innerWidth,
    y: innerHeight * (1 - v),
  }));
}

export interface LoadingPulseProps {
  curve: CurveFactory;
  strokeWidth?: number;
  className?: string;
}

/** A travelling pulse: one 2.2s eased sweep over a placeholder line, 280ms apart. */
export function LoadingPulse({ curve, strokeWidth = 2.5, className }: LoadingPulseProps) {
  const { innerWidth, innerHeight, phase } = useCartesian();
  const { mode, finish } = useLoadingMode(phase);
  const id = useId().replace(/:/g, "");
  const rectRef = useRef<SVGRectElement>(null);
  const progress = useRef(0);
  const finishRef = useRef(finish);
  finishRef.current = finish;

  useEffect(() => {
    if (!mode || innerWidth <= 0) return;
    const draw = (p: number) => {
      progress.current = p;
      const clip = pulseClip(p, innerWidth);
      rectRef.current?.setAttribute("x", String(clip.x));
      rectRef.current?.setAttribute("width", String(clip.width));
    };
    if (prefersReducedMotion()) {
      draw(0.5);
      if (mode === "exit") finishRef.current();
      return;
    }
    let playback: Playback | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (mode === "loop") {
      const cycle = () => {
        playback = tween({
          duration: PULSE_CYCLE,
          onUpdate: draw,
          onComplete: () => {
            timer = setTimeout(cycle, PULSE_PAUSE);
          },
        });
      };
      cycle();
    } else {
      const from = progress.current;
      const plan = pulseExitPlan(from);
      const shrink = () => {
        const start = Math.max(progress.current, 0.5);
        playback = tween({
          duration: plan.shrink,
          onUpdate: (t) => draw(start + (1 - start) * t),
          onComplete: () => finishRef.current(),
        });
      };
      if (plan.grow > 0) {
        playback = tween({
          duration: plan.grow,
          onUpdate: (t) => draw(from + (0.5 - from) * t),
          onComplete: shrink,
        });
      } else shrink();
    }
    return () => {
      playback?.stop();
      clearTimeout(timer);
    };
  }, [mode, innerWidth]);

  const d = useMemo(
    () => linePath(silhouette(pulseSkeleton(), innerWidth, innerHeight), curve),
    [innerWidth, innerHeight, curve],
  );
  if (!mode || innerWidth <= 0) return null;
  return (
    <g data-slot="chart-loading-pulse" className={cn(seriesLoading({ style: "pulse" }), className)}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect
            ref={rectRef}
            x={-PULSE_CLIP_PAD}
            y={-PULSE_CLIP_PAD}
            width={0}
            height={innerHeight + PULSE_CLIP_PAD * 2}
          />
        </clipPath>
        <linearGradient id={`${id}-fade`} gradientUnits="userSpaceOnUse" x1={0} x2={innerWidth} y1={0} y2={0}>
          {fadeStops(true).map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor="currentColor" stopOpacity={stop.opacity} />
          ))}
        </linearGradient>
      </defs>
      <path d={d} clipPath={`url(#${id}-clip)`} stroke={`url(#${id}-fade)`} strokeWidth={strokeWidth} />
    </g>
  );
}

export interface LoadingSweepProps {
  curve: CurveFactory;
  /** Fill the silhouette as an area, for area charts. */
  withArea?: boolean;
  strokeWidth?: number;
  pointCount?: number;
  className?: string;
}

/** The sweep: a 25 degree shimmer band crosses a seeded silhouette that re-rolls between passes. */
export function LoadingSweep({
  curve,
  withArea = false,
  strokeWidth = 2,
  pointCount = 14,
  className,
}: LoadingSweepProps) {
  const { innerWidth, innerHeight, phase } = useCartesian();
  const { mode, finish } = useLoadingMode(phase);
  const id = useId().replace(/:/g, "");
  const bandRef = useRef<SVGRectElement>(null);
  const [seed, setSeed] = useState(0);
  const [reduced, setReduced] = useState(false);
  const looping = mode === "loop";

  useEffect(() => {
    setReduced(prefersReducedMotion());
    if (!looping || prefersReducedMotion()) return;
    let playback: Playback | null = null;
    let last = -1;
    const cycle = () => {
      playback = tween({
        duration: SWEEP_CYCLE,
        ease: (t) => t,
        onUpdate: (t) => {
          const x = -1 + t * 3;
          bandRef.current?.setAttribute("x", String(x));
          if (x >= 1 && last < 1) setSeed((s) => s + 1);
          last = x;
        },
        onComplete: () => {
          last = -1;
          cycle();
        },
      });
    };
    cycle();
    return () => playback?.stop();
  }, [looping]);

  useEffect(() => {
    if (mode === "exit" && prefersReducedMotion()) finish();
  }, [mode, finish]);

  const points = useMemo(
    () => silhouette(skeletonHeights(pointCount, seed), innerWidth, innerHeight),
    [pointCount, seed, innerWidth, innerHeight],
  );
  const stops = useMemo(() => sweepStops(), []);
  if (!mode || innerWidth <= 0) return null;
  const areaPath =
    d3Area<{ x: number; y: number }>()
      .x((p) => p.x)
      .y0(innerHeight)
      .y1((p) => p.y)
      .curve(curve)(points) ?? "";
  const body = (
    <>
      {withArea ? <path d={areaPath} fill={`url(#${id}-area)`} stroke="none" /> : null}
      <path d={linePath(points, curve)} strokeWidth={strokeWidth} stroke="currentColor" />
    </>
  );
  return (
    <g
      data-slot="chart-loading-sweep"
      className={cn(seriesLoading({ style: "sweep" }), className)}
      style={{
        opacity: mode === "exit" ? 0 : 1,
        transition: `opacity ${SWEEP_EXIT}ms ${CHART_EASE_CSS}`,
      }}
      onTransitionEnd={() => mode === "exit" && finish()}
    >
      <defs>
        {withArea ? (
          <linearGradient id={`${id}-area`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.18} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0.02} />
          </linearGradient>
        ) : null}
        <linearGradient id={`${id}-band`} x1="0" x2="1" y1="0" y2="0">
          {stops.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor="white" stopOpacity={stop.opacity} />
          ))}
        </linearGradient>
        <pattern
          id={`${id}-pattern`}
          width={3}
          height={1}
          x={0}
          y={0}
          patternUnits="objectBoundingBox"
          patternContentUnits="objectBoundingBox"
          patternTransform="rotate(25)"
        >
          <rect ref={bandRef} x={-1} y={0} width={1} height={1} fill={`url(#${id}-band)`} />
        </pattern>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse">
          <rect width={innerWidth} height={innerHeight} fill={`url(#${id}-pattern)`} />
        </mask>
      </defs>
      {reduced ? body : <g mask={`url(#${id}-mask)`}>{body}</g>}
    </g>
  );
}
