import type { StoryChapter } from "./story.types";

export const storyChapters: StoryChapter[] = [
  {
    id: "koinx",
    kicker: "Early 2024 · Work",
    title: "KoinX",
    org: "Frontend Engineer",
    period: "Early 2024",
    href: "https://koinx.com?utm_source=kanak.eu.org",
    beats: [
      {
        id: "koinx-join",
        heading: "The room I walked into",
        body: "KoinX is a fast-growing crypto tax and compliance platform. I joined to work across both the customer-facing product and the B2B side — at real scale, with real users.",
        scene: {
          kind: "headline",
          body: "Crypto tax & compliance, shipped to real users.",
        },
      },
      {
        id: "koinx-velocity",
        heading: "Chasing developer velocity",
        body: "My focus was performance and speed of iteration. I migrated legacy CRA apps to a modern toolchain to cut build times and tighten the feedback loop for the whole team.",
        scene: {
          kind: "stack",
          items: ["React", "Vite", "TypeScript", "i18n", "SEO"],
        },
      },
      {
        id: "koinx-impact",
        heading: "Where it moved the needle",
        body: "I collapsed multi-language landing pages into a single source of truth, and pushed on SEO and runtime performance across the marketing surface.",
        scene: {
          kind: "stats",
          items: [
            { value: "CRA → Vite", label: "Build toolchain migrated" },
            { value: "1 source", label: "For every locale" },
            { value: "SEO + runtime", label: "Measurably improved" },
          ],
        },
      },
      {
        id: "koinx-system",
        heading: "Leaving something behind",
        body: "Beyond features, I contributed to the internal UI system used across products — the kind of work that keeps paying off after you leave the room.",
        scene: {
          kind: "note",
          body: "A shared UI system so the next person ships faster than I did.",
        },
      },
    ],
  },
];
