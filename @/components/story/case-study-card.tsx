"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { StoryChapter } from "~/data/story/story.types";
import { EASE, pad } from "./motion";
import type { Lens } from "./persona-lens";
import { InlineStat, StackLine, StatBlock } from "./story-bits";
import { chapterFacets } from "./story-facets";

export function CaseStudyCard({
  chapter,
  lens,
  index,
}: {
  chapter: StoryChapter;
  lens: Lens;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const facets = chapterFacets(chapter);

  return (
    <motion.article
      layout={!reduce}
      style={{ "--accent": chapter.accent ?? "var(--primary)" } as React.CSSProperties}
      className="overflow-hidden rounded-2xl border border-border/50 bg-card/30 transition-colors hover:border-(--accent)/30"
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full flex-col gap-4 p-6 text-left md:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-sm text-(--accent)">{pad(index + 1)}</span>
              <h3 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                {chapter.title}
              </h3>
              <span className="font-instrument-serif text-base italic text-muted-foreground/80">
                {chapter.org}
              </span>
            </div>
            <p className="font-mono text-xs text-muted-foreground">{chapter.period}</p>
          </div>
          <ChevronDown
            className={cn(
              "mt-1 size-5 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </div>

        {facets.headline && (
          <p className="max-w-xl text-[15px] leading-relaxed text-foreground/85">
            {facets.headline}
          </p>
        )}

        {facets.stats.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {facets.stats.slice(0, 3).map((stat) => (
              <InlineStat key={stat.label} stat={stat} />
            ))}
          </div>
        )}

        <StackLine items={facets.stack} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            layout={!reduce}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/50 px-6 py-6 md:px-7">
              <motion.div
                key={lens}
                initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
              >
                <LensContent lens={lens} chapter={chapter} facets={facets} />
              </motion.div>

              {chapter.href && (
                <a
                  href={chapter.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-(--accent) hover:underline"
                >
                  Visit {chapter.title}
                  <ArrowUpRight className="size-4" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function LensContent({
  lens,
  chapter,
  facets,
}: {
  lens: Lens;
  chapter: StoryChapter;
  facets: ReturnType<typeof chapterFacets>;
}) {
  if (lens === "recruiter") {
    return (
      <div className="space-y-5">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
          <Fact label="Role" value={chapter.org} />
          <Fact label="When" value={chapter.period} />
          <Fact label="Focus" value={facets.headline ?? chapter.title} />
        </dl>
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">Skills</p>
          <StackLine items={facets.stack} />
        </div>
      </div>
    );
  }

  if (lens === "founder") {
    return (
      <div className="space-y-6">
        {facets.stats.length > 0 && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {facets.stats.map((stat) => (
              <StatBlock key={stat.label} stat={stat} size="md" />
            ))}
          </div>
        )}
        {facets.note && <Prose heading="What I owned" body={facets.note} />}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {facets.beats.map((beat) => (
        <Prose key={beat.id} heading={beat.heading} body={beat.body} />
      ))}
    </div>
  );
}

function Prose({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-muted-foreground">{heading}</p>
      <p className="max-w-2xl text-[15px] leading-relaxed text-foreground/85">{body}</p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}
