"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delayDuration = 400,
  skipDelayDuration = 300,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  // skipDelayDuration is what makes a toolbar feel fast: the first tooltip
  // waits, every adjacent one inside the window opens instantly.
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  );
}

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md",
        // Scales from the trigger, not from its own centre. The v3 spelling
        // `origin-[--radix-...]` compiles to an invalid value under v4 and
        // silently falls back to `center`.
        "origin-(--radix-tooltip-content-transform-origin)",
        "animate-in fade-in-0 zoom-in-95 duration-150 ease-out",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
