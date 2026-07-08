"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import type { StoryChapter as Chapter } from "~/data/story/story.types";
import { StoryBeat } from "./story-beat";
import { StoryProgressProvider } from "./story-context";
import { StoryStage } from "./story-stage";

export function StoryChapter({ chapter }: { chapter: Chapter }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const scenes = chapter.beats.map((beat) => beat.scene);
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(scenes.length - 1, Math.max(0, Math.floor(p * scenes.length)));
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <section
      ref={ref}
      style={{ "--accent": chapter.accent ?? "var(--primary)" } as React.CSSProperties}
      className="relative mx-auto w-full max-w-6xl px-6"
    >
      <StoryProgressProvider
        value={{ progress: scrollYProgress, count: chapter.beats.length }}
      >
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          <div className="top-16 z-10 flex h-[48vh] flex-col gap-4 py-4 max-lg:sticky lg:top-0 lg:h-screen lg:justify-center lg:py-24">
            <ChapterHeader chapter={chapter} progress={scrollYProgress} />
            <div className="min-h-0 flex-1">
              <StoryStage scenes={scenes} active={active} />
            </div>
          </div>

          <div>
            {chapter.beats.map((beat, index) => (
              <StoryBeat key={beat.id} beat={beat} index={index} />
            ))}
          </div>
        </div>
      </StoryProgressProvider>
    </section>
  );
}

function ChapterHeader({
  chapter,
  progress,
}: {
  chapter: Chapter;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const Title = chapter.href ? Link : "div";

  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {chapter.kicker}
      </p>
      <div className="flex items-baseline gap-3">
        <Title
          href={chapter.href ?? "#"}
          {...(chapter.href ? { target: "_blank" } : {})}
          className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
        >
          {chapter.title}
        </Title>
        <span className="font-instrument-serif text-lg italic text-muted-foreground/80">
          {chapter.org}
        </span>
      </div>
      <div className="h-px w-full overflow-hidden bg-border/60">
        <motion.div
          style={{ scaleX: progress }}
          className="h-full origin-left bg-[var(--accent)]"
        />
      </div>
    </div>
  );
}
