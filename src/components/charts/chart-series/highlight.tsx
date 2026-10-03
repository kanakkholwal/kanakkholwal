"use client";

import { useId, useLayoutEffect, useRef } from "react";
import { useActivePoint } from "@/components/charts/chart/frame";
import { CHART_SPRING, Spring } from "@/components/charts/chart/motion";
import { usePlot } from "@/components/charts/chart/time-series";
import { cn } from "@/lib/cn";
import { highlightBounds } from "./core";

/** Kernel spring that writes straight to the DOM; stops on unmount. */
export function useDomSpring(config: { stiffness: number; damping: number }, apply: (v: number) => void) {
  const applyRef = useRef(apply);
  applyRef.current = apply;
  const ref = useRef<Spring | null>(null);
  if (!ref.current) ref.current = new Spring(0, config, (v) => applyRef.current(v));
  useLayoutEffect(() => () => ref.current?.stop(), []);
  return ref.current;
}

export interface HighlightBandProps {
  /** The series path to re-stroke inside the band. */
  d: string;
  stroke: string;
  strokeWidth: number;
  className?: string;
}

/** Brightens the stroke one datum either side of the active point; the band rides a 180/28 spring. */
export function HighlightBand({ d, stroke, strokeWidth, className }: HighlightBandProps) {
  const { data, x, innerHeight, phase, selectionX } = usePlot();
  const { active, instant } = useActivePoint();
  const id = `${useId().replace(/:/g, "")}-highlight`;
  const rectRef = useRef<SVGRectElement>(null);
  const left = useDomSpring(CHART_SPRING.highlight, (v) => rectRef.current?.setAttribute("x", String(v)));
  const width = useDomSpring(CHART_SPRING.highlight, (v) =>
    rectRef.current?.setAttribute("width", String(Math.max(0, v))),
  );
  // A selected range takes over the band while dragging.
  const bounds =
    phase !== "ready"
      ? null
      : selectionX
        ? { x: selectionX[0], width: selectionX[1] - selectionX[0] }
        : active
          ? highlightBounds(data, active.index, x)
          : null;
  const shown = useRef(false);
  const bx = bounds?.x ?? null;
  const bw = bounds?.width ?? 0;
  useLayoutEffect(() => {
    if (bx === null) {
      shown.current = false;
      return;
    }
    if (!shown.current || instant) {
      left.jump(bx);
      width.jump(bw);
    } else {
      left.set(bx);
      width.set(bw);
    }
    shown.current = true;
  }, [bx, bw, instant, left, width]);

  if (!bounds) return null;
  return (
    <g data-slot="chart-highlight" className="pointer-events-none">
      <defs>
        <clipPath id={id}>
          <rect ref={rectRef} y={0} height={innerHeight} />
        </clipPath>
      </defs>
      <path
        d={d}
        clipPath={`url(#${id})`}
        stroke={stroke}
        strokeWidth={strokeWidth}
        className={cn(
          "fill-none opacity-100 transition-opacity duration-[400ms] ease-[cubic-bezier(0.42,0,0.58,1)] [stroke-linecap:round] starting:opacity-0",
          className,
        )}
      />
    </g>
  );
}
