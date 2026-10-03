import { cn } from "@/lib/cn";

export interface NpmSparklineProps {
  values: number[];
  className?: string;
}

const W = 100;
const H = 24;
const PAD = 2;

/** Shape only, scaled min to max: the number it summarises sits beside it. */
export function NpmSparkline({ values, className }: NpmSparklineProps) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const step = values.length > 1 ? W / (values.length - 1) : 0;
  const points = values
    .map((v, i) => `${(i * step).toFixed(2)},${(PAD + (1 - (v - min) / span) * (H - PAD * 2)).toFixed(2)}`)
    .join(" ");
  return (
    <svg
      data-slot="npm-sparkline"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={cn("spark-reveal overflow-visible", className)}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
