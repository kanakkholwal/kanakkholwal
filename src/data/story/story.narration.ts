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
      body: "I joined as a five month intern right when ChatGPT went mainstream, and stayed on part time. Small team, ship fast, figure it out as we go.",
      scene: { kind: "headline", body: "AI tools, built before the playbook existed." },
    },
    {
      id: "textify-build",
      heading: "The build I'm proud of",
      body: "The plan was a separate app per idea. After about 20 of them turned slow, I moved us to Next.js, then replaced the lot with one low-code tool builder: form fields carry ids, a custom prompt references them, and user input fills the prompt at runtime before the LLM call.",
      scene: {
        kind: "stack",
        items: ["Next.js", "Vite", "Drag & Drop", "OpenAI", "Streaming", "LangChain"],
      },
    },
    {
      id: "textify-scale",
      heading: "Making it hold up",
      body: "I owned deployments and auth as we grew. Azure to GCP on Docker, and Amazon Cognito to NextAuth with sessions shared securely across subdomains.",
      scene: {
        kind: "stats",
        items: [
          { value: "10K+", label: "Signed-up users" },
          { value: "20 apps → 1 engine", label: "Low-code tool builder" },
          { value: "Azure → GCP", label: "Dockerized deploys" },
        ],
      },
    },
    {
      id: "textify-takeaway",
      heading: "What it taught me",
      body: "Wearing every hat on a small team, frontend, auth, backend, and DevOps, is still how I like to work.",
      scene: { kind: "note", body: "One good abstraction can retire twenty features." },
    },
  ],

  koinx: [
    {
      id: "koinx-room",
      heading: "The room I walked into",
      body: "KoinX builds crypto tax software for people across different countries. I came in as a frontend intern and worked both the consumer dashboard and an internal tool for accountants.",
      scene: { kind: "headline", body: "Crypto tax, for consumers and the accountants who file it." },
    },
    {
      id: "koinx-velocity",
      heading: "Taking the initiative",
      body: "Nobody asked me to, but I branched a production app and migrated it from Create React App to Vite. My lead liked it and handed me the rest, so I moved all of the CRA repos over, SVG quirks and all.",
      scene: {
        kind: "stack",
        items: ["React", "Vite", "TypeScript", "Next.js", "SSR", "Design System"],
      },
    },
    {
      id: "koinx-impact",
      heading: "Where it moved the needle",
      body: "Our multi-country landing site hydrated everything on the client from one big JSON file, so it dragged. I moved rendering to build time and SSR and made the content imports tree-shakable, with no extra libraries.",
      scene: {
        kind: "stats",
        items: [
          { value: "60 → 88", label: "PageSpeed score" },
          { value: "5+ repos", label: "CRA → Vite" },
          { value: "Core Web Vitals", label: "Improved, no libraries" },
        ],
      },
    },
    {
      id: "koinx-system",
      heading: "Leaving something behind",
      body: "I also built components for the shared UI library so the next person shipped consistent screens faster.",
      scene: { kind: "note", body: "Fix the slowest part of the system, not just your ticket." },
    },
  ],

  virallens: [
    {
      id: "virallens-now",
      heading: "Building for a US law firm",
      body: "A short, dense full-time run building software for a US law firm's class action practice. Local-first tooling, AI document pipelines, and the observability to keep it all honest.",
      scene: { kind: "headline", body: "Local-first editing, AI agents, and legal analysis in one stack." },
    },
    {
      id: "virallens-build",
      heading: "What I built",
      body: "A local-first markdown engine and editor that runs fully offline on IndexedDB, with tabbed multi-document editing and PDF export. Then a DOCX MCP that lets multiple AI agents co-edit one document with low-level control, down to sections, a table of contents, and a table of authorities.",
      scene: {
        kind: "stack",
        items: ["IndexedDB", "Local-first", "Rich Text Editor", "DOCX MCP", "AI Agents", "TypeScript"],
      },
    },
    {
      id: "virallens-ai",
      heading: "The AI side",
      body: "I built the agent pipelines for content generation, analysis, and fact verification with per-section scoring, plus tools that estimate damages and predict how the market might react to a given class action.",
      scene: {
        kind: "stats",
        items: [
          { value: "Multi-agent", label: "Document co-editing" },
          { value: "Fact-checked", label: "Scored and highlighted" },
          { value: "Offline-first", label: "Runs in the browser" },
        ],
      },
    },
    {
      id: "virallens-ops",
      heading: "Keeping it honest",
      body: "I wired up the observability too. A unified analytics platform for process cost and latency, Better Stack per app, and PostHog on client work.",
      scene: { kind: "note", body: "Ship the feature, then build the thing that tells you it works." },
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
      body: "A senior's results-ranking tool graduated with him, so I rebuilt it from a JSON file and a scraper. It grew into the platform most of my campus quietly runs on.",
      scene: { kind: "headline", body: "The platform an entire campus quietly runs on." },
    },
    {
      id: "college-stack",
      heading: "The hard part",
      body: "Results are the draw, and the college's in-house server can't take load. So I batch roll numbers through Redis queues and stream results to the database and the dashboard at once, refreshing the whole college with one button.",
      scene: {
        kind: "stack",
        items: ["Next.js", "Go", "Express", "Redis Queues", "Turborepo", "Docker"],
      },
    },
    {
      id: "college-traction",
      heading: "Who it reached",
      body: "Not officially adopted, but nearly every student uses it. Built and maintained solo, fully open source.",
      scene: {
        kind: "stats",
        items: [
          { value: "740+", label: "Signed-up students" },
          { value: "1M+", label: "Impressions in 4 months" },
          { value: "40K+", label: "Google impressions / mo" },
        ],
      },
    },
  ],
  orbit: [
    {
      id: "orbit-why",
      heading: "Why I built it",
      body: "I needed to merge a PDF and realized every tool online wanted to upload my file first. For anything sensitive, that is a bad trade, so I built one that never uploads a thing.",
      scene: { kind: "headline", body: "PDF tools that never upload your files." },
    },
    {
      id: "orbit-how",
      heading: "How it works",
      body: "Everything runs on your device. Heavy operations like compression run on WebAssembly, so it is fast without a server. It works in the browser, installs as a PWA, and ships as a Tauri desktop app.",
      scene: {
        kind: "stack",
        items: ["Svelte 5", "SvelteKit", "WASM", "Tauri", "PWA", "TypeScript"],
      },
    },
    {
      id: "orbit-point",
      heading: "The point",
      body: "Nothing here is groundbreaking. It is convenience done properly: a clean UI, no limits, and your files stay yours.",
      scene: { kind: "note", body: "Private by default. No uploads, no quotas, no subscriptions." },
    },
  ],
  recast: [
    {
      id: "recast-why",
      heading: "Why I built it",
      body: "I wanted a good build-in-public video for Orbit. Windows' native recorder was flat, and the polished tools were paywalled, heavy, or Mac only. So I built my own on Windows.",
      scene: { kind: "headline", body: "A screen recorder that makes raw captures look deliberate." },
    },
    {
      id: "recast-turning-point",
      heading: "The turning point",
      body: "The editor started on a plain video element and was never smooth enough. Moving to the WebCodecs API for frame-level control fixed it. Native capture and FFmpeg encoding run in Rust under a Tauri app.",
      scene: {
        kind: "stack",
        items: ["Rust", "Tauri", "SvelteKit", "WebCodecs", "FFmpeg", "Svelte 5"],
      },
    },
    {
      id: "recast-who",
      heading: "Who it's for",
      body: "A free, open-source Loom alternative for solo developers, creators, and small teams. Share to Google Drive, the Recast cloud, or your own S3, R2, Azure, or GCS.",
      scene: { kind: "note", body: "Free and open source, with your files on your own storage." },
    },
  ],
};
