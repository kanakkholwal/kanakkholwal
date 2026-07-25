"use client";

import { cn } from "@/lib/utils";
import { RANGES, type RangeKey } from "~/lib/analytics/types";

type Props = {
  value: RangeKey;
  onChange: (key: RangeKey) => void;
  className?: string;
};

export function RangeTabs({ value, onChange, className }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Date range"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-background/60 p-0.5 backdrop-blur-md",
        className,
      )}
    >
      {RANGES.map((r) => {
        const active = value === r.key;
        return (
          <button
            key={r.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(r.key)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium tabular-nums transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {r.short}
          </button>
        );
      })}
    </div>
  );
}
