"use client";

import { motion } from "framer-motion";
import { chapterFacets } from "@/components/story/story-facets";
import type { StoryChapter } from "~/data/story/story.types";

const slug = (chapter: StoryChapter) =>
  chapter.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function StoryTerminal({ chapters }: { chapters: StoryChapter[] }) {
  return (
    <main className="min-h-screen w-full overflow-x-clip px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
            <span className="size-3 rounded-full bg-red-500/70" />
            <span className="size-3 rounded-full bg-yellow-500/70" />
            <span className="size-3 rounded-full bg-green-500/70" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">
              kanak@journey ~ history
            </span>
          </div>

          <div className="space-y-10 p-5 font-mono text-sm leading-relaxed md:p-7">
            <p className="text-muted-foreground">
              <span className="text-primary">$</span> cat ./journey.log
            </p>

            {chapters.map((chapter) => (
              <ChapterBlock key={chapter.id} chapter={chapter} />
            ))}

            <p className="flex items-center gap-2 text-muted-foreground">
              <span className="text-primary">$</span>
              <span className="inline-block h-4 w-2 bg-foreground/70 motion-safe:animate-pulse" />
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function ChapterBlock({ chapter }: { chapter: StoryChapter }) {
  const f = chapterFacets(chapter);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-2"
    >
      <p>
        <span className="text-primary">$</span>{" "}
        <span className="text-foreground">open</span>{" "}
        <span className="text-primary">{slug(chapter)}</span>{" "}
        <span className="text-muted-foreground">--as &quot;{chapter.org}&quot;</span>
      </p>

      <p className="text-muted-foreground/70"># {chapter.title} · {chapter.period}</p>

      {f.headline && <p className="text-foreground/90">&gt; {f.headline}</p>}

      <div className="space-y-1.5 pt-1">
        {f.beats.map((beat) => (
          <div key={beat.id} className="grid grid-cols-1 gap-x-4 sm:grid-cols-[9rem_1fr]">
            <span className="text-primary/80">{beat.heading}</span>
            <span className="text-foreground/80">{beat.body}</span>
          </div>
        ))}
      </div>

      {f.stack.length > 0 && (
        <p className="pt-1 text-muted-foreground">
          <span className="text-muted-foreground/60">stack:</span>{" "}
          {f.stack.join(" · ")}
        </p>
      )}
    </motion.div>
  );
}
