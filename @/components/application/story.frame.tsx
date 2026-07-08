"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, pad } from "@/components/story/motion";
import { cn } from "@/lib/utils";

// Shared scaffolding for the homepage's "story" design mode. Every section
// renders its Story variant as a numbered chapter threaded by a left spine, so
// the whole page reads as one first-person narrative — distinct from the
// minimal / static / dynamic layouts. Reuses the story easing + numbering
// tokens so it stays in step with the /journey scrollytelling.

/** Inline serif accent — the emphasised words in a chapter headline. */
export function Serif({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("font-instrument-serif font-normal italic", className)}>
      {children}
    </span>
  );
}

/** Fade-and-rise reveal for chapter bodies. Collapses to a fade when the
 *  visitor prefers reduced motion. */
export function StoryReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** The opening spread — chapter zero. No number, sets the scene. */
export function StoryOpening({
  children,
  id,
}: {
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-3xl px-6 pt-24 pb-6 md:pt-32">
      {children}
    </section>
  );
}

/** One numbered chapter. The dashed left spine + node thread the chapters
 *  together; the header and body reveal as they scroll into view. */
export function StoryChapter({
  index,
  kicker,
  title,
  id,
  children,
}: {
  index: number;
  kicker: string;
  title: ReactNode;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-3xl px-6">
      <div className="relative border-l border-dashed border-border/60 pb-16 pl-8 pt-6 md:pl-10">
        <span
          aria-hidden
          className="absolute -left-1.5 top-7 size-3 rounded-full border-2 border-background bg-primary"
        />
        <StoryReveal>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Ch.{pad(index)} <span className="text-muted-foreground/40">·</span> {kicker}
          </p>
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl">
            {title}
          </h2>
        </StoryReveal>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
