import { Badge } from "@/components/ui/badge/badge";
import { cn } from "@/lib/cn";
import { formatChange, NPM_STATS_LABELS, type PeriodChange } from "./core";
import { npmStats } from "./variants";

export interface TrendBadgeProps {
  change: PeriodChange;
  /** Read out after the value when no visible label says what it's measured against. */
  srCompare?: string;
  locale?: string;
  /** Text when the prior period was empty. */
  newLabel?: string;
  className?: string;
}

/** Signed percent with an arrow, so direction never reads from colour alone. */
export function TrendBadge({
  change,
  srCompare,
  locale,
  newLabel = NPM_STATS_LABELS.newLabel,
  className,
}: TrendBadgeProps) {
  const styles = npmStats();
  const { ratio } = change;
  const direction = ratio === null || ratio === 0 ? "flat" : ratio > 0 ? "up" : "down";
  return (
    <Badge
      size="sm"
      variant={direction === "up" ? "success" : direction === "down" ? "destructive" : "secondary"}
      className={cn(styles.trend(), className)}
    >
      <svg
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path
          d={
            direction === "up"
              ? "M6 9.5v-7M3 5.5l3-3 3 3"
              : direction === "down"
                ? "M6 2.5v7M3 6.5l3 3 3-3"
                : "M2.5 6h7"
          }
        />
      </svg>
      {ratio === null ? newLabel : formatChange(ratio, locale)}
      {srCompare ? <span className="sr-only"> {srCompare}</span> : null}
    </Badge>
  );
}
