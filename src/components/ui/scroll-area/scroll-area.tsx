"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import type { ComponentProps, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface ScrollAreaProps extends ComponentProps<typeof ScrollAreaPrimitive.Root> {
  children: ReactNode;
  maxHeight?: string;
  /** Exposes the actual scrollable element, for callers that need to drive its scroll
   * position themselves (e.g. Conversation's auto-follow). */
  viewportRef?: (el: HTMLDivElement | null) => void;
  /** Escape hatch for props that must land on the real scrollable element, not the
   * outer root (role, aria-*, tabIndex, extra scroll/pointer listeners). */
  viewportProps?: Omit<ComponentProps<typeof ScrollAreaPrimitive.Viewport>, "children" | "ref">;
}

export function ScrollArea({
  children,
  maxHeight = "16rem",
  className,
  viewportRef,
  viewportProps,
  ...props
}: ScrollAreaProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(true);

  // Fades tell the reader there is more; a styled scrollbar alone does not on touch.
  const measure = useCallback(() => {
    const el = viewport.current;
    if (!el) return;
    setAtTop(el.scrollTop <= 1);
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
  }, []);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn("relative", className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        {...viewportProps}
        ref={(el) => {
          viewport.current = el;
          viewportRef?.(el);
        }}
        onScroll={(event) => {
          measure();
          viewportProps?.onScroll?.(event);
        }}
        data-slot="scroll-area-viewport"
        style={{ maxHeight, ...viewportProps?.style }}
        className={cn("size-full rounded-[inherit] outline-none", viewportProps?.className)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        data-slot="scroll-area-scrollbar"
        className="flex touch-none select-none p-0.5 transition-colors data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-2.5"
      >
        <ScrollAreaPrimitive.Thumb data-slot="scroll-area-thumb" className="relative flex-1 rounded-full bg-border" />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner />

      <span
        aria-hidden
        style={{ opacity: atTop ? 0 : 1 }}
        className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-background to-transparent transition-opacity duration-(--duration-fast)"
      />
      <span
        aria-hidden
        style={{ opacity: atBottom ? 0 : 1 }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background to-transparent transition-opacity duration-(--duration-fast)"
      />
    </ScrollAreaPrimitive.Root>
  );
}
