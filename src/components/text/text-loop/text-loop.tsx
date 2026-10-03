"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  type TextLoopDirection,
  type TextLoopSize,
  type TextLoopVariant,
  textLoop,
  textLoopRollStep,
} from "./variants";

export type { TextLoopDirection, TextLoopSize, TextLoopVariant };

export interface TextLoopProps {
  items: string[];
  /** Controlled: which item is showing. Omit to let the component loop on its own. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Time each item stays before the next. Only runs while uncontrolled. */
  intervalMs?: number;
  /** Enter and exit length, in ms. */
  durationMs?: number;
  variant?: TextLoopVariant;
  direction?: TextLoopDirection;
  size?: TextLoopSize;
  className?: string;
}

type Shown = { index: number; key: number };
type Roll = { index: number; step: number; snap: boolean };

export function TextLoop({
  items,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  intervalMs = 1000,
  durationMs = 300,
  variant = "slide",
  direction = "up",
  size = "inherit",
  className,
}: TextLoopProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const count = items.length;
  const index = count > 0 ? (((indexProp ?? internalIndex) % count) + count) % count : 0;
  const indexRef = useRef(index);
  indexRef.current = index;
  const onChange = useRef(onIndexChange);
  onChange.current = onIndexChange;

  const [shown, setShown] = useState<Shown>({ index, key: 0 });
  const [leaving, setLeaving] = useState<Shown[]>([]);
  if (shown.index !== index) {
    setLeaving((current) => [...current, shown]);
    setShown({ index, key: shown.key + 1 });
  }

  const [roll, setRoll] = useState<Roll>({ index, step: index, snap: false });
  if (roll.index !== index) {
    setRoll({ index, step: textLoopRollStep(roll.index, index, count), snap: false });
  }

  useEffect(() => {
    if (indexProp !== undefined || count <= 1) return;
    const id = setInterval(() => {
      const next = (indexRef.current + 1) % count;
      setInternalIndex(next);
      onChange.current?.(next);
    }, intervalMs);
    return () => clearInterval(id);
  }, [indexProp, count, intervalMs]);

  // After landing on the duplicate first item, jump back to 0 with the transition off.
  useEffect(() => {
    if (!roll.snap) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setRoll((r) => ({ ...r, snap: false })));
    });
    return () => cancelAnimationFrame(frame);
  }, [roll.snap]);

  if (count === 0) return null;
  const styles = textLoop({ variant, direction, size });
  const longest = items.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span
      data-slot="text-loop"
      data-variant={variant}
      className={cn(styles.root(), className)}
      style={
        {
          "--text-loop-duration": `${durationMs}ms`,
          "--text-loop-step": roll.step,
        } as CSSProperties
      }
    >
      <span aria-hidden="true" className={styles.sizer()}>
        {longest}
      </span>
      {variant === "roll" ? (
        <>
          <span aria-hidden="true" className={styles.viewport()}>
            <span
              className={styles.stack()}
              data-snap={roll.snap ? "" : undefined}
              onTransitionEnd={() => {
                if (roll.step === count) setRoll((r) => ({ ...r, step: 0, snap: true }));
              }}
            >
              {[...items, items[0]].map((text, i) => (
                <span key={i} className={styles.stackItem()}>
                  {text}
                </span>
              ))}
            </span>
          </span>
          <span className={styles.srOnly()}>{items[index]}</span>
        </>
      ) : (
        <span className={styles.viewport()}>
          {leaving.map((item) => (
            <span
              key={item.key}
              aria-hidden="true"
              className={cn(styles.item(), "text-loop-exit")}
              onAnimationEnd={() => setLeaving((current) => current.filter((l) => l.key !== item.key))}
            >
              {items[item.index]}
            </span>
          ))}
          <span key={shown.key} className={cn(styles.item(), shown.key > 0 && "text-loop-enter")}>
            {items[index]}
          </span>
        </span>
      )}
    </span>
  );
}
