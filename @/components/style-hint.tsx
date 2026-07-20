"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/** Let the splash clear before nudging, so this doesn't fight the load animation. */
const SHOW_AFTER_MS = 1600;

/**
 * Nudge pointing at the style selector.
 *
 * The trigger is a lone icon in the corner of the header — nothing about it
 * says "this reskins the entire site". Deliberately stateless: it shows on
 * every load while the visitor is still on the default style, and stops the
 * moment they switch. No persisted "dismissed" flag to get stuck on.
 */
export function StyleHint({
  className,
  label = "Try clicking this",
  active = true,
  suppressed = false,
}: {
  className?: string;
  label?: string;
  /** Whether the visitor is still on the default style. */
  active?: boolean;
  /** Hide while the popover is open — it opens right on top of this. */
  suppressed?: boolean;
}) {
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), SHOW_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const visible = ready && active && !suppressed;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="style-hint"
          aria-hidden="true"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className={cn(
            "pointer-events-none absolute top-full right-0 z-50 mt-1 flex items-start gap-1 select-none",
            className,
          )}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.45 }}
            className="mt-5 font-mono text-[11px] whitespace-nowrap text-muted-foreground"
          >
            {label}
          </motion.span>

          <motion.svg
            width="46"
            height="42"
            viewBox="0 0 46 42"
            fill="none"
            className="shrink-0 overflow-visible text-muted-foreground/70"
            animate={reduceMotion ? undefined : { y: [0, 3, 0] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            }
          >
            {/* Curved dashed tail, drawn from the label up toward the trigger. */}
            <motion.path
              d="M3 38C16 39 32 33 36 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="3 4"
              initial={reduceMotion ? undefined : { pathLength: 0 }}
              animate={reduceMotion ? undefined : { pathLength: 1 }}
              transition={
                reduceMotion ? undefined : { duration: 0.55, ease: "easeOut" }
              }
            />
            {/* Arrowhead */}
            <motion.path
              d="M29.5 17.5L36 8L42 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduceMotion ? undefined : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              transition={reduceMotion ? undefined : { delay: 0.5 }}
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
