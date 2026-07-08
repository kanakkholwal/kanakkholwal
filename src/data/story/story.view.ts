import type { StoryChapter } from "./story.types";

/** A chapter drawn from a featured project rather than a work role. */
export const isProject = (chapter: StoryChapter) => chapter.org === "Project";

/**
 * Every ordering and slice a renderer needs, derived once. Callers read the
 * slice they want (`work`, `projects`, `current`, `timeline`) instead of
 * re-deriving order or "am I current?" at each call site.
 */
export type Story = {
  /** Canonical chronological order: work oldest→newest, then featured projects. */
  chapters: StoryChapter[];
  /** Work roles only, newest-first. */
  work: StoryChapter[];
  /** Featured projects only, in featured order. */
  projects: StoryChapter[];
  /** The role you currently hold, if any. */
  current?: StoryChapter;
  /** All chapters newest-first, for changelog-style renderers. */
  timeline: StoryChapter[];
};

/**
 * Pure projection of canonical chapters into the {@link Story} view. Kept free
 * of the MDX loader so it can be unit-tested with plain fixtures.
 */
export function buildStory(chapters: StoryChapter[]): Story {
  const work = chapters.filter((c) => !isProject(c));
  const projects = chapters.filter(isProject);

  return {
    chapters,
    work: [...work].reverse(),
    projects,
    current: work.find((c) => c.current),
    timeline: [...chapters].reverse(),
  };
}
