import { cn } from "@/lib/utils";
import type { StoryStat } from "~/data/story/story.types";

// Shared atoms so the cinematic view and the case-study cards render facts
// identically. Tech is a plain inline list, not chips; numbers carry the color.

export function StackLine({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <p className={cn("font-mono text-sm text-muted-foreground", className)}>
      {items.join("  ·  ")}
    </p>
  );
}

export function StatBlock({
  stat,
  size = "lg",
}: {
  stat: StoryStat;
  size?: "lg" | "md";
}) {
  return (
    <div>
      <p
        className={cn(
          "font-semibold tracking-tight text-foreground",
          size === "lg" ? "text-3xl md:text-4xl" : "text-xl",
        )}
      >
        {stat.value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
    </div>
  );
}

export function InlineStat({ stat }: { stat: StoryStat }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-semibold text-foreground">{stat.value}</span>
      <span className="text-sm text-muted-foreground">{stat.label}</span>
    </span>
  );
}
