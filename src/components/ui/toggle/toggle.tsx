"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { type ToggleSize, type ToggleVariant, toggleButton } from "./variants";

export type { ToggleSize, ToggleVariant };

export interface ToggleProps {
  children?: ReactNode;
  pressed?: boolean;
  disabled?: boolean;
  variant?: ToggleVariant;
  size?: ToggleSize;
  label?: string;
  className?: string;
  onPressedChange?: (pressed: boolean) => void;
}

export function Toggle({
  children,
  pressed,
  disabled = false,
  variant = "default",
  size = "md",
  label,
  className,
  onPressedChange,
}: ToggleProps) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      data-variant={variant}
      pressed={pressed}
      disabled={disabled}
      aria-label={label}
      onPressedChange={onPressedChange}
      className={cn(toggleButton({ variant, size }), className)}
    >
      {children}
    </TogglePrimitive>
  );
}
