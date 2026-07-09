"use client";

import { motion } from "framer-motion";
import type { StoryChapter } from "~/data/story";
import { CaseStudyCard } from "./case-study-card";
import { EASE } from "./motion";
import type { Lens } from "./persona-lens";

// The staggered column of persona-lens case-study cards. Shared so the /journey
// page and the homepage render the exact same card language from one place.
export function StoryCardList({
  chapters,
  lens,
}: {
  chapters: StoryChapter[];
  lens: Lens;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="space-y-4"
    >
      {chapters.map((chapter, i) => (
        <motion.div
          key={chapter.id}
          variants={{
            hidden: { opacity: 0, y: 24 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: EASE },
            },
          }}
        >
          <CaseStudyCard chapter={chapter} lens={lens} index={i} />
        </motion.div>
      ))}
    </motion.div>
  );
}
