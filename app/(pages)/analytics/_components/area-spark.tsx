"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

type Props = {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  strokeWidth?: number;
  fill?: boolean;
  animate?: boolean;
  interactive?: boolean;
  formatValue?: (n: number) => string;
  className?: string;
};

const VBW = 100;
const VBH = 100;
const PAD = 6;

function buildPath(data: number[]) {
  const n = data.length;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const span = max - min || 1;
  const px = (i: number) => (n === 1 ? VBW / 2 : (i / (n - 1)) * VBW);
  const py = (v: number) => PAD + (1 - (v - min) / span) * (VBH - PAD * 2);
  const pts = data.map((v, i) => [px(i), py(v)] as const);

  let line = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    line += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return { line, pts };
}

export function AreaSpark({
  data,
  labels,
  color = "var(--chart-1)",
  height = 220,
  strokeWidth = 2,
  fill = true,
  animate: doDraw = true,
  interactive = false,
  formatValue = (n) => `${Math.round(n)}`,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const safe = data.length ? data : [0, 0];
  const { line, pts } = React.useMemo(() => buildPath(safe), [safe]);
  const area = `${line} L ${VBW},${VBH - PAD} L 0,${VBH - PAD} Z`;
  const gid = React.useId().replace(/:/g, "");
  const [active, setActive] = React.useState<number | null>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const enabled = doDraw && !reduce;

  const onMove = (e: React.PointerEvent) => {
    if (!interactive || !wrapRef.current || safe.length < 2) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setActive(Math.round(ratio * (safe.length - 1)));
  };

  const leftOf = (i: number) => `${(i / (safe.length - 1)) * 100}%`;

  return (
    <div
      ref={wrapRef}
      className={cn("relative w-full select-none", className)}
      style={{ color, height }}
      onPointerMove={onMove}
      onPointerLeave={() => setActive(null)}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VBW} ${VBH}`}
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`spark-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.26} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>

        {fill && (
          <motion.path
            d={area}
            fill={`url(#spark-${gid})`}
            stroke="none"
            initial={enabled ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          />
        )}

        <motion.path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={enabled ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      {interactive && active !== null && pts[active] && (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 w-px bg-border"
            style={{ left: leftOf(active) }}
          />
          <div
            className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background"
            style={{ left: leftOf(active), top: `${pts[active][1]}%`, background: "currentColor" }}
          />
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[140%] whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 font-mono text-[10px] shadow-md"
            style={{ left: leftOf(active), top: `${pts[active][1]}%` }}
          >
            <span className="font-semibold text-foreground">{formatValue(safe[active])}</span>
            {labels?.[active] && <span className="ml-1 text-muted-foreground">{labels[active]}</span>}
          </div>
        </>
      )}
    </div>
  );
}
