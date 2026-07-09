"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { EASE, pad } from "@/components/story/motion";
import { StackLine, StatBlock } from "@/components/story/story-bits";
import { chapterFacets } from "@/components/story/story-facets";
import type { StoryChapter } from "~/data/story/story.types";

export function StoryKeynote({ chapters }: { chapters: StoryChapter[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(0);
  const last = chapters.length - 1;

  const goTo = useCallback(
    (target: number) => {
      const next = Math.min(last, Math.max(0, target));
      setDir(next > index ? 1 : -1);
      setIndex(next);
    },
    [index, last],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(index + 1);
      else if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  const chapter = chapters[index];
  const shift = reduce ? 0 : 40;

  return (
    <main
      style={{ "--accent": chapter.accent ?? "var(--primary)" } as React.CSSProperties}
      className="relative flex h-[100svh] w-full flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 pt-24 font-mono text-xs text-muted-foreground md:px-12">
        <span>The Journey</span>
        <span className="tabular-nums">
          {pad(index + 1)} / {pad(chapters.length)}
        </span>
      </div>

      <div className="relative flex flex-1 items-center overflow-y-auto px-6 py-8 md:px-12">
        <div className="mx-auto w-full max-w-4xl">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={chapter.id}
              custom={dir}
              initial={{ opacity: 0, x: dir >= 0 ? shift : -shift }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir >= 0 ? -shift : shift }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Slide chapter={chapter} no={index + 1} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 pb-10 md:px-12">
        <div className="flex items-center gap-2">
          {chapters.map((c, i) => (
            <button
              key={c.id}
              type="button"
              aria-label={`Go to chapter ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-(--accent)" : "w-1.5 bg-border hover:bg-muted-foreground/40",
              )}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <NavButton label="Previous" onClick={() => goTo(index - 1)} disabled={index === 0}>
            <ArrowLeft className="size-4" />
          </NavButton>
          <NavButton label="Next" onClick={() => goTo(index + 1)} disabled={index === last}>
            <ArrowRight className="size-4" />
          </NavButton>
        </div>
      </div>
    </main>
  );
}

function Slide({ chapter, no }: { chapter: StoryChapter; no: number }) {
  const f = chapterFacets(chapter);
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-lg text-(--accent)">{pad(no)}</span>
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {chapter.title}
        </h2>
        <span className="font-instrument-serif text-lg italic text-muted-foreground/80">
          {chapter.org}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{chapter.period}</span>
      </div>

      {f.headline && (
        <p className="mt-8 text-balance text-3xl font-medium leading-[1.1] tracking-tight text-foreground md:text-5xl">
          {f.headline}
        </p>
      )}

      {f.stats.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-x-12 gap-y-5">
          {f.stats.map((stat) => (
            <StatBlock key={stat.label} stat={stat} />
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {f.beats.map((beat) => (
          <div key={beat.id}>
            <p className="text-sm font-medium text-muted-foreground">{beat.heading}</p>
            <p className="mt-0.5 text-[15px] leading-relaxed text-foreground/85">
              {beat.body}
            </p>
          </div>
        ))}
      </div>

      <StackLine items={f.stack} className="mt-10" />
    </div>
  );
}

function NavButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border border-border/60 text-foreground transition-colors",
        "hover:border-(--accent)/40 disabled:opacity-30 disabled:hover:border-border/60",
      )}
    >
      {children}
    </button>
  );
}
