<h1 align="center">
<img src="https://emojis.slackmojis.com/emojis/images/1531849430/4246/blob-sunglasses.gif?1531849430" width="30"/> Hey! I'm
<b>Kanak Kholwal</b>
</h1>



<p align="center">
  <a href="https://x.com/kanakkholwal" target="_blank">twitter</a> •
  <a href="https://www.linkedin.com/in/kanak-kholwal/" target="_blank">linkedin</a> •
  <a href="https://github.com/kanakkholwal" target="_blank">github</a> •
  <a href="https://medium.com/@kanakkholwal" target="_blank">medium</a> •
  <a href="mailto:kanakkholwal@gmail.com" target="_blank">email</a>
</p>
<p align="center">
 <img alt="Github" src="https://visitor-badge.laobi.icu/badge?page_id=kanakkholwal.visitor-badge" />
</p>
<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kanakkholwal/kanakkholwal/pacmangraph/pacman-contribution-graph-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kanakkholwal/kanakkholwal/pacmangraph/pacman-contribution-graph.svg">
    <img alt="pacman contribution graph" src="https://raw.githubusercontent.com/kanakkholwal/kanakkholwal/pacmangraph/pacman-contribution-graph.svg">
</picture>


## My Stack

[![My Skills](https://skillicons.dev/icons?i=js,ts,go,rust,python,tauri,docker,postgres,mongodb,redis,firebase,npm,pnpm,git,github,gcp,azure,svelte,nextjs,vite,tailwind,notion,react,express,nodejs,svg,vercel,postman,figma,bootstrap,html,css,sass,php)](https://kanakkholwal.eu.org)


## Current work
- [**Recast**](https://github.com/kanakkholwal/recast) - Agentic video recorder and editor
- [**Docvia**](https://github.com/kanakkholwal/docvia) - framework agnostic documentation compiler
- [**GlyphX**](https://github.com/kanakkholwal/glyphx) - A fast, powerfull LaTeX editor that Overleaf should have been
- [**College Ecosystem**](https://github.com/kanakkholwal/college-ecosystem) - Next.js/TS platform; 1M+ visits; realtime polls, rankings, communities.
- [**Orbit**](https://github.com/kanakkholwal/orbit) - browser-first pdf utility application

- [**Mailing system**](https://github.com/kanakkholwal/mail-system) - A modern, type-safe & portable email service built with Typescript, React Email, and Nodemailer.

- [**Markdown Editor**](https://github.com/kanakkholwal/nexo-mdx) - plugin-based Markdown Editor with React + TS + shadcn UI / Tailwind css ; rendering speed +35%; 300+ weekly downloads.
- [**Rich Text Editor**](https://github.com/kanakkholwal/nexo-editor) - A lightweight, customizable React Rich Text Editor built on TipTap
- [**Remark Plugins**](https://github.com/kanakkholwal/remark-plugins) - A collection of remark plugins for markdown processing.

- [Custom Domain Management SDK](https://github.com/kanakkholwal/custom-domain-sdk) : a framework-agnostic **SDK** for **multi-tenant domain** onboarding using strict lifecycle state machine

- [Muse](https://github.com/kanakkholwal/muse-mvp) : AI-powered fashion discovery
- [NexoNauts.com](https://github.com/kanakkholwal/nexonauts) | [Live](https://nexonauts.com) : Ecosystem for developers (Next.js, Shadcn UI, MongoDB)_

  
### Open Source 

- [**Bruno**](https://github.com/usebruno/bruno) - Opensource IDE For Exploring and Testing API's (lightweight alternative to Postman/Insomnia)
- [**Optexity**](https://github.com/optexity/optexity) - Build custom browser agents with AI-powered automation
  

## building from zero
- I build from zero. Whether it's frontend, backend, full-stack applications, or AI-powered experiences, I work across the entire development lifecycle. From UI/UX to deployment to user feedback, I care less about technology debates and more about delivering results that people love using.
- Domain knowledge of Full-stack AI apps development, scalable systems design, and **devops/cloud computing**.

## Experience

### ViralLens - _Bengaluru, India_

**SDE - Full Stack** | _Mar 2026 - Jun 2026_

ViralLens is a digital marketing company. I worked on its tech side building software for a US law firm's class action practice, a short full-time run of about four months where I owned a lot of ground across local-first tooling, AI pipelines, and observability.

- Built a **local-first markdown engine and rich text editor** that runs entirely in the browser on **IndexedDB**. Full offline storage, multi-document handling with tabbed editing, and PDF export. It can lean on up to 80% of the device's storage quota when it needs to, so notes and prompts stay on the machine and never touch a server.
- Built a **DOCX MCP** that lets multiple AI agents edit and collaborate on the same document with low-level API control. It exposes tools for the parts a real legal document needs: create, search, and update sections, a table of contents, and a **table of authorities**.
- Built the **AI agent pipelines** behind the product: content generation, content analysis, and fact verification, with per-section scoring and highlighting so you can see exactly what held up and what didn't.
- Built market and legal analysis tools that score stock performance and estimated damages, then predict a **market reaction score** for how a given class action might land, alongside a good amount of legal text processing.
- Set up the **observability layer**: a unified analytics platform tracking how long processes run and what they cost, per-application error and failure tracking with **Better Stack**, and **PostHog** on client projects to see how people actually used what we shipped.
- Wrote the internal documentation and refactored the codebase early on to make the rest of this possible.

### Textify AI - _Remote_

**Software Developer** | _Dec 2022 - Jun 2024_

I joined right as ChatGPT went mainstream, when the whole plan was to ship AI tools fast and see what stuck. Started as a five month intern and stayed on part time, mostly on the frontend but picking up auth, deployments, and backend whenever the small team needed it.

- The founder wanted a separate app for every idea he could think of: LinkedIn bio generator, summarizer, resume writer, "turn this into that", and a long list beyond. I first moved the React codebase to **Vite** to speed up the dev loop, then migrated everything to **Next.js** once we were juggling around 20 of these tools and the old setup turned slow and buggy.
- Twenty hardcoded tools was never going to scale, and a separate endpoint per tool made no sense. So I built a **low-code, drag-and-drop tool builder**. You lay out a form (text, textarea, select, multi-select), each field gets a unique id, and you write one prompt that references those ids by mention. At runtime we swap the mentions for the user's real input, send it through the **OpenAI** call, and stream back the text or image. One engine replaced twenty apps, and anyone on the team could ship a new tool without an engineer.
- Owned deployments end to end. We started on **Azure** shipping through **GitHub Actions**, then I moved us to **GCP** with **Docker** and their container registry, which made releases far more predictable.
- Migrated authentication from **Amazon Cognito** to **NextAuth**. The hard part was sharing a session securely across subdomains, which I solved with correctly scoped, secure cookies.
- When we pivoted to news and financial analytics, I worked the document-analysis side with **LangChain** and web search, turning results into charts on a multi-tenant setup.
- Reworked the UI and UX as we grew to roughly **10,000 signed-up users**, with a share of them converting to paid.

### KoinX - _Remote_

**Frontend Engineer** | _Mar 2024 - Jun 2024_

KoinX builds crypto tax software, the tool people across different countries use to work out and report what they owe on their crypto. I came in as a frontend engineer for a three month internship and worked across both sides of the product.

- Started on the consumer dashboard, shipping new pages, charts, and graphs, then moved onto an internal tool used by chartered accountants along with a few team-only features.
- On my own, without being asked, I branched one of our production apps and migrated it from **Create React App** to **Vite** for a much better developer experience. My lead liked the result and asked me to do the rest, so I migrated all five to six production CRA repos over. The trickiest part was SVG handling, which I sorted out with the right Vite plugins.
- Built new components for the **internal UI component library** so the interface stayed consistent across our apps.
- Our marketing site was expanding to multiple languages and countries, but it hydrated everything on the client and pulled all content from a single JSON file, so it kept getting slower. I moved rendering to build time and server-side in **Next.js**, and made the content imports **tree-shakable** so a page only loads what it needs.
- With no extra libraries, just lazy loading, dynamic imports, and runtime code splitting, I took the site's **PageSpeed performance score from around 60 to 88** and improved **Core Web Vitals** across the board.

## Skills

**Languages** :  JavaScript, TypeScript, Go, Python, Rust, Php, C++

**Frontend & Frameworks** :  React.js, Next.js, Svelte 5, Sveltkit,Tauri, Vite, TailwindCSS, Shadcn UI, SASS, Turbopack

**Backend:** Node.js, Express.js,Hono, FastAPI, Go Fiber, REST APIs, Microservices

**Databases:** PostgreSQL, MongoDB, Redis, Firebase, Supabase

**Cloud/DevOps:** Docker, Kubernetes, AWS, GCP, Azure, GitHub Actions, Vercel, CI/CD

**Other:** Algorithms & Data Structures (150+ LeetCode), System Design, Performance Optimization, UI/UX


---


**:zap: Recent Activity:**

<!--START_SECTION:activity-->
1. 🎉 Merged PR [#3](https://github.com/kanakkholwal/kanakkholwal/pull/3) in [kanakkholwal/kanakkholwal](https://github.com/kanakkholwal/kanakkholwal)
<!--END_SECTION:activity-->



[![activity graph](https://github-readme-activity-graph.vercel.app/graph?username=kanakkholwal&theme=github-dark-dimmed&custom_title=Kanak%20Activity%20Graph&hide_border=true)](https://github.com/ashutosh00710/github-readme-activity-graph)
