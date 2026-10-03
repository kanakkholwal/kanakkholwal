import type { ReactNode } from "react";
import { JourneyProjects } from "@/components/extras/journey-projects";
import { TextLink } from "@/components/site/link";

export type JourneyEntry = { date: string; role: string; content: ReactNode };

const Strong = ({ children }: { children: ReactNode }) => (
  <strong className="font-medium text-foreground">{children}</strong>
);

const RECENT_YEARS = ["2024", "2025"];

export const journey_data: JourneyEntry[] = [
  {
    date: "Mid 2024",
    role: "Open source and independent builds",
    content: (
      <>
        <p>
          After back to back internships, I took time to reset and go deeper into fundamentals: system design, DSA, and
          shipping my own products. This phase was less about roles and more about becoming a stronger builder,
          contributing to open source, running projects end to end, and tightening my development workflow.
        </p>
        <JourneyProjects years={RECENT_YEARS} />
      </>
    ),
  },
  {
    date: "Early 2024",
    role: "Frontend Engineer Intern at KoinX",
    content: (
      <>
        <p>
          I joined <TextLink href="https://koinx.com?utm_source=kanak.eu.org">KoinX</TextLink>, a fast growing crypto
          tax and compliance platform, where I worked on both customer facing and B2B products at scale.
        </p>
        <p>
          My focus was performance and developer velocity. I migrated legacy CRA apps to{" "}
          <Strong>Vite and TypeScript</Strong> to cut build times, gave the multi-language landing pages a single source
          of truth, and improved <Strong>SEO and runtime performance</Strong>. I also contributed to the internal UI
          system used across products.
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
          This is where I moved from building projects to working on a real product with real users. I joined{" "}
          <TextLink href="https://www.linkedin.com/company/textifyai?utm_source=kanak.eu.org">Textify AI</TextLink> and
          became part of a small team shipping continuously.
        </p>
        <p>
          I worked across the stack: designing a drag and drop AI tool builder, migrating authentication to NextAuth,
          and managing deployments across <Strong>AWS, Azure, and GCP</Strong>. It was my first time owning features end
          to end and operating what I built in production.
        </p>
        <p className="border-border border-l-2 pl-4 text-foreground">
          This phase shaped how I work today: small teams, fast iteration, and direct impact on real users.
        </p>
      </>
    ),
  },
];
