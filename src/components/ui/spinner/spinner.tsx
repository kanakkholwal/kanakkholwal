import { cn } from "@/lib/cn";
import { type SpinnerSize, spinnerIcon } from "./variants";

export type { SpinnerSize };

export interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  className?: string;
}

export function Spinner({ size = "md", label = "Loading", className }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cn("inline-flex", className)}>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className={spinnerIcon({ size })}>
        <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.8" opacity="0.22" />
        <path d="M14.2 8A6.2 6.2 0 0 0 8 1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}
