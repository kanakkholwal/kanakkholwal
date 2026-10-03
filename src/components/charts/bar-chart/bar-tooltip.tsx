"use client";

import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useActivePoint } from "@/components/charts/chart/frame";
import { ChartTooltipContent, ChartTooltipPanel } from "@/components/charts/chart/tooltip";
import { cn } from "@/lib/cn";
import { useBarChart } from "./bar-chart";
import { barChart } from "./variants";

export interface BarTooltipProps {
  /** Panel body; defaults to `<ChartTooltipContent />`. */
  content?: ReactNode;
  /** Soft band behind the hovered category. */
  cursor?: boolean;
  className?: string;
}

export function BarTooltip({ content, cursor = true, className }: BarTooltipProps) {
  const chart = useBarChart();
  const { instant } = useActivePoint();
  const styles = barChart({ orientation: chart.orientation });
  const index = chart.activeIndex;
  const vertical = chart.orientation === "vertical";
  const category = index === null ? null : chart.categories[index];
  const step = chart.band.step();
  const start = category === null || category === undefined ? 0 : (chart.band(category) ?? 0);
  const pad = (step - chart.band.bandwidth()) / 2;

  let anchor: { x: number; y: number } | null = null;
  if (index !== null && category !== undefined) {
    const rects = [...chart.displayed.values()].filter((d) => d.target.index === index && !d.target.hidden);
    const center = start + chart.band.bandwidth() / 2;
    if (vertical) {
      const top = Math.min(...rects.map((d) => d.rect.y), chart.innerHeight);
      anchor = { x: center + chart.margin.left, y: top + chart.margin.top };
    } else {
      const end = Math.max(...rects.map((d) => d.rect.x + d.rect.width), 0);
      anchor = { x: end + chart.margin.left, y: center + chart.margin.top };
    }
  }

  return (
    <>
      {cursor ? (
        <rect
          data-slot="bar-cursor"
          className={cn(styles.band(), "transition-opacity duration-(--duration-fast)")}
          x={vertical ? start - pad : 0}
          y={vertical ? 0 : start - pad}
          width={vertical ? step : chart.innerWidth}
          height={vertical ? chart.innerHeight : step}
          style={{ opacity: index === null ? 0 : 1 }}
        />
      ) : null}
      {chart.plotEl
        ? createPortal(
            <ChartTooltipPanel
              anchor={anchor}
              instant={instant}
              bounds={{ width: chart.width, height: chart.height }}
              className={className}
            >
              {content ?? <ChartTooltipContent />}
            </ChartTooltipPanel>,
            chart.plotEl,
          )
        : null}
    </>
  );
}
