"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { StoryScene } from "~/data/story/story.types";
import { EASE, pad } from "./motion";
import { StackLine, StatBlock } from "./story-bits";

export function StoryStage({
  scenes,
  active,
  chapterNo,
}: {
  scenes: StoryScene[];
  active: number;
  chapterNo: number;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-2xl border border-border/50 bg-card/30 p-8 md:p-10">
      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground/70">
        <span>{pad(chapterNo)}</span>
        <span>
          {pad(active + 1)} / {pad(scenes.length)}
        </span>
      </div>

      <div className="flex flex-1 items-center py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="w-full"
          >
            <SceneView scene={scenes[active]} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-1.5">
        {scenes.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-px flex-1 transition-colors duration-500",
              i <= active ? "bg-(--accent)" : "bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function SceneView({ scene }: { scene: StoryScene }) {
  switch (scene.kind) {
    case "headline":
      return (
        <p className="text-balance text-2xl font-medium leading-snug tracking-tight text-foreground md:text-[2rem]">
          {scene.body}
        </p>
      );

    case "stack":
      return <StackLine items={scene.items} className="text-base leading-loose" />;

    case "stats":
      return (
        <div className="space-y-6">
          {scene.items.map((stat) => (
            <StatBlock key={stat.label} stat={stat} />
          ))}
        </div>
      );

    case "note":
      return (
        <p className="border-l-2 border-(--accent)/60 pl-5 text-xl leading-relaxed text-foreground/90 md:text-2xl">
          {scene.body}
        </p>
      );
  }
}
