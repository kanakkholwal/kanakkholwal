"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { StoryChapter } from "@/components/story/story-chapter";
import { StoryPlayer } from "@/components/story/story-player";
import type { StoryChapter as Chapter } from "~/data/story/story.types";

export function StoryCinematic({ chapters }: { chapters: Chapter[] }) {
  const roles = chapters.filter((c) => c.org !== "Project").length;

  const meta = [
    { value: String(roles), label: "roles" },
    { value: String(chapters.length), label: "chapters" },
    { value: "740+", label: "users reached" },
  ];

  return (
    <StoryPlayer>
      <main className="relative min-h-screen w-full overflow-x-clip">
        <section className="mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <p className="font-mono text-xs text-muted-foreground">The Journey</p>
            <h1 className="max-w-3xl text-5xl font-black leading-none tracking-tighter text-foreground md:text-7xl">
              <span className="mr-3 font-instrument-serif font-normal italic text-muted-foreground/80">
                Scroll
              </span>
              through the story.
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Each chapter pins as you scroll. The story moves on one side while
              the scene rebuilds on the other, from my first product to what I am
              building now.
            </p>

            <dl className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
              {meta.map((item, i) => (
                <div key={item.label} className="flex items-center gap-8">
                  {i > 0 && <span className="h-8 w-px bg-edge" />}
                  <div>
                    <dt className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                      {item.value}
                    </dt>
                    <dd className="text-sm text-muted-foreground">{item.label}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="flex items-center gap-2 pt-4 text-sm text-muted-foreground/80">
              <ChevronDown className="size-4" />
              Scroll, or hit play below
            </div>
          </motion.div>
        </section>

        <div className="space-y-32 pb-40">
          {chapters.map((chapter, index) => (
            <StoryChapter key={chapter.id} chapter={chapter} index={index} />
          ))}
        </div>
      </main>
    </StoryPlayer>
  );
}
