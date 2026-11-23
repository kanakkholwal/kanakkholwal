import type { ReactNode } from "react";
import { Icon, type IconType } from "@/components/icons";
import { IconChip } from "@/components/stats/icon-chip";
import { RollingDigits } from "@/components/text/rolling-digits";
import { cn } from "@/lib/cn";

/** Change vs the previous period, coloured by direction. */
export function Delta({
  percent,
  className,
  vs = "vs previous period",
}: {
  percent: number;
  className?: string;
  vs?: string;
}) {
  const rounded = Math.round(percent);
  const dir = rounded > 0 ? "up" : rounded < 0 ? "down" : "flat";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs tabular-nums",
        dir === "up" && "bg-success/10 text-success",
        dir === "down" && "bg-destructive/10 text-destructive",
        dir === "flat" && "bg-foreground/[0.05] text-muted-foreground",
        className,
      )}
    >
      {dir === "flat" ? null : <Icon name={dir === "up" ? "arrow-up-right" : "arrow-down-right"} className="size-3" />}
      {Math.abs(rounded)}%
      <span className="sr-only">
        {" "}
        {dir === "flat" ? "no change" : dir} {vs}
      </span>
    </span>
  );
}

/** One bento cell on the same raised-tile recipe as `Well`. */
export function Tile({
  icon,
  label,
  aside,
  children,
  className,
}: {
  icon: IconType;
  label: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-card p-1", className)}>
      <div className="flex h-full flex-col justify-between gap-6 rounded-xl bg-background p-4 shadow-(--surface-shadow) dark:bg-popover">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-muted-foreground text-xs">
            <IconChip name={icon} />
            {label}
          </span>
          {aside}
        </div>
        <div className="flex min-w-0 flex-col gap-1">{children}</div>
      </div>
    </div>
  );
}

export const Figure = ({ value, format }: { value: number; format?: (v: number) => string }) => (
  <span className="font-medium text-3xl tabular-nums tracking-tight">
    <RollingDigits value={value} format={format} startOnView locale="en-US" />
  </span>
);

export const Note = ({ children }: { children: ReactNode }) => (
  <span className="truncate font-mono text-muted-foreground text-xs tabular-nums">{children}</span>
);
