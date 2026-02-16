import { Icon } from "@/components/icons";

export type ProjectType = {
  id: string;
  title: string;
  href: string;
  dates: string;
  active: boolean;
  status: "Shipped" | "In Progress" | "Archived" | string;
  description: string; // Short summary for cards
  content: string;     // Detailed Markdown for project page
  technologies: string[];
  links: {
    type: string;
    href: string;
    icon: React.ReactNode;
  }[];
  image: string;
  video: string;
  tags?: string[];
  metrics?: { label: string; value: number }[];
}

export const projectsList: ProjectType[] = [
  {
    id: "college-ecosystem",
    title: "NITH Digital Ecosystem",
    href: "https://app.nith.eu.org",
    dates: "Jan 2025 - Present",
    active: true,
    status: "Shipped",
    description:
      "A high-scale EdTech monorepo serving 740+ users with role-based access control, academic result analysis, and real-time campus utility tools.",
    content: `
### **The Architecture**
The **College Ecosystem** is engineered as a scalable **Monorepo** using **TurboRepo**, orchestrating multiple independent applications into a cohesive digital campus experience. It solves the fragmentation of college utilities by unifying them under one authentication provider.

### **Core Engineering Features**
- **Hybrid Backend Architecture:** Utilizes **Next.js (App Router)** for the interactive frontend platform and a dedicated **Express.js/TypeScript** server for heavy computational tasks like result scraping and cron jobs.
- **Role-Based Access Control (RBAC):** Implemented a granular permission system managing access for Admins, Faculty, Wardens, and Students. Features dynamically render based on the user's scope.
- **High-Performance Scraping:** Built a robust scraping engine to parse legacy academic result PDFs and store them in **Postgres (Drizzle ORM)**, enabling students to visualize their GPA trends over semesters.
- **Real-Time Booking:** Engineered a classroom and resource booking system using **Redis** to prevent race conditions during high-demand slots.

### **Tech Stack**
- **Frontend:** Next.js 14, TailwindCSS, Shadcn UI
- **Backend:** Express.js, Node.js
- **Data:** MongoDB (User Data), Postgres (Academic Data), Redis (Caching)
- **DevOps:** Docker, GitHub Actions CI/CD
    `,
    technologies: [
      "Next.js",
      "TurboRepo",
      "Express.js",
      "PostgresQL",
      "Redis",
      "Docker",
      "RBAC"
    ],
    metrics: [
      {
        label: "Impressions",
        value: 1_200_000
      },
      {
        label: "Active Users",
        value: 740
      },
    ],
    links: [
      {
        type: "Website",
        href: "https://nith.eu.org",
        icon: <Icon name="globe" className="size-3" />,
      },
      {
        type: "Source",
        href: "https://github.com/kanakkholwal/college-ecosystem",
        icon: <Icon name="github" className="size-3" />,
      },
    ],
    image:
      "https://2hy7y2bvb4.ufs.sh/f/zWIvIoJSZF4Q8fkvTJrLAESoTyORbnBq8xC7wQu4rKdJhHvY",
    video: "",
  },
  {
    id: "nexo-editor",
    title: "Nexo MDX Editor",
    href: "https://github.com/kanakkholwal/nexo-mdx",
    dates: "Aug 2025",
    active: true,
    status: "Shipped",
    description:
      "A headless, accessible-first React Markdown editor package designed to inherit your Tailwind/Shadcn themes via CSS modules.",
    content: `
### **Overview**
**Nexo MDX** is a React-based Markdown editor built to solve the styling fragmentation in rich text editors. Unlike traditional editors that force their own styles, Nexo adopts a **"Headless UI" philosophy**, allowing developers to control the look and feel completely using their own utility classes.

### **Key Technical Capabilities**
- **Native Accessibility:** Built on top of native \`textarea\` elements to ensure full screen-reader compatibility and correct form submission behavior without hydration mismatches.
- **Plugin Architecture:** Supports **Remark** and **Rehype** plugins, allowing developers to extend functionality (e.g., adding mathematical formulas or code highlighting) without forking the core library.
- **CSS Module Injection:** Features a unique styling engine where developers can override internal component styles using global CSS variables or direct class targeting (e.g., \`.nexo-mdx-editor .toolbar\`).

### **Implementation**
\`\`\`tsx
import React, { useState } from 'react';
import MdxEditor from 'nexo-mdx';

export function Editor() {
  const [mdValue, setMdValue] = useState('');

  return (
    <MdxEditor
      value={mdValue}
      onChange={(value, _) => setMdValue(value)}
      className="border-zinc-800"
    />
  );
}
\`\`\`
    `,
    technologies: [
      "React.js",
      "TypeScript",
      "TailwindCSS",
      "Shadcn UI",
      "NPM Package",
    ],
    links: [
      {
        type: "Docs",
        href: "https://docs.nexonauts.com/packages/nexo-mdx",
        icon: <Icon name="docs" className="size-3" />,
      },
      {
        type: "NPM",
        href: "https://www.npmjs.com/package/nexo-mdx",
        icon: <Icon name="package" className="size-3" />,
      },
      {
        type: "Source",
        href: "https://github.com/kanakkholwal/nexo-mdx",
        icon: <Icon name="github" className="size-3" />,
      },
      {
        type: "Demo",
        href: "https://nexo-editor.netlify.app",
        icon: <Icon name="globe" className="size-3" />,
      },
    ],
    image:
      "",
    video: "",
  },
  {
    id: "nexonauts",
    title: "Nexonauts Marketplace",
    href: "https://nexonauts.com",
    dates: "Jan 2024 - Feb 2024",
    active: true,
    status: "Shipped",
    description:
      "A SaaS marketplace connecting frontend developers with curated assets, featuring Stripe Connect payouts and automated portfolio generation.",
    content: `
### **The Platform**
Nexonauts is a **dual-sided marketplace** designed to streamline the "concept-to-code" pipeline. It allows creators to sell frontend templates while enabling developers to generate instant, hosted portfolios from those assets.

### **Technical Highlights**
- **Stripe Connect Integration:** Engineered a custom payout flow using Stripe Connect, allowing automated revenue splitting between the platform and template creators.
- **Secure Asset Delivery:** Implemented signed URL generation with **AWS S3** to ensure purchased digital assets are only accessible to verified buyers.
- **Dynamic Portfolios:** Built a template engine that parses user data and injects it into pre-built React components, rendering a personalized portfolio site in sub-100ms.
    `,
    technologies: [
      "Next.js",
      "Stripe Connect",
      "MongoDB",
      "AWS S3",
      "Zod",
      "SaaS"
    ],
    links: [
      {
        type: "Website",
        href: "https://nexonauts.com",
        icon: <Icon name="globe" className="size-3" />,
      },
      {
        type: "Source",
        href: "https://github.com/kanakkholwal/nexonauts",
        icon: <Icon name="github" className="size-3" />,
      },
    ],
    image:
      "https://2hy7y2bvb4.ufs.sh/f/zWIvIoJSZF4QlUQcbbwWIN8uDWT37U1Qb9ZftgalzBoCL0Mj",
    video: "",
  },
  {
    id: "custom-domain-sdk",
    title: "Custom Domain SDK",
    href: "https://www.npmjs.com/package/custom-domain-sdk",
    dates: "Feb 2025 - Feb 2025",
    active: true,
    status: "Shipped",
    description:
      "TypeScript SDK for managing custom domains using Cloudflare like Custom Hostnames",
    content: `
### **Custom Domain SDK**


A production-grade TypeScript SDK for managing custom domains using Cloudflare like Custom Hostnames. This SDK is framework-agnostic, database-agnostic, and implements a strict domain lifecycle state machine.

Features
--------


-   Strict State Machine: Ensures deterministic transitions .
-   Framework Agnostic: Works in Node.js, Bun, or any other JS runtime.
-   Provider Agnostic (Persistence): Abstracted behind a <code>DomainStore</code> interface.
-   Provider Agnostic (DNS): Abstracted behind a <code>DnsResolver</code> interface.
-   Typed Errors: Proper error handling for easier debugging.
For detailed usage, architecture, and API reference, see [DOCUMENTATION.md](https://github.com/kanakkholwal/custom-domain-sdk/blob/main/DOCUMENTATION.md).



- [Installation](https://github.com/kanakkholwal/custom-domain-sdk#installation)


- [Quick Start](https://github.com/kanakkholwal/custom-domain-sdk#quick-start)

- [Domain Lifecycle](https://github.com/kanakkholwal/custom-domain-sdk#domain-lifecycle)

### **Domain Lifecycle**

The SDK enforces the following state transitions:

1.  created: Internal record created.
2.  pending_verification: Waiting for TXT record verification.
3.  verified: TXT record matched.
4.  pending_dns: Waiting for CNAME/A record to point to our edge.
5.  provisioning_ssl: Calling Cloudflare to issue certificates.
6.  active: Domain is live.
7.  failed: Terminating state for any step.

Architecture
------------

[](https://github.com/kanakkholwal/custom-domain-sdk#architecture)

Why this exists
---------------

[](https://github.com/kanakkholwal/custom-domain-sdk#why-this-exists)

Custom domains look trivial until you try to ship them properly.

At first it's just: "Add a TXT record, point a CNAME, redirect traffic."

Then reality hits:

-   Subdomains vs apex domains behave differently
-   DNS propagation lies to you
-   CNAME-only checks break with ALIAS / flattened records
-   TLS provisioning is asynchronous and stateful
-   Providers return half-documented statuses
-   You end up rewriting the same glue code in every project

Most implementations mix all of this directly into app code, with hidden assumptions and implicit state transitions. It works.. until it doesn't, and then it's painful to debug.

This SDK exists to make that logic *explicit, deterministic, and reusable*.

Non-goals
---------

[](https://github.com/kanakkholwal/custom-domain-sdk#non-goals)

This project is intentionally scoped. If you're looking for an all-in-one platform, this is probably not it.

This SDK does not:

-   Try to be a DNS provider

-   Serve HTTP traffic or handle redirects

-   Automatically retry, poll, or "eventually fix" DNS issues

-   Hide provider limitations or quota constraints

-   Manage databases, background jobs, or cron workers

-   Abstract away infrastructure reality

It also does not attempt to:

-   Guess DNS intent (CNAME vs A vs ALIAS)

-   Verify ownership at parent domains for convenience

-   Auto-advance states behind the scenes

-   Paper over Cloudflare (or any provider) errors

Every state transition is explicit.\
Every failure is surfaced.\
Retries and polling are the caller's responsibility by design.

If you want something that "just works" by doing magic in the background, this SDK will feel strict.


    `,
    technologies: [
      "TypeScript",
      "Cloudflare API",
      "DNS Management",
      "NPM Package"
    ],
    links: [
      {
        type: "Documentation",
        href: "https://docs.nexonauts.com/docs/packages/custom-domain-sdk",
        icon: <Icon name="book" className="size-3" />,
      },
      {
        type: "Source",
        href: "https://github.com/kanakkholwal/custom-domain-sdk",
        icon: <Icon name="github" className="size-3" />,
      },
      {
        type: "Package",
        href: "https://www.npmjs.com/package/custom-domain-sdk",
        icon: <Icon name="package" className="size-3" />,
      },
    ],
    image:
      "",
    video: "",
  },
  {
    id: "crawler-llms",
    title: "RAG Data Pipeline Crawler",
    href: "https://github.com/kanakkholwal/crawler-for-llms",
    dates: "Feb 2025",
    active: true,
    status: "Shipped",
    description:
      "A high-throughput web crawler optimized for extracting and normalizing data for LLM fine-tuning and Vector DB ingestion.",
    content: `
### **Engineering the Pipeline**
This tool addresses the data bottleneck in **Retrieval-Augmented Generation (RAG)** workflows. It is designed to navigate complex DOM structures, handle rate limits, and convert unstructured HTML into semantic JSONL datasets.

### **Features**
- **Puppeteer Clustering:** Manages a pool of headless browser instances to crawl pages concurrently without memory leaks.
- **Data Normalization:** Automatically strips non-content DOM elements (ads, navbars) to reduce token usage during LLM ingestion.
- **Resilience:** Implements exponential backoff strategies and proxy rotation to handle anti-bot measures.
    `,
    technologies: [
      "Node.js",
      "Puppeteer",
      "Data Engineering",
      "Vector Embeddings",
      "RAG"
    ],
    links: [
      {
        type: "Source",
        href: "https://github.com/kanakkholwal/crawler-for-llms",
        icon: <Icon name="github" className="size-3" />,
      },
    ],
    image: "",
    video: "",
  },
  {
    id: "mail-system",
    title: "Serverless Email Automation",
    href: "https://github.com/kanakkholwal/mail-system",
    dates: "Feb 2025",
    active: true,
    status: "Shipped",
    description:
      "An event-driven mailing architecture using Next.js Server Actions and Cron jobs for cost-effective, scalable communication.",
    content: `
### **System Design**
Built to replace expensive marketing email tools, this system leverages **Serverless Functions** to handle high-volume email dispatching on a pay-per-use model.

### **Core Logic**
- **Queue Management:** Utilizes database-backed queues to handle email bursts, ensuring reliable delivery without hitting SMTP rate limits.
- **Templating Engine:** Integrates **React Email** to render responsive HTML emails directly from React components.
- **Cron Scheduling:** Deployed edge-compatible cron jobs to automate weekly newsletter dispatching and user retention sequences.
    `,
    technologies: [
      "Next.js Server Actions",
      "React Email",
      "Resend API",
      "Cron Jobs",
      "Edge Functions"
    ],
    links: [
      {
        type: "Source",
        href: "https://github.com/kanakkholwal/mail-system",
        icon: <Icon name="github" className="size-3" />,
      },
    ],
    image: "",
    video: "",
  },
   {
    id: "nexo-pdf",
    title: "Nexo PDF",
    href: "https://github.com/kanakkholwal/nexo-pdf",
    dates: "Feb 2026 - Present",
    active: true,
    status: "In Progress",
    description:
      "professional, high-performance PDF toolkit that runs entirely in your browser",
    content: `
NexoPDF is a professional, high-performance PDF toolkit that runs entirely in your browser. By leveraging powerful WebAssembly (WASM) engines, it ensures your documents never leave your device, providing world-class security and speed.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Svelte](https://img.shields.io/badge/Svelte-5.0-ff3e00?logo=svelte)](https://svelte.dev)
[![WASM](https://img.shields.io/badge/Engine-WASM-654ff0?logo=webassembly)](https://webassembly.org)

## ✨ Why NexoPDF?

*   **🔒 100% Private & Secure**: All processing happens locally in your browser's sandbox. Zero server uploads, zero data transfer.
*   **⚡ Native Speed**: Powered by a high-performance WASM engine for desktop-class processing speeds.
*   **📱 Offline Capable**: Fully functional without an internet connection. Install it as a PWA for a seamless desktop experience (available soon).
*   **♾️ Unlimited Everything**: No daily quotas, no file size caps, and no subscriptions. Batch process as much as your hardware handles.

## 🛠️ Essential Tools

| Tool | Description |
| :--- | :--- |
| **Merge PDF** | Combine multiple files into one. Drag and drop to reorder. |
| **Split PDF** | Extract pages, split ranges, or divide files into multiple documents. |
| **Compress PDF** | Reduce file sizes while maintaining professional quality. |
| **Image to PDF** | Instant conversion for JPG, PNG, and HEIC formats. |
| **PDF Multi-Tool** | The ultimate workspace to rearrange, rotate, and export pages. |

## 🚀 Tech Stack

NexoPDF is built with cutting-edge technologies for maximum performance and reliability:

- **Frontend**: [Svelte 5](https://svelte.dev/) (Runes), [SvelteKit](https://kit.svelte.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **PDF Core**: [`pdf-lib`](https://pdf-lib.js.org/), [`pdfjs-dist`](https://mozilla.github.io/pdf.js/)
- **WASM Engine**: [`@neslinesli93/qpdf-wasm`](https://github.com/neslinesli93/qpdf-wasm)
- **Icons**: [Lucide Svelte](https://lucide.dev/)
- **Linting**: [Biome](https://biomejs.dev/)



    `,
    technologies: [
      "TypeScript",
      "Svelte",
     "Svelte 5 Runes",
      "Sveltekit",
      "WASM",
      "Tailwind"
    ],
    links: [
     
      {
        type: "Source",
        href: "https://github.com/kanakkholwal/nexo-pdf",
        icon: <Icon name="github" className="size-3" />,
      },
    ],
    image:
      "",
    video: "",
  },
];
