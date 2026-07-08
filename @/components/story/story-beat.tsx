"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { StoryBeat as Beat } from "~/data/story/story.types";
import { clamp01, pad } from "./motion";
import { useStoryProgress } from "./story-context";
import { useStoryPlayer } from "./story-player";

export function StoryBeat({ beat, index }: { beat: Beat; index: number }) {
  const { progress, count } = useStoryProgress();
  const { registerBeat, activeBeatId } = useStoryPlayer();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerBeat({ id: beat.id, el, text: beat.narration ?? beat.body });
  }, [beat.id, beat.narration, beat.body, registerBeat]);

  const isActive = activeBeatId === beat.id;

  // Each beat owns one slice of the chapter's scroll; it fades up as it enters
  // and dims (never fully hidden) as the next one takes over. Breakpoints stay
  // within [0,1] because scroll-linked values are driven by a native WAAPI
  // ScrollTimeline, whose keyframe offsets must be in range.
  const seg = 1 / count;
  const start = index * seg;
  const end = start + seg;
  const isLast = index === count - 1;
  const opacity = useTransform(
    progress,
    [
      clamp01(start - seg * 0.35),
      clamp01(start + seg * 0.15),
      clamp01(end - seg * 0.15),
      clamp01(end + seg * 0.35),
    ],
    // The last beat holds full opacity so it stays readable until the whole
    // section scrolls away, instead of dimming while still pinned.
    [0.12, 1, 1, isLast ? 1 : 0.12],
  );
  const y = useTransform(
    progress,
    [clamp01(start - seg * 0.35), clamp01(start + seg * 0.15)],
    [reduce ? 0 : 48, 0],
  );

  return (
    <motion.article
      ref={ref}
      style={{ opacity, y }}
      className="relative flex min-h-[80vh] items-center"
    >
      <span className="absolute left-0 top-1/2 flex size-3.5 -translate-y-1/2 items-center justify-center">
        <span
          className={cn(
            "size-2 rounded-full ring-4 ring-background transition-colors duration-300",
            isActive ? "bg-(--accent)" : "bg-border",
          )}
        />
      </span>

      <div className="w-full max-w-lg space-y-4 pl-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-(--accent)">{pad(index + 1)}</span>
          <span className="text-sm font-medium text-muted-foreground">
            {beat.heading}
          </span>
        </div>
        <p className="text-2xl leading-relaxed text-foreground md:text-[1.7rem] md:leading-[1.4]">
          {beat.body}
        </p>
      </div>
    </motion.article>
  );
}
