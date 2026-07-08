import type { StoryChapter, StoryScene } from "~/data/story/story.types";

function findScene<K extends StoryScene["kind"]>(chapter: StoryChapter, kind: K) {
  const beat = chapter.beats.find((b) => b.scene.kind === kind);
  return beat?.scene.kind === kind
    ? (beat.scene as Extract<StoryScene, { kind: K }>)
    : undefined;
}

// One flat read of a chapter for the case-study views, so cards and summaries
// don't each re-walk the beats.
export function chapterFacets(chapter: StoryChapter) {
  return {
    headline: findScene(chapter, "headline")?.body,
    stack: findScene(chapter, "stack")?.items ?? [],
    stats: findScene(chapter, "stats")?.items ?? [],
    note: findScene(chapter, "note")?.body,
    beats: chapter.beats,
  };
}

export const isProject = (chapter: StoryChapter) => chapter.org === "Project";
