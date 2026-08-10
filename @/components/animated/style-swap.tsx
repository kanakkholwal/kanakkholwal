"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

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

/** Per-state transitions live on the variants — Framer's `transition` prop has
 *  no top-level `exit` key. Exit really is faster than enter here; the previous
 *  version applied one duration to both while a comment claimed otherwise. */
const crossfade = (reduce: boolean): Variants => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: reduce ? 0.15 : 0.28, ease: STYLE_SWAP_EASE },
  },
  exit: {
    opacity: 0,
    transition: { duration: reduce ? 0.1 : 0.16, ease: STYLE_SWAP_EASE },
  },
});

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
  const userSwitched = useIsUserSwitch(swapKey);

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={swapKey}
        variants={crossfade(Boolean(reduce))}
        // `false` until the visitor actually switches. The stored style resolves
        // after hydration, and crossfading the whole page on that resolution is
        // motion nobody asked for.
        initial={userSwitched ? "initial" : false}
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** Shared with the header: distinguishes a real style change from the
 *  post-hydration arrival of the persisted value. */
function useIsUserSwitch(key: string) {
  const settled = useRef<string | null>(null);
  const [userSwitched, setUserSwitched] = useState(false);

  useEffect(() => {
    if (settled.current === null) {
      settled.current = key;
      return;
    }
    if (settled.current !== key) {
      settled.current = key;
      setUserSwitched(true);
    }
  }, [key]);

  return userSwitched;
}
