"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { type ComponentProps, createContext, type ReactNode, useContext } from "react";
import { ANCHORED } from "@/lib/anchor";
import { cn } from "@/lib/cn";

export function TooltipProvider(props: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider {...props} />;
}

const DelayCtx = createContext(400);

export function Tooltip({
  children,
  delay = 400,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Root> & {
  children?: ReactNode;
  delay?: number;
}) {
  return (
    <DelayCtx.Provider value={delay}>
      <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>
    </DelayCtx.Provider>
  );
}

export function TooltipTrigger({ className, ...props }: ComponentProps<typeof TooltipPrimitive.Trigger>) {
  const delay = useContext(DelayCtx);

  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      delay={delay}
      className={cn("inline-flex", className)}
      {...props}
    />
  );
}

export function TooltipContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "top",
  sideOffset = 6,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Popup> &
  Pick<ComponentProps<typeof TooltipPrimitive.Positioner>, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            ANCHORED,
            "static z-50 rounded-md bg-popover px-2 py-1 text-foreground text-xs shadow-(--overlay-shadow)",
            "data-[open]:pointer-events-none",
            className,
          )}
          {...props}
        />
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}
