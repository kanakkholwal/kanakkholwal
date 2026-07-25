"use client";

import { cn } from "@/lib/utils";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { AnalyticsBreakdownItem } from "~/lib/analytics/types";
import { compact } from "./utils";

type Props = {
  title: string;
  items: AnalyticsBreakdownItem[];
  color?: string;
  className?: string;
};

export function BarList({ title, items, color = "var(--chart-1)", className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div
      ref={ref}
      className={cn("rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm", className)}
    >
      <h3 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item, i) => {
          const w = `${(item.value / max) * 100}%`;
          return (
            <div
              key={item.label}
              className="relative flex items-center justify-between overflow-hidden rounded-md"
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-md"
                style={{ background: color, opacity: 0.14 }}
                initial={{ width: reduce ? w : 0 }}
                animate={inView ? { width: w } : {}}
                transition={{ duration: 0.7, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="relative z-10 truncate px-2.5 py-1.5 text-xs text-foreground">
                {item.label}
              </span>
              <span className="relative z-10 px-2.5 py-1.5 text-xs font-medium tabular-nums text-muted-foreground">
                {compact(item.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
