"use client";

import { useChart } from "@/components/charts/chart/chart";
import { fittedTicks, X_TICK_GAP, Y_TICK_GAP } from "@/components/charts/chart/core";
import { CHART_DURATION, CHART_EASE_CSS } from "@/components/charts/chart/motion";
import { cn } from "@/lib/cn";
import { useBarChart } from "./bar-chart";
import { barChart } from "./variants";

const slide = `transform ${CHART_DURATION.update}ms ${CHART_EASE_CSS}`;

export interface BarAxisProps {
  /** Tick-count hint for the value axis; d3 may return a nearby count. */
  tickCount?: number;
  tickFormatter?: (value: number) => string;
  labelFormatter?: (category: string) => string;
  /** Most category labels shown before every nth one is skipped. */
  maxLabels?: number;
  className?: string;
}

/** Category labels run along the category axis; value ticks along the other. */
function useAxis(side: "x" | "y") {
  const chart = useBarChart();
  const categoryAxis = (chart.orientation === "vertical") === (side === "x");
  return { chart, categoryAxis };
}

function CategoryLabels({
  side,
  labelFormatter,
  maxLabels,
  className,
}: {
  side: "x" | "y";
  labelFormatter?: (category: string) => string;
  maxLabels: number;
  className?: string;
}) {
  const chart = useBarChart();
  const styles = barChart({ orientation: chart.orientation });
  const half = chart.band.bandwidth() / 2;
  const step = Math.ceil(chart.categories.length / maxLabels);
  return (
    <g data-slot={side === "x" ? "bar-x-axis" : "bar-y-axis"} className={className}>
      {chart.categories.map((category, i) => {
        if (i % step !== 0) return null;
        const pos = (chart.band(category) ?? 0) + half;
        const active = chart.activeIndex === i;
        const text = labelFormatter ? labelFormatter(category) : category;
        if (side === "x") {
          let opacity = 1;
          if (chart.activeIndex !== null) {
            const activePos = (chart.band(chart.categories[chart.activeIndex] ?? "") ?? 0) + half;
            const distance = Math.abs(pos - activePos);
            opacity = distance < 50 ? 0 : distance < 70 ? (distance - 50) / 20 : 1;
          }
          return (
            <text
              key={category}
              className={styles.category()}
              x={pos}
              y={chart.innerHeight + chart.margin.bottom - 12}
              style={{
                opacity,
                transition: "opacity 400ms cubic-bezier(0.42, 0, 0.58, 1)",
              }}
            >
              {text}
            </text>
          );
        }
        return (
          <text
            key={category}
            className={cn(styles.category(), active && "fill-foreground")}
            x={-8}
            y={pos}
            dominantBaseline="middle"
            style={{ opacity: active ? 1 : 0.7 }}
          >
            {text}
          </text>
        );
      })}
    </g>
  );
}

function ValueTicks({
  side,
  tickCount,
  tickFormatter,
  className,
}: {
  side: "x" | "y";
  tickCount: number;
  tickFormatter?: (value: number) => string;
  className?: string;
}) {
  const chart = useBarChart();
  const { format } = useChart();
  const styles = barChart({ orientation: chart.orientation });
  const [r0 = 0, r1 = 0] = chart.value.range();
  const ticks = fittedTicks(chart.value, tickCount, Math.abs(r1 - r0), side === "y" ? Y_TICK_GAP : X_TICK_GAP);
  return (
    <g data-slot={side === "x" ? "bar-x-axis" : "bar-y-axis"} className={className}>
      {ticks.map((tick) => {
        const pos = chart.value(tick);
        return (
          <text
            key={tick}
            className={styles.tick()}
            style={{
              transform:
                side === "y"
                  ? `translate(-8px, ${pos}px)`
                  : `translate(${pos}px, ${chart.innerHeight + chart.margin.bottom - 12}px)`,
              transition: slide,
            }}
            dominantBaseline={side === "y" ? "middle" : undefined}
          >
            {tickFormatter ? tickFormatter(tick) : format.compact(tick)}
          </text>
        );
      })}
    </g>
  );
}

export function BarXAxis({ tickCount = 5, tickFormatter, labelFormatter, maxLabels = 12, className }: BarAxisProps) {
  const { categoryAxis } = useAxis("x");
  return categoryAxis ? (
    <CategoryLabels side="x" labelFormatter={labelFormatter} maxLabels={maxLabels} className={className} />
  ) : (
    <ValueTicks side="x" tickCount={tickCount} tickFormatter={tickFormatter} className={className} />
  );
}

export function BarYAxis({ tickCount = 5, tickFormatter, labelFormatter, maxLabels = 20, className }: BarAxisProps) {
  const { categoryAxis } = useAxis("y");
  return categoryAxis ? (
    <CategoryLabels side="y" labelFormatter={labelFormatter} maxLabels={maxLabels} className={className} />
  ) : (
    <ValueTicks side="y" tickCount={tickCount} tickFormatter={tickFormatter} className={className} />
  );
}
