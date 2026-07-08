"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { StoryScene } from "~/data/story/story.types";
import { EASE } from "./motion";

export function StoryStage({
  scenes,
  active,
}: {
  scenes: StoryScene[];
  active: number;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-border/50 bg-card/40 p-8 backdrop-blur-sm md:p-12">
      <div className="pointer-events-none absolute -top-1/3 left-1/2 aspect-square w-2/3 -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-[0.10] blur-3xl" />

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: reduce ? 1 : 0.96, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: reduce ? 1 : 1.03, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative w-full max-w-md"
        >
          <SceneView scene={scenes[active]} />
        </motion.div>
      </AnimatePresence>

      <span className="absolute bottom-5 right-6 font-mono text-[10px] tracking-widest text-muted-foreground/60">
        {String(active + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
      </span>
    </div>
  );
}

function SceneView({ scene }: { scene: StoryScene }) {
  switch (scene.kind) {
    case "headline":
      return (
        <h3 className="text-balance text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl">
          <span className="font-instrument-serif italic text-muted-foreground/80">
            “
          </span>
          {scene.body}
        </h3>
      );

    case "stack":
      return (
        <motion.ul
          className="flex flex-wrap gap-2.5"
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          initial="hide"
          animate="show"
        >
          {scene.items.map((item) => (
            <motion.li
              key={item}
              variants={{
                hide: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-sm font-medium text-foreground"
            >
              {item}
            </motion.li>
          ))}
        </motion.ul>
      );

    case "stats":
      return (
        <dl className="grid gap-4">
          {scene.items.map((stat) => (
            <div key={stat.label} className="border-l-2 border-[var(--accent)]/40 pl-4">
              <dt className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {stat.value}
              </dt>
              <dd className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      );

    case "note":
      return (
        <p className="text-xl leading-relaxed text-foreground/90">
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
            // takeaway
          </span>
          {scene.body}
        </p>
      );
  }
}
