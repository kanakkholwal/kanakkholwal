"use client";

import { DEPTH } from "@/components/animated/dynamic-motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Dynamic-variant word flipper: the container resizes to each word while the
// letters hinge in on rotateX. Story uses RotatingText (vertical slide) and
// Minimal/Static use TextFlip — this one is not shared.

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** NBSP: a plain space inside an inline-block can collapse, and the two glyphs
 *  do not share an advance width in every face. */
const glyph = (letter: string) => (letter === " " ? " " : letter);

/** Measure and paint must split identically, or the box is sized for text it
 *  isn't rendering. */
const splitLetters = (word: string) =>
  [...word].map((letter, i) => (
    <span key={`${word}-${i}`} className="inline-block">
      {glyph(letter)}
    </span>
  ));

export interface ContainerTextFlipProps {
  words: string[];
  /** ms between words. */
  interval?: number;
  className?: string;
  textClassName?: string;
}

export function ContainerTextFlip({
  words,
  interval = 2800,
  className,
  textClassName,
}: ContainerTextFlipProps) {
  const reduce = Boolean(useReducedMotion());
  const [index, setIndex] = useState(0);
  const [widths, setWidths] = useState<number[] | null>(null);
  const sizerRef = useRef<HTMLSpanElement>(null);

  // Measured once, before paint, off a hidden sizer holding every word. Reading
  // the live node each cycle instead means the first frame paints at a
  // placeholder width and then corrects itself.
  useIsoLayoutEffect(() => {
    const sizer = sizerRef.current;
    if (!sizer) return;
    // Ceil plus a pixel: rects are fractional and per-glyph paint rounding does
    // not have to agree with the sum the rect reports. Cheaper to carry 1px of
    // slack than to shave a stem off the last letter.
    const measure = () =>
      setWidths(
        Array.from(
          sizer.children,
          (c) => Math.ceil((c as HTMLElement).getBoundingClientRect().width) + 1,
        ),
      );
    measure();
    // Widths are font- and viewport-dependent; the caller sizes this with clamp().
    const ro = new ResizeObserver(measure);
    ro.observe(sizer);
    return () => ro.disconnect();
  }, [words]);

  useEffect(() => {
    if (words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  const word = words[index] ?? "";
  const width = widths?.[index];

  return (
    <span
      className={cn(
        "relative inline-block rounded-xl border border-input bg-card px-3 py-1 align-middle",
        "shadow-[inset_0_-1px_0_var(--border),0_6px_16px_-8px_color-mix(in_oklab,var(--foreground)_35%,transparent)]",
        className,
      )}
    >
      {/* Read once as a static list. The animated layer rewrites its own text
          every few seconds, which would otherwise make the headline a live region. */}
      <span className="sr-only">{words.join(", ")}</span>

      {/* Never painted: supplies the per-word widths the container springs
          between. Split into the same per-letter inline-blocks the animated
          layer uses — measuring the word as one text run gives a narrower
          number, because inline-block boundaries suppress kerning between every
          pair. Over 23 glyphs that shortfall clipped the last letter. */}
      <span
        ref={sizerRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 flex"
      >
        {words.map((w) => (
          <span key={w} className={cn("whitespace-pre", textClassName)}>
            {splitLetters(w)}
          </span>
        ))}
      </span>

      {/* The animated width sits here, not on the padded shell: preflight sets
          box-sizing: border-box globally, so a measured text width applied to
          the shell would be eaten by its own padding and border. */}
      <motion.span
        aria-hidden="true"
        className="relative block overflow-hidden"
        style={{ width: width ?? "auto" }}
        animate={width ? { width } : undefined}
        initial={false}
        transition={reduce ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.42 }}
      >
        {/* In-flow and invisible: gives the box its height, and its width until
            the measurement lands. */}
        <span className={cn("invisible block whitespace-pre", textClassName)}>
          {splitLetters(word)}
        </span>

        {/* `sync`, not `wait` — outgoing and incoming overlap so the width spring
            and the letters resolve together instead of end-to-end. Both are
            absolute, so the two words never fight over layout. */}
        <AnimatePresence initial={false} mode="sync">
          <motion.span
            key={word}
            className={cn("absolute inset-0 block whitespace-pre", textClassName)}
            initial={reduce ? { opacity: 0 } : undefined}
            animate={reduce ? { opacity: 1 } : undefined}
            exit={reduce ? { opacity: 0 } : undefined}
            transition={reduce ? { duration: 0.15 } : undefined}
            style={reduce ? undefined : { transformStyle: "preserve-3d" }}
          >
            {reduce
              ? word
              : [...word].map((letter, i) => (
                  <motion.span
                    // Index keys are right here: the stagger is positional
                    // (letter 3 hinges after letter 2), not identity-based.
                    key={`${word}-${i}`}
                    className="inline-block"
                    initial={{ opacity: 0, rotateX: -75, y: "0.3em" }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    exit={{ opacity: 0, rotateX: 55, y: "-0.25em" }}
                    style={{ transformPerspective: DEPTH }}
                    transition={{
                      duration: 0.34,
                      ease: [0.22, 1, 0.36, 1],
                      delay: i * 0.022,
                    }}
                  >
                    {glyph(letter)}
                  </motion.span>
                ))}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </span>
  );
}

export default ContainerTextFlip;
