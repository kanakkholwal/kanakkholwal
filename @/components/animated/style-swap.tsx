"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import type { ReactNode } from "react";

// One shared motion contract for every design-mode (`styling.model`) change.
// Each homepage section renders its active Minimal / Static / Dynamic variant
// through <StyleSwap>, so switching modes reads the same everywhere: the
// outgoing variant lifts away and fades while the incoming one rises into
// place — identical easing, distance and duration across the whole page.
// Previously every section hand-rolled its own AnimatePresence with slightly
// different springs and offsets, so the page shimmered unevenly on each switch.

/** Signature ease, shared with the story components (see story/motion.ts). */
export const STYLE_SWAP_EASE = [0.22, 1, 0.36, 1] as const;

/** Distance the variant travels as it enters / leaves, in px. */
const SWAP_SHIFT = 10;

const swapVariants: Variants = {
  initial: { opacity: 0, y: SWAP_SHIFT },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -SWAP_SHIFT },
};

const reducedVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function StyleSwap({
  swapKey,
  children,
  className,
}: {
  /** Active `styling.model` id — a change drives the exit → enter swap. */
  swapKey: string;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  const transition: Transition = {
    duration: reduce ? 0.2 : 0.28,
    ease: reduce ? "linear" : STYLE_SWAP_EASE,
  };

  // mode="wait" keeps the swap coordinated — the old mode fully leaves before
  // the new one arrives. initial={false} skips the entrance on first paint so
  // it doesn't fight the page-load reveal in the wrapper.
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={swapKey}
        variants={reduce ? reducedVariants : swapVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
