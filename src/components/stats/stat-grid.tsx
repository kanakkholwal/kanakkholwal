import type { ReactNode } from "react";
import { RollingDigits } from "@/components/text/rolling-digits";
import { cn } from "@/lib/cn";

export type StatCell = {
  label: string;
  value: number;
  format?: (value: number) => string;
  note?: ReactNode;
};

function Figure({ cell }: { cell: StatCell }) {
  return <RollingDigits value={cell.value} format={cell.format} startOnView locale="en-US" />;
}

/** Headline numbers in a hairline grid; each rolls up the first time it scrolls into view. */
export function StatGrid({ cells, className }: { cells: StatCell[]; className?: string }) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4",
        className,
      )}
    >
      {cells.map((c) => (
        <div key={c.label} className="flex min-w-0 flex-col gap-1 bg-background p-4">
          <dt className="truncate text-muted-foreground text-xs">{c.label}</dt>
          <dd className="font-medium text-2xl tabular-nums">
            <Figure cell={c} />
          </dd>
          {c.note ? <dd className="truncate font-mono text-muted-foreground text-xs tabular-nums">{c.note}</dd> : null}
        </div>
      ))}
    </dl>
  );
}

/** Raised tiles on a card rim, the `Well` recipe split into cells. */
export function StatTiles({ cells, className }: { cells: StatCell[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-1 rounded-2xl bg-card p-1 sm:grid-cols-3", className)}>
      {cells.map((c) => (
        <div
          key={c.label}
          className="flex min-w-0 flex-col gap-1 rounded-xl bg-background p-4 shadow-(--surface-shadow) dark:bg-popover"
        >
          <dt className="truncate text-muted-foreground text-xs">{c.label}</dt>
          <dd className="font-medium text-2xl tabular-nums">
            <Figure cell={c} />
          </dd>
          {c.note ? <dd className="truncate font-mono text-muted-foreground text-xs tabular-nums">{c.note}</dd> : null}
        </div>
      ))}
    </dl>
  );
}
