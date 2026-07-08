"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import type { StoryBeat as Beat } from "~/data/story/story.types";
import { useStoryProgress } from "./story-context";

export function StoryBeat({ beat, index }: { beat: Beat; index: number }) {
  const { progress, count } = useStoryProgress();
  const reduce = useReducedMotion();

  // Each beat owns one slice of the chapter's scroll; it fades up as it enters
  // and dims (never fully hidden) as the next one takes over.
  const seg = 1 / count;
  const start = index * seg;
  const opacity = useTransform(
    progress,
    [start - seg * 0.4, start + seg * 0.15, start + seg * 0.85, start + seg * 1.4],
    [0.12, 1, 1, 0.12],
  );
  const y = useTransform(
    progress,
    [start - seg * 0.4, start + seg * 0.15],
    [reduce ? 0 : 48, 0],
  );

  return (
    <motion.article
      style={{ opacity, y }}
      className="flex min-h-[85vh] flex-col justify-center gap-4"
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
        {String(index + 1).padStart(2, "0")} — {beat.heading}
      </span>
      <p className="max-w-md text-lg leading-relaxed text-foreground/90 md:text-xl">
        {beat.body}
      </p>
    </motion.article>
  );
}
