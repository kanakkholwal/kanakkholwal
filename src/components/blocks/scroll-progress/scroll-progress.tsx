"use client";

import { type CSSProperties, type RefObject, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { type ScrollProgressPosition, scrollPercent, scrollProgress } from "./variants";

export type { ScrollProgressPosition };

export interface ScrollProgressProps {
  /** Controlled progress, 0 to 100. Omit to follow the scroll position. */
  value?: number;
  /** Fired with the scroll position, 0 to 100, as it changes. */
  onValueChange?: (value: number) => void;
  position?: ScrollProgressPosition;
  /** Scroll this element instead of the page; the rail then sits inside it. */
  container?: RefObject<HTMLElement | null>;
  tickCount?: number;
  /** Rail height in px. */
  height?: number;
  /** Rail width in px. */
  width?: number;
  showLabel?: boolean;
  /** Accessible name of the progress bar. */
  label?: string;
  className?: string;
}

export function ScrollProgress({
  value: valueProp,
  onValueChange,
  position = "right",
  container,
  tickCount = 40,
  height = 160,
  width = 14,
  showLabel = true,
  label = "Scroll progress",
  className,
}: ScrollProgressProps) {
  const [scrolled, setScrolled] = useState(0);
  const onChange = useRef(onValueChange);
  onChange.current = onValueChange;
  const value = Math.min(100, Math.max(0, valueProp ?? scrolled));
  const styles = scrollProgress({ position, scope: container ? "container" : "page" });

  useEffect(() => {
    const el = container?.current ?? null;
    const target: HTMLElement | Window = el ?? window;
    let last = -1;
    const update = () => {
      const next = scrollPercent(el);
      if (next === last) return;
      last = next;
      setScrolled(next);
      onChange.current?.(next);
    };
    update();
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      target.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [container]);

  const ticks = (tick: string) => (
    <div className={styles.ticks()}>
      {Array.from({ length: tickCount }, (_, i) => (
        <span key={i} className={tick} />
      ))}
    </div>
  );

  return (
    <div
      data-slot="scroll-progress"
      data-position={position}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      className={cn(styles.root(), className)}
      style={{ "--scroll-progress": value } as CSSProperties}
    >
      <div className={styles.track()} style={{ height, width }}>
        {ticks(styles.tick())}
        <div className={styles.fill()} aria-hidden="true">
          {ticks(styles.fillTick())}
        </div>
        {showLabel ? (
          <div className={styles.label()} aria-hidden="true">
            <span className={styles.labelRule()} />
            <span className={styles.labelValue()}>{Math.round(value)}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
