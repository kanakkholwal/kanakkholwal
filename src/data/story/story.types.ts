export type StoryStat = { label: string; value: string };

export type StoryScene =
  | { kind: "headline"; body: string }
  | { kind: "stack"; items: string[] }
  | { kind: "stats"; items: StoryStat[] }
  | { kind: "note"; body: string };

export type StoryBeat = {
  id: string;
  heading: string;
  body: string;
  scene: StoryScene;
  /** Spoken in play mode. Defaults to `body` when omitted. */
  narration?: string;
};

export type StoryChapter = {
  id: string;
  kicker: string;
  title: string;
  org: string;
  period: string;
  href?: string;
  /** Any CSS color; drives this chapter's accent. Defaults to the theme primary. */
  accent?: string;
  /**
   * True when this is the role you currently hold. Derived from the resume
   * frontmatter (`isCurrentEmployer` / `isOngoing` / open `endDate`) at build
   * time — never from pattern-matching the display `period`.
   */
  current?: boolean;
  beats: StoryBeat[];
};
