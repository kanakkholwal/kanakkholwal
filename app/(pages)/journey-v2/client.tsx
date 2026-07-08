"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { StoryChapter } from "@/components/story/story-chapter";
import { storyChapters } from "~/data/story/story.data";

export default function JourneyV2Client() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <section className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            The Journey · Cinematic Cut
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-none tracking-tighter text-foreground md:text-7xl">
            <span className="mr-3 font-instrument-serif font-normal italic text-muted-foreground/80">
              Scroll
            </span>
            through the story.
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Every chapter pins while you scroll — the narrative moves on one side,
            the scene rebuilds on the other. Prototype of one milestone.
          </p>
          <div className="flex items-center gap-2 pt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
            <ChevronDown className="size-4 animate-bounce" />
            Start scrolling
          </div>
        </motion.div>
      </section>

      <div className="space-y-32 pb-40">
        {storyChapters.map((chapter) => (
          <StoryChapter key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </main>
  );
}
