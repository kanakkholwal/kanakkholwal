import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
  disabled?: boolean;
}

export function Label({ children, className, required, disabled, ...rest }: LabelProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor is supplied by the caller
    <label
      {...rest}
      className={cn(
        "inline-flex items-center gap-1 font-medium text-foreground text-sm",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      {children}
      {required ? (
        <span aria-hidden className="text-destructive-strong">
          *
        </span>
      ) : null}
    </label>
  );
}
