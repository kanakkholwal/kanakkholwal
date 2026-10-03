"use client";

import { type CSSProperties, useId } from "react";
import { useCartesian } from "@/components/charts/chart/frame";
import { cn } from "@/lib/cn";

const PAD = 10;

export interface DashTailProps {
  d: string;
  /** Plot x where the stroke turns dashed, e.g. the start of an incomplete period. */
  fromX: number;
  stroke: string;
  strokeWidth: number;
  className?: string;
  style?: CSSProperties;
}

/** The same path twice, clipped either side of `fromX`: solid before, dashed after. */
export function DashTail({ d, fromX, stroke, strokeWidth, className, style }: DashTailProps) {
  const { innerWidth, innerHeight } = useCartesian();
  const id = useId().replace(/:/g, "");
  const height = innerHeight + PAD * 2;
  return (
    <g data-slot="chart-dash-tail" className={className} style={style}>
      <defs>
        <clipPath id={`${id}-solid`}>
          <rect x={-PAD} y={-PAD} width={Math.max(0, fromX + PAD)} height={height} />
        </clipPath>
        <clipPath id={`${id}-dash`}>
          <rect x={fromX} y={-PAD} width={Math.max(0, innerWidth - fromX + PAD)} height={height} />
        </clipPath>
      </defs>
      <path
        d={d}
        clipPath={`url(#${id}-solid)`}
        stroke={stroke}
        strokeWidth={strokeWidth}
        className="fill-none [stroke-linecap:round]"
      />
      <path
        data-slot="chart-dash-tail-dashed"
        d={d}
        clipPath={`url(#${id}-dash)`}
        stroke={stroke}
        strokeWidth={strokeWidth}
        className={cn("fill-none [stroke-dasharray:6_4]")}
      />
    </g>
  );
}
