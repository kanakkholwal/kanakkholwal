import { describe, expect, test } from "bun:test";
import type { StoryChapter } from "./story.types";
import { buildStory, isProject } from "./story.view";

// Minimal fixture: a chapter with just the fields the view cares about.
const chapter = (
  over: Partial<StoryChapter> & Pick<StoryChapter, "id" | "org">,
): StoryChapter => ({
  kicker: "",
  title: over.id,
  period: "",
  beats: [],
  ...over,
});

// Two work roles (oldest first, matching getStoryChapters' canonical order) and
// one featured project appended after — the exact shape getStoryChapters emits.
const oldRole = chapter({ id: "old", org: "Intern" });
const currentRole = chapter({ id: "now", org: "Engineer", current: true });
const project = chapter({ id: "proj", org: "Project" });
const chapters = [oldRole, currentRole, project];

describe("buildStory", () => {
  test("timeline is newest-first (canonical order reversed)", () => {
    const { timeline } = buildStory(chapters);
    expect(timeline.map((c) => c.id)).toEqual(["proj", "now", "old"]);
  });

  test("work is roles only, newest-first; projects are excluded", () => {
    const { work } = buildStory(chapters);
    expect(work.map((c) => c.id)).toEqual(["now", "old"]);
    expect(work.every((c) => !isProject(c))).toBe(true);
  });

  test("projects are the featured projects, in featured order", () => {
    const { projects } = buildStory(chapters);
    expect(projects.map((c) => c.id)).toEqual(["proj"]);
    expect(projects.every(isProject)).toBe(true);
  });

  test("current points at exactly the ongoing role — never a project, never a regex guess", () => {
    expect(buildStory(chapters).current?.id).toBe("now");
    // No ongoing role → undefined, not a false positive.
    const noneCurrent = buildStory([oldRole, project]);
    expect(noneCurrent.current).toBeUndefined();
    // A project is never treated as the current role.
    expect(buildStory([project]).current).toBeUndefined();
  });

  test("work and timeline agree over the work segment", () => {
    const { work, timeline } = buildStory(chapters);
    const timelineWork = timeline.filter((c) => !isProject(c)).map((c) => c.id);
    expect(timelineWork).toEqual(work.map((c) => c.id));
  });
});
