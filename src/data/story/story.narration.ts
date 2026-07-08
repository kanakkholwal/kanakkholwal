import type { StoryBeat } from "./story.types";

// The creative layer: cinematic narration for the milestones worth hand-tuning.
// Facts (dates, role, links, tech, metrics) live in the resume MDX and are
// merged in by story.build.ts — only the story lives here.

// Keyed by work `company` (lowercased).
export const WORK_NARRATION: Record<string, StoryBeat[]> = {
  "textify ai": [
    {
      id: "textify-room",
      heading: "My first real product",
      body: "This is where I went from building projects to shipping to real users, on a small team that iterated every day.",
      scene: { kind: "headline", body: "No-code AI, before it was everywhere." },
    },
    {
      id: "textify-build",
      heading: "What I built",
      body: "A no-code AI workflow engine. A drag-and-drop canvas where anyone could compose schema-driven LLM chains across text, image, and markdown.",
      scene: {
        kind: "stack",
        items: ["Next.js", "Drag & Drop", "LLM Chains", "NextAuth", "RBAC + MFA"],
      },
    },
    {
      id: "textify-scale",
      heading: "Making it hold up",
      body: "I moved the platform across three clouds and containerized the pipeline, then broke a monolith into RESTful services.",
      scene: {
        kind: "stats",
        items: [
          { value: "AWS → Azure → GCP", label: "Multi-cloud migration" },
          { value: "−30%", label: "Deploy build times" },
          { value: "Docker + CI/CD", label: "Containerized pipeline" },
        ],
      },
    },
    {
      id: "textify-takeaway",
      heading: "What it taught me",
      body: "Owning features end to end, and operating them in production, is still how I like to work.",
      scene: { kind: "note", body: "Small team, fast iteration, direct impact on real users." },
    },
  ],

  koinx: [
    {
      id: "koinx-room",
      heading: "The room I walked into",
      body: "A fast-growing crypto tax and compliance platform, where I worked across both the consumer product and the B2B side at real scale.",
      scene: { kind: "headline", body: "Fintech at scale. B2B and consumer, one codebase." },
    },
    {
      id: "koinx-velocity",
      heading: "Chasing velocity",
      body: "I led the migration of legacy Create-React-App repos to Vite + TypeScript, then built out a centralized i18n and SEO architecture.",
      scene: {
        kind: "stack",
        items: ["React", "Vite", "TypeScript", "i18n", "SEO", "Design Tokens"],
      },
    },
    {
      id: "koinx-impact",
      heading: "Where it moved the needle",
      body: "Faster builds for the whole team, localized landing pages that lifted organic traffic, and tightened core web vitals.",
      scene: {
        kind: "stats",
        items: [
          { value: "−60%", label: "Build times" },
          { value: "+150%", label: "Organic traffic" },
          { value: "Core Web Vitals", label: "Optimized" },
        ],
      },
    },
    {
      id: "koinx-system",
      heading: "Leaving something behind",
      body: "I co-built the internal UI component library, enforcing design-system tokens across every crypto dashboard.",
      scene: { kind: "note", body: "A shared UI system so the next person ships faster than I did." },
    },
  ],

  virallens: [
    {
      id: "virallens-now",
      heading: "Where I am now",
      body: "Building local-first documentation tooling. Offline-capable editing, backed by an AI agent swarm that drafts and collaborates.",
      scene: { kind: "headline", body: "Local-first docs, powered by an AI agent swarm." },
    },
    {
      id: "virallens-build",
      heading: "What I'm building",
      body: "A high-performance markdown engine and rich-text editor, plus a centralized docs platform with auto-sync and OpenAPI support.",
      scene: {
        kind: "stack",
        items: ["Markdown Engine", "Rich Text Editor", "OpenAPI", "Better Stack", "LLM Agents"],
      },
    },
    {
      id: "virallens-ops",
      heading: "Keeping it observable",
      body: "End-to-end observability across distributed services. Log management, uptime monitoring, and alerting wired in from day one.",
      scene: {
        kind: "stats",
        items: [
          { value: "Multi-agent", label: "AI document generation" },
          { value: "Offline-first", label: "Local editing" },
          { value: "E2E", label: "Logs · uptime · alerts" },
        ],
      },
    },
  ],
};

// Keyed by project `id`. Optional — projects without an entry are auto-derived
// from their frontmatter in story.build.ts.
export const PROJECT_NARRATION: Record<string, StoryBeat[]> = {
  "college-ecosystem": [
    {
      id: "college-what",
      heading: "What it is",
      body: "A production-grade, monorepo college platform. Academic tools, campus resources, community, and admin dashboards in one system.",
      scene: { kind: "headline", body: "One ecosystem for an entire campus." },
    },
    {
      id: "college-stack",
      heading: "How it's built",
      body: "A polyglot monorepo with role-based access control, result analysis, and real-time utilities.",
      scene: {
        kind: "stack",
        items: ["Next.js", "Express.js", "Postgres", "MongoDB", "Redis", "Bun", "Docker"],
      },
    },
    {
      id: "college-traction",
      heading: "Who it reached",
      body: "Shipped and running in production for a real student body.",
      scene: {
        kind: "stats",
        items: [
          { value: "740+", label: "Active users" },
          { value: "1.2M", label: "Impressions" },
          { value: "Open source", label: "End to end" },
        ],
      },
    },
  ],
};
