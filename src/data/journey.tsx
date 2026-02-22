import { TimelineProjectGrid } from "@/components/extended/timeline";
import Link from "next/link";

export const journey_data = [
  {
    date: "Mid 2024",
    role: "Open Source & Independent Builds",
    content: (
      <>
        <p>
          After back-to-back internships, I took time to reset and go deeper into
          fundamentals — system design, DSA, and shipping my own products. This
          phase was less about roles and more about becoming a stronger builder:
          contributing to open source, running projects end-to-end, and
          tightening my development workflow.
        </p>
        <TimelineProjectGrid yearFilter={["2024", "2025"]} />
      </>
    ),
  },
  {
    date: "Early 2024",
    role: "Frontend Engineer Intern at KoinX",
    content: (
      <>
        <p>
          I joined{" "}
          <Link
            href="https://koinx.com?utm_source=kanak.eu.org"
            className="text-foreground font-medium underline underline-offset-4 decoration-border hover:decoration-primary transition-all"
          >
            KoinX
          </Link>
          , a fast-growing crypto tax and compliance platform, where I worked on
          both customer-facing and B2B products at scale.
        </p>
        <p className="mt-4">
          My focus was performance and developer velocity. I migrated legacy CRA
          apps to{" "}
          <strong className="text-foreground font-semibold">
            Vite + TypeScript
          </strong>{" "}
          to drastically reduce build times, optimized multi-language landing
          pages by introducing a single source of truth, and improved{" "}
          <strong className="text-foreground font-semibold">
            SEO and runtime performance
          </strong>
          . I also contributed to the internal UI system used across products.
        </p>
      </>
    ),
  },
  {
    date: "Late 2022",
    role: "SDE Intern at Textify AI",
    content: (
      <>
        <p>
          This is where I moved from “building projects” to working on a real
          product with real users. I joined{" "}
          <Link
            href="https://www.linkedin.com/company/textifyai"
            className="text-foreground font-medium underline underline-offset-4 decoration-border hover:decoration-primary transition-all"
          >
            Textify AI
          </Link>{" "}
          and became part of a small team shipping continuously.
        </p>
        <p className="mt-4">
          I worked across the stack — designing a drag-and-drop AI tool builder,
          migrating authentication to NextAuth, and managing deployments across{" "}
          <strong className="text-foreground font-semibold">
            AWS, Azure, and GCP
          </strong>
          . It was my first experience owning features end-to-end and operating
          what I built in production.
        </p>
        <div className="mt-4 p-4 rounded-xl bg-primary/30 border border-border/50 text-sm">
          <p>
            This phase shaped how I work today: small teams, fast iteration, and
            direct impact on real users.
          </p>
        </div>
      </>
    ),
  },
];