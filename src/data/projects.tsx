import { Icons } from "@/components/icons/icons";

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
  metrics?: { label: string; value: number}[];
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
       {
        label: "Uptime",
        value: 99.9
      },
    ],
    links: [
      {
        type: "Website",
        href: "https://nith.eu.org",
        icon: <Icons.globe className="size-3" />,
      },
      {
        type: "Source",
        href: "https://github.com/kanakkholwal/college-ecosystem",
        icon: <Icons.github className="size-3" />,
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
      "a11y"
    ],
    links: [
      {
        type: "Docs",
        href: "https://docs.nexonauts.com/packages/nexo-mdx",
        icon: <Icons.package className="size-3" />,
      },
      {
        type: "NPM",
        href: "https://www.npmjs.com/package/nexo-mdx",
        icon: <Icons.npm className="size-3" />,
      },
      {
        type: "Source",
        href: "https://github.com/kanakkholwal/nexo-mdx",
        icon: <Icons.github className="size-3" />,
      },
      {
        type: "Demo",
        href: "https://nexo-editor.netlify.app",
        icon: <Icons.globe className="size-3" />,
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
        icon: <Icons.globe className="size-3" />,
      },
      {
        type: "Source",
        href: "https://github.com/kanakkholwal/nexonauts",
        icon: <Icons.github className="size-3" />,
      },
    ],
    image:
      "https://2hy7y2bvb4.ufs.sh/f/zWIvIoJSZF4QlUQcbbwWIN8uDWT37U1Qb9ZftgalzBoCL0Mj",
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
        icon: <Icons.github className="size-3" />,
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
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: "",
    video: "",
  },
];