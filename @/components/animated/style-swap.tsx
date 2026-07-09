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
// Each section renders its active Minimal / Static / Dynamic / Story variant
// through <StyleSwap>, so switching modes reads the same everywhere.
//
// The swap is a shared-layout crossfade: elements that exist in more than one
// mode (the logo, name, role, avatar, socials, CTA — anything with a matching
// `layoutId` inside the wrapper's <LayoutGroup>) physically travel to their new
// position, while everything else crossfades. `mode="popLayout"` takes the
// outgoing variant out of layout flow so the incoming one settles into place and
// the shared elements can morph cleanly; the wrapper animates opacity only, so
// it never fights the layout projection that drives the morph.

/** Signature ease, shared with the story components (see story/motion.ts). */
export const STYLE_SWAP_EASE = [0.22, 1, 0.36, 1] as const;

const crossfade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function StyleSwap({
  swapKey,
  children,
  className,
}: {
  /** Active `styling.model` id — a change drives the shared-layout swap. */
  swapKey: string;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  // Exit a touch faster than enter so the swap feels responsive.
  const transition: Transition = {
    duration: reduce ? 0.15 : 0.3,
    ease: STYLE_SWAP_EASE,
  };

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={swapKey}
        variants={crossfade}
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
