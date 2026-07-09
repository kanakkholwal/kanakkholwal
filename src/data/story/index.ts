// The career-story module. Renderers import from here and nowhere else inside
// this folder — `getStory()` (or `getStoryChapters()`) is the whole interface.
// Facts come from the resume MDX, narration from story.narration, and they are
// merged in story.build; the ordering/slicing rules live in story.view.

import { getStoryChapters } from "./story.build";
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
export function getStory(): Story {
  return buildStory(getStoryChapters());
}
