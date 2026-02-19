"use client";

import { cn } from "@/lib/utils";
import {
  animate,
  motion,
  useInView,
  UseInViewOptions,
  useMotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "~/utils/number";

interface CountingNumberProps {
  from?: number;
  to?: number;
  duration?: number; // seconds
  delay?: number; // ms
  className?: string;
  startOnView?: boolean;
  once?: boolean;
  inViewMargin?: UseInViewOptions["margin"];
  onComplete?: () => void;
  format?: (value: number) => string;
  suffix?: string;
}

export function CountingNumber({
  from = 0,
  to = 100,
  duration = 2,
  delay = 0,
  className,
  startOnView = true,
  once = false,
  inViewMargin,
  onComplete,
  format,
  suffix,
  ...props
}: CountingNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: inViewMargin });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [display, setDisplay] = useState(from);
  const motionValue = useMotionValue(from);

  // Should start animation?
  const shouldStart = !startOnView || (isInView && (!once || !hasAnimated));

  useEffect(() => {
    if (!shouldStart) return;
    setHasAnimated(true);
    const timeout = setTimeout(() => {
      const controls = animate(motionValue, to, {
        duration,
        onUpdate: (v) => setDisplay(v),
        onComplete,
      });
      return () => controls.stop();
    }, delay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldStart, from, to, duration, delay]);

  return (
    <motion.span ref={ref} className={cn("inline-block", className)} {...props}>
      {format ? format(display) : formatNumber(display)}
      {suffix}
    </motion.span>
  );
}
