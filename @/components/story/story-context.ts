"use client";

import type { MotionValue } from "framer-motion";
import { createContext, useContext } from "react";

type StoryProgress = {
  /** 0 → 1 scroll progress through the current chapter. */
  progress: MotionValue<number>;
  /** Number of beats in the chapter, so a beat can size its own window. */
  count: number;
};

const StoryProgressContext = createContext<StoryProgress | null>(null);

export const StoryProgressProvider = StoryProgressContext.Provider;

export function useStoryProgress() {
  const ctx = useContext(StoryProgressContext);
  if (!ctx) {
    throw new Error("useStoryProgress must be used inside <StoryChapter>");
  }
  return ctx;
}
