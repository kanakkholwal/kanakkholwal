import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { type BadgeSize, type BadgeVariant, badge } from "./variants";

export interface BadgeProps {
  children?: ReactNode;
  className?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

export function Badge({ children, className, variant, size, dot = false }: BadgeProps) {
  return (
    <span className={cn(badge({ variant, size }), className)} data-variant={variant}>
      {dot ? <span className="size-1.5 shrink-0 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
