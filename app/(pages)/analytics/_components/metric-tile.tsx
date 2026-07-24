"use client";

import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import { AreaSpark } from "./area-spark";
import { CountUp } from "./count-up";
import { growth, percent } from "./utils";

type Props = {
  label: string;
  value: number;
  previous: number;
  series?: number[];
  color?: string;
  format?: (n: number) => string;
  spark?: boolean;
  className?: string;
};

export function MetricTile({
  label,
  value,
  previous,
  series,
  color = "var(--chart-1)",
  format,
  spark = true,
  className,
}: Props) {
  const g = growth(value, previous);
  const up = g.trend >= 0;
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm transition-colors hover:border-border/70",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
            up ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500",
          )}
        >
          {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
          {percent(g.percent)}
        </span>
      </div>

      <div className="mt-3 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
        <CountUp value={value} format={format} />
      </div>

      {spark && series && series.length > 1 && (
        <div className="-mb-1 mt-3" style={{ color }}>
          <AreaSpark data={series} height={40} strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}
