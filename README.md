<h1 align="center">Hey, I'm Kanak</h1>

<p align="center">
  Product engineer. I build products end to end, from the first sketch to the deploy,<br />
  and I care about the parts people feel before they notice them.
</p>

<p align="center">
  <a href="https://kanakkholwal.eu.org">kanakkholwal.eu.org</a> •
  <a href="https://x.com/kanakkholwal">X</a> •
  <a href="https://www.linkedin.com/in/kanak-kholwal">LinkedIn</a> •
  <a href="https://medium.com/@kanakkholwal">Medium</a> •
  <a href="mailto:contact@kanak.eu.org">contact@kanak.eu.org</a> •
  <a href="https://cal.com/kanakkholwal">Book a call</a>
</p>

<p align="center">
  <img alt="Profile views" src="https://visitor-badge.laobi.icu/badge?page_id=kanakkholwal.visitor-badge" />
</p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kanakkholwal/kanakkholwal/pacmangraph/pacman-contribution-graph-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kanakkholwal/kanakkholwal/pacmangraph/pacman-contribution-graph.svg">
  <img alt="Pacman eating my contribution graph" src="https://raw.githubusercontent.com/kanakkholwal/kanakkholwal/pacmangraph/pacman-contribution-graph.svg">
</picture>

Open to founding engineer roles at early-stage teams.

## Building now

| Project | What it is |
| --- | --- |
| [**Baby UI**](https://github.com/kanakkholwal/baby-ui) · [site](https://baby-ui.nexonauts.com) | Animated, accessible components for React and Svelte. One spec, two hand-written ports, installed with the shadcn CLI as source you own. My portfolio runs on it. |
| [**Recast**](https://github.com/kanakkholwal/recast) · [site](https://recast.li) | An agentic screen recorder and editor: real cursor smoothing, automatic zoom, Rust and FFmpeg under a Tauri app. |
| [**GlyphTeX**](https://github.com/kanakkholwal/glyphtex) · [site](https://glyphtex.nexonauts.com) | The LaTeX editor Overleaf should have been. The engine runs as WebAssembly in your browser, so your papers never leave your machine. |
| [**Docvia**](https://github.com/kanakkholwal/docvia) · [site](https://docvia.dev) | A framework-agnostic documentation engine. Parse markdown once, then render it with React, Svelte or anything else. |
| [**Orbit**](https://github.com/kanakkholwal/orbit) · [site](https://orbit.nexonauts.com) | A free, offline PDF toolkit that runs on your device with WASM. Merge, split and compress without uploading a thing. |
| [**College Ecosystem**](https://github.com/kanakkholwal/college-ecosystem) · [site](https://nith.eu.org) | An open-source platform for NIT Hamirpur: results and rankings, campus tools, polls and communities. 1.8M+ visits. |

## On npm

- [`nexo-mdx`](https://www.npmjs.com/package/nexo-mdx): a headless, plugin-based markdown editor for React that picks up your Tailwind or shadcn theme.
- [`nexo-editor`](https://www.npmjs.com/package/nexo-editor): a lightweight rich text editor for React on TipTap.
- [`custom-domain-sdk`](https://www.npmjs.com/package/custom-domain-sdk): bring-your-own-domain for multi-tenant apps, on Cloudflare Custom Hostnames with a strict lifecycle.
- [`remark-plugins`](https://www.npmjs.com/package/remark-plugins): a collection of remark plugins for markdown processing.
- [`@docvia/*`](https://www.npmjs.com/org/docvia): the Docvia compiler, renderers and plugins, plus the [`docvia`](https://www.npmjs.com/package/docvia) CLI.

Download and star counts are live on [kanakkholwal.eu.org/stats](https://kanakkholwal.eu.org/stats).

## Open source

- [**Bruno**](https://github.com/usebruno/bruno): an open-source IDE for exploring and testing APIs.
- [**Optexity**](https://github.com/optexity/optexity): custom browser agents with AI-powered automation.

<details>
<summary>Earlier work</summary>

- [Mailing system](https://github.com/kanakkholwal/mail-system): a type-safe, portable email service on TypeScript, React Email and Nodemailer.
- [NexoNauts](https://github.com/kanakkholwal/nexonauts) · [site](https://nexonauts.com): an ecosystem for developers, on Next.js and MongoDB.
- [Muse](https://github.com/kanakkholwal/muse-mvp): AI-powered fashion discovery.

</details>

## Stack

[![My stack](https://skillicons.dev/icons?i=ts,js,go,rust,python,react,nextjs,svelte,tauri,vite,tailwind,nodejs,bun,postgres,mongodb,redis,docker,cloudflare,gcp,azure,vercel,figma)](https://kanakkholwal.eu.org)

TypeScript and React or Svelte on the front, Node, Bun, Go or Rust behind it, Postgres or Mongo for data, and Docker on Cloudflare, GCP or Azure to ship it.

## Recent activity

<!--START_SECTION:activity-->
1. 🎉 Merged PR [#39](https://github.com/kanakkholwal/glyphtex/pull/39) in [kanakkholwal/glyphtex](https://github.com/kanakkholwal/glyphtex)
<!--END_SECTION:activity-->

[![Activity graph](https://github-readme-activity-graph.vercel.app/graph?username=kanakkholwal&theme=github-dark-dimmed&custom_title=Kanak%20Activity%20Graph&hide_border=true)](https://github.com/ashutosh00710/github-readme-activity-graph)

---

<details>
<summary><b>About this repo</b>: it's also the source for kanakkholwal.eu.org</summary>

<br />

The portfolio is a TanStack Start app on Cloudflare Workers, built on my own component library.

- **UI**: [Baby UI](https://github.com/kanakkholwal/baby-ui) components and tokens, installed with the shadcn CLI into `src/components/{ui,blocks,charts,text}`. Geist, Geist Mono and Geist Pixel. Solar and Simple Icons, generated from `src/components/icons/icons.json`.
- **Motion**: CSS only, on Baby UI's motion tokens. Page changes use the View Transitions API; text uses Baby UI's text effects.
- **Content**: MDX through fumadocs. Projects in `src/resume/projects`, work in `src/resume/work`, writing in `content/`.
- **Data**: GitHub (GraphQL), npm, Medium, Google Analytics (Data API) and PostHog (HogQL), fetched on the server only and cached across Worker isolates with the Cache API.
- **OG images**: rendered with takumi in `src/og`.

```bash
bun install
bun dev                 # http://portfolio.localhost via portless
bun run dev:app         # plain vite dev
bun run build && bun run preview
```

| Script | Does |
| --- | --- |
| `bun run typecheck` | TypeScript |
| `bunx biome check .` | Lint and format |
| `bun run lint:comments` | Comment gate: comments stay short and earn their place |
| `bun run icons` | Regenerates icons from `icons.json` |
| `bun run deploy` | Builds and deploys the Worker |

Environment variables are listed in [`.env.example`](.env.example). Running and deploying are covered in [`DEPLOYMENT.md`](DEPLOYMENT.md).

</details>
