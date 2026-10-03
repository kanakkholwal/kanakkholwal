export type TextTransitionTarget = "whole" | "word" | "character";

export interface TextTransitionPreset {
  target: TextTransitionTarget;
  durationMs: number;
  staggerMs: number;
  /** Defaults to `var(--ease-out)`. */
  easing?: string;
  /** The unit's starting state; it always animates in to its own natural layout (opacity 1, no transform, no blur). */
  from: {
    opacity?: number;
    x?: string;
    y?: string;
    scale?: number;
    blur?: string;
    rotate?: string;
  };
}

const SPRING_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/** One entry per `variant` value, expressed as CSS custom properties for a shared
 * `@keyframes` block instead of a per-preset WAAPI spec object. */
export const TEXT_TRANSITION_PRESETS = {
  "blur-out-up": {
    target: "word",
    durationMs: 560,
    staggerMs: 28,
    from: { opacity: 0, y: "10px", blur: "6px" },
  },
  "bottom-up-letters": {
    target: "character",
    durationMs: 400,
    staggerMs: 22,
    from: { opacity: 0, y: "14px" },
  },
  "top-down-letters": {
    target: "character",
    durationMs: 400,
    staggerMs: 22,
    from: { opacity: 0, y: "-14px" },
  },
  "fade-through": {
    target: "whole",
    durationMs: 300,
    staggerMs: 0,
    from: { opacity: 0 },
  },
  "focus-blur-resolve": {
    target: "whole",
    durationMs: 500,
    staggerMs: 0,
    from: { opacity: 0, blur: "14px" },
  },
  "kinetic-center-build": {
    target: "word",
    durationMs: 420,
    staggerMs: 60,
    from: { opacity: 0, x: "16px", blur: "3px" },
  },
  "jump-in": {
    target: "word",
    durationMs: 500,
    staggerMs: 50,
    easing: "var(--ease-spring)",
    from: { opacity: 0, y: "30px", rotate: "-30deg" },
  },
  "letter-drop": {
    target: "character",
    durationMs: 500,
    staggerMs: 60,
    from: { opacity: 0, y: "-1em" },
  },
  "line-by-line-slide": {
    target: "word",
    durationMs: 380,
    staggerMs: 50,
    from: { opacity: 0, x: "-16px" },
  },
  "mask-reveal-up": {
    target: "word",
    durationMs: 380,
    staggerMs: 40,
    from: { opacity: 0, y: "10px" },
  },
  "micro-scale-fade": {
    target: "whole",
    durationMs: 300,
    staggerMs: 0,
    from: { opacity: 0, scale: 0.97 },
  },
  "per-character-rise": {
    target: "character",
    durationMs: 380,
    staggerMs: 18,
    from: { opacity: 0, y: "10px" },
  },
  "per-word-crossfade": {
    target: "word",
    durationMs: 420,
    staggerMs: 70,
    from: { opacity: 0, y: "6px" },
  },
  "scale-down-fade": {
    target: "whole",
    durationMs: 340,
    staggerMs: 0,
    from: { opacity: 0, scale: 1.04 },
  },
  "shared-axis-y": {
    target: "word",
    durationMs: 260,
    staggerMs: 40,
    from: { opacity: 0, y: "10px" },
  },
  "shared-axis-z": {
    target: "whole",
    durationMs: 320,
    staggerMs: 0,
    from: { opacity: 0, scale: 0.92 },
  },
  "shimmer-sweep": {
    target: "whole",
    durationMs: 500,
    staggerMs: 0,
    from: { opacity: 0, x: "-12px" },
  },
  "short-slide-down": {
    target: "word",
    durationMs: 340,
    staggerMs: 90,
    from: { opacity: 0, y: "-10px" },
  },
  "short-slide-right": {
    target: "whole",
    durationMs: 420,
    staggerMs: 0,
    from: { opacity: 0, x: "-20px" },
  },
  "soft-blur-in": {
    target: "character",
    durationMs: 420,
    staggerMs: 20,
    from: { opacity: 0, y: "8px", blur: "4px" },
  },
  "spring-scale-in": {
    target: "word",
    durationMs: 420,
    staggerMs: 60,
    easing: SPRING_EASE,
    from: { opacity: 0, scale: 0.85 },
  },
  "wave-drop": {
    target: "character",
    durationMs: 250,
    staggerMs: 50,
    from: { opacity: 0, y: "-12px", blur: "6px" },
  },
} satisfies Record<string, TextTransitionPreset>;

export const TEXT_TRANSITION_VARIANTS = Object.keys(TEXT_TRANSITION_PRESETS) as Array<
  keyof typeof TEXT_TRANSITION_PRESETS
>;
