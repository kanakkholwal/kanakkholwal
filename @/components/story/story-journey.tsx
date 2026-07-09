"use client";

import { Icon } from "@/components/icons";
import Link from "next/link";
import { useMemo } from "react";
import { getStory, type StoryChapter } from "~/data/story";
import { appConfig } from "root/project.config";
import { type Lens, PersonaLens, useStoryLens } from "./persona-lens";
import { StoryCardList } from "./story-card-list";
import { StackLine } from "./story-bits";

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
  { href: appConfig.social.github, label: "GitHub", name: "github" },
  { href: appConfig.social.linkedin, label: "LinkedIn", name: "linkedin" },
  { href: appConfig.social.twitter, label: "Twitter", name: "twitter" },
] as const;

export function StoryJourney() {
  const [lens, setLens] = useStoryLens();

  const { work, projects, building } = useMemo(() => {
    const { work, projects, current } = getStory();
    return { work, projects, building: current?.title };
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

        <div className="mt-10 space-y-12 lg:mt-0">
          <PersonaLens value={lens} onChange={setLens} />

          <ChapterGroup label="Experience" chapters={work} lens={lens} />
          {projects.length > 0 && (
            <ChapterGroup
              label="Featured Projects"
              chapters={projects}
              lens={lens}
            />
          )}
        </div>
      </div>
    </section>
  );
}

// Work roles and featured projects are both story chapters, but they read as
// distinct sections so a project never looks like a job. Each group numbers
// itself from 01.
function ChapterGroup({
  label,
  chapters,
  lens,
}: {
  label: string;
  chapters: StoryChapter[];
  lens: Lens;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </h2>
      <StoryCardList chapters={chapters} lens={lens} />
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
        {SOCIALS.map(({ href, label, name }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="flex size-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Icon name={name} className="size-4" />
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
