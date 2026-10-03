import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { type SkeletonShape, skeleton } from "./variants";

export interface SkeletonProps extends ComponentProps<"div"> {
  /** Overrides the class width; omit to size with classes. */
  width?: string;
  height?: string;
  shape?: SkeletonShape;
}

export function Skeleton({ width, height, shape = "line", className, style, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      data-slot="skeleton"
      {...props}
      style={{ width, height, ...style }}
      className={cn(skeleton({ shape }), className)}
    />
  );
}
