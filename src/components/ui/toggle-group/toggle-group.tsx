"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type { ComponentProps } from "react";
import { createContext, useContext, useMemo } from "react";
import { cn } from "@/lib/cn";
import { type ToggleGroupSize, type ToggleGroupVariant, toggleGroup } from "./variants";

export type { ToggleGroupSize, ToggleGroupVariant };

type Ctx = { size: ToggleGroupSize; variant: ToggleGroupVariant };

const ToggleGroupCtx = createContext<Ctx | null>(null);

function useToggleGroupCtx() {
  const ctx = useContext(ToggleGroupCtx);
  if (!ctx) throw new Error("ToggleGroupItem must be used inside <ToggleGroup>");
  return ctx;
}

export function ToggleGroup({
  className,
  value = "",
  type = "single",
  variant = "default",
  size = "md",
  disabled = false,
  label = "Options",
  onValueChange,
  children,
  ...props
}: Omit<ComponentProps<typeof ToggleGroupPrimitive>, "value" | "defaultValue" | "onValueChange" | "multiple"> & {
  value?: string | string[];
  type?: "single" | "multiple";
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
  disabled?: boolean;
  label?: string;
  onValueChange?: (value: string | string[]) => void;
}) {
  // Base UI's ToggleGroup is always array-valued (`multiple` just allows >1 pressed);
  // bridged here to keep this component's own string | string[] API unchanged.
  const arrayValue = type === "multiple" ? (value as string[]) : value ? [value as string] : [];

  return (
    <ToggleGroupCtx.Provider value={useMemo(() => ({ size, variant }), [size, variant])}>
      <ToggleGroupPrimitive
        data-slot="toggle-group"
        aria-label={label}
        disabled={disabled}
        multiple={type === "multiple"}
        value={arrayValue}
        onValueChange={(next) => onValueChange?.(type === "multiple" ? next : (next[0] ?? ""))}
        className={cn(toggleGroup({ variant, size }).root(), disabled && "opacity-50", className)}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive>
    </ToggleGroupCtx.Provider>
  );
}

export function ToggleGroupItem({
  className,
  value,
  ...props
}: ComponentProps<typeof TogglePrimitive> & { value: string }) {
  const { size, variant } = useToggleGroupCtx();

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      value={value}
      className={cn(toggleGroup({ variant, size }).item(), className)}
      {...props}
    />
  );
}
