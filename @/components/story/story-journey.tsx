"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getStoryChapters } from "~/data/story/story.build";
import { appConfig } from "root/project.config";
import { CaseStudyCard } from "./case-study-card";
import { EASE } from "./motion";
import { type Lens, PersonaLens } from "./persona-lens";
import { StackLine } from "./story-bits";
import { isProject } from "./story-facets";

const IDENTITY_STACK = [
  "TypeScript",
  "React",
  "Next.js",
  "Svelte",
  "Node.js",
  "Go",
  "Postgres",
  "Docker",
];

const SOCIALS = [
  { href: appConfig.social.github, label: "GitHub", Icon: Github },
  { href: appConfig.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: appConfig.social.twitter, label: "Twitter", Icon: Twitter },
];

export function StoryJourney() {
  const [lens, setLens] = useState<Lens>("developer");

  const { ordered, building } = useMemo(() => {
    const chapters = getStoryChapters();
    // Recent work first, then featured projects.
    const work = chapters.filter((c) => !isProject(c)).reverse();
    const projects = chapters.filter(isProject);
    return {
      ordered: [...work, ...projects],
      building: chapters.find((c) => /present/i.test(c.period))?.title,
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <header className="mb-12 max-w-2xl space-y-4">
        <p className="font-mono text-xs text-muted-foreground">The story</p>
        <h1 className="text-4xl font-black tracking-tighter text-foreground md:text-5xl">
          <span className="font-instrument-serif font-normal italic text-muted-foreground/80">
            Read it
          </span>{" "}
          your way.
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          The same roles and projects, framed for whoever is looking. Pick a lens,
          then open any card to go deeper.
        </p>
      </header>

      <div className="lg:grid lg:grid-cols-[300px_1fr] lg:items-start lg:gap-12">
        <IdentityPanel building={building} />

        <div className="mt-10 space-y-8 lg:mt-0">
          <PersonaLens value={lens} onChange={setLens} />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="space-y-4"
          >
            {ordered.map((chapter, i) => (
              <motion.div
                key={chapter.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
              >
                <CaseStudyCard chapter={chapter} lens={lens} index={i} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function IdentityPanel({ building }: { building?: string }) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={appConfig.avatar}
          alt={appConfig.displayName}
          className="size-14 rounded-full border border-border/60"
        />
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {appConfig.displayName}
          </h2>
          <p className="text-sm text-muted-foreground">{appConfig.role}</p>
        </div>
      </div>

      <p className="max-w-xs text-sm leading-relaxed text-foreground/85">
        Product engineer who ships. I own features from the database to the
        pixels, and I care about the parts users feel but never see.
      </p>

      {building && (
        <div className="flex items-center gap-2 text-sm text-foreground">
          <span className="size-2 rounded-full bg-primary" />
          Currently building {building}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Stack</p>
        <StackLine items={IDENTITY_STACK} className="leading-loose" />
      </div>

      <div className="flex items-center gap-2">
        {SOCIALS.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="flex size-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Icon className="size-4" />
          </a>
        ))}
      </div>

      <Link
        href="/contact"
        className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Get in touch
      </Link>
    </aside>
  );
}
