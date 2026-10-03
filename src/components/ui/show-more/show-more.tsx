"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface ShowMoreProps {
  children: ReactNode;
  lines?: number;
  maxHeight?: number;
  expanded?: boolean;
  moreLabel?: string;
  lessLabel?: string;
  label?: string;
  className?: string;
  onExpandedChange?: (expanded: boolean) => void;
}

export function ShowMore({
  children,
  lines = 3,
  maxHeight = 320,
  expanded: expandedProp,
  moreLabel = "Show more",
  lessLabel = "Show less",
  label = "Details",
  className,
  onExpandedChange,
}: ShowMoreProps) {
  const uid = useId();
  const content = useRef<HTMLDivElement>(null);
  const region = useRef<HTMLDivElement>(null);
  const [internal, setInternal] = useState(false);
  const [lineHeight, setLineHeight] = useState<number>();
  const [fullHeight, setFullHeight] = useState<number>();
  const expanded = expandedProp ?? internal;

  useEffect(() => {
    const el = content.current;
    if (!el) return;
    const measure = () => {
      const styles = getComputedStyle(el);
      const parsed = Number.parseFloat(styles.lineHeight);
      setLineHeight(Number.isFinite(parsed) ? parsed : Number.parseFloat(styles.fontSize) * 1.5);
      setFullHeight(el.scrollHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const collapsedHeight =
    lineHeight === undefined || fullHeight === undefined ? undefined : Math.min(lineHeight * lines, fullHeight);
  const expandable = lineHeight === undefined || fullHeight === undefined ? false : fullHeight - lineHeight * lines > 1;
  const open = expanded && expandable;
  const scrollable = open && fullHeight !== undefined && fullHeight > maxHeight;
  const height = open ? (fullHeight === undefined ? undefined : Math.min(fullHeight, maxHeight)) : collapsedHeight;
  const veiled = expandable && (!open || scrollable);
  // role and aria-label have to arrive together, or neither is valid on the div.
  const regionRole = scrollable ? { role: "region" as const, "aria-label": label, tabIndex: 0 } : {};

  function toggle() {
    if (open) region.current?.scrollTo({ top: 0 });
    const next = !expanded;
    if (expandedProp === undefined) setInternal(next);
    onExpandedChange?.(next);
  }

  return (
    <div className={cn("w-full text-foreground", className)}>
      <div className="relative">
        <div
          ref={region}
          id={`${uid}-region`}
          {...regionRole}
          style={{
            height: height === undefined ? undefined : `${height}px`,
            maxHeight: height === undefined ? `${lines}lh` : undefined,
            overflowY: scrollable ? "auto" : "hidden",
            scrollbarGutter: scrollable ? "stable" : undefined,
          }}
          className="scroll-area overscroll-contain rounded-sm outline-none transition-[height] duration-[var(--duration-overlay)] ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
        >
          <div ref={content}>{children}</div>
        </div>
        <div
          aria-hidden
          data-on={veiled}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent opacity-0 transition-opacity duration-[var(--duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none data-[on=true]:opacity-100"
        />
      </div>

      {expandable ? (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={`${uid}-region`}
          className="-ml-2 mt-2 inline-flex h-8 items-center gap-1.5 rounded-md px-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {open ? lessLabel : moreLabel}
          <svg
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
            data-on={open}
            className="size-3 transition-[rotate] duration-[var(--duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none data-[on=true]:rotate-180"
          >
            <path
              d="m2.5 4.25 3.5 3.5 3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
