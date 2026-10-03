// Renderers import the career story from here only: `useStory()` / `useStoryChapters()`.
import { useMemo } from "react";
import { useProjects, useWorkExperiences } from "@/lib/content";
import { getStoryChapters, type StorySource } from "./story.build";
import type { StoryChapter } from "./story.types";
import { buildStory, type Story } from "./story.view";

export type {
  StoryBeat,
  StoryChapter,
  StoryScene,
  StoryStat,
} from "./story.types";
export type { Story } from "./story.view";
export { isProject } from "./story.view";
export { getStoryChapters };

/** The career story as a ready-to-render view — chapters plus every slice. */
export function getStory(source: StorySource): Story {
  return buildStory(getStoryChapters(source));
}

/** Chapters built from the root-loaded content index. */
export function useStoryChapters(): StoryChapter[] {
  const projects = useProjects();
  const work = useWorkExperiences();
  return useMemo(() => getStoryChapters({ projects, work }), [projects, work]);
}

export function useStory(): Story {
  const chapters = useStoryChapters();
  return useMemo(() => buildStory(chapters), [chapters]);
}
