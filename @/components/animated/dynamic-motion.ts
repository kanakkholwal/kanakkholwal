import type { Transition, Variants } from "framer-motion";

// Motion contract for the Dynamic variant only. Dynamic's identity is depth:
// things float, tilt, and arrive through perspective. Minimal cuts, Static
// fades, Story wipes — none of them import this file.

/** `transform: perspective()`, not the CSS `perspective` property. Framer's
 *  transformPropOrder has no bare `perspective`, so that one styles children. */
export const DEPTH = 900;

/** Pointer tilt. Overdamped: the card must not wobble after the pointer stops. */
export const TILT_SPRING: Transition = { stiffness: 380, damping: 80 };

export const TILT_RANGE: [number, number] = [-0.4, 0.4];
export const TILT_DEGREES = 10;

/** Surfaces arrive by rising out of the page rather than sliding across it. */
export const LIFT_IN: Variants = {
  hidden: { opacity: 0, y: 28, rotateX: -8, transformPerspective: DEPTH },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transformPerspective: DEPTH,
    transition: { type: "spring", bounce: 0, duration: 0.55 },
  },
};

export const LIFT_IN_REDUCED: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

export const liftIn = (reduce: boolean) => (reduce ? LIFT_IN_REDUCED : LIFT_IN);

/** Swings down off a top edge. Pair with `transform-origin: top` and a rule
 *  above the element, so the motion has something to be hinged to. */
export const HINGE_DOWN: Variants = {
  hidden: { opacity: 0, rotateX: -34, transformPerspective: DEPTH },
  show: {
    opacity: 1,
    rotateX: 0,
    transformPerspective: DEPTH,
    transition: { type: "spring", bounce: 0, duration: 0.6 },
  },
};

export const hingeDown = (reduce: boolean) =>
  reduce ? LIFT_IN_REDUCED : HINGE_DOWN;
