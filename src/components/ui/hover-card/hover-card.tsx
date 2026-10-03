"use client";

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import { type ComponentProps, createContext, type ReactNode, useContext, useMemo } from "react";
import { ANCHORED } from "@/lib/anchor";
import { cn } from "@/lib/cn";

const DelayCtx = createContext({ openDelay: 300, closeDelay: 150 });

export function HoverCard({
  children,
  openDelay = 300,
  closeDelay = 150,
  ...props
}: ComponentProps<typeof PreviewCardPrimitive.Root> & {
  children?: ReactNode;
  openDelay?: number;
  closeDelay?: number;
}) {
  const delays = useMemo(() => ({ openDelay, closeDelay }), [openDelay, closeDelay]);
  return (
    <DelayCtx.Provider value={delays}>
      <PreviewCardPrimitive.Root {...props}>{children}</PreviewCardPrimitive.Root>
    </DelayCtx.Provider>
  );
}

export function HoverCardTrigger({ className, ...props }: ComponentProps<typeof PreviewCardPrimitive.Trigger>) {
  const { openDelay, closeDelay } = useContext(DelayCtx);

  return (
    <PreviewCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      delay={openDelay}
      closeDelay={closeDelay}
      className={cn("inline-flex", className)}
      {...props}
    />
  );
}

export function HoverCardContent({
  className,
  align = "center",
  alignOffset = 4,
  side = "bottom",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof PreviewCardPrimitive.Popup> &
  Pick<ComponentProps<typeof PreviewCardPrimitive.Positioner>, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            ANCHORED,
            "static z-50 w-64 rounded-xl bg-popover p-3 text-sm shadow-(--overlay-shadow)",
            className,
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}
