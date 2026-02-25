"use client";

import {
    Timeline
} from "@/components/application/journey.static";
import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { journey_data } from "~/data/journey";

const BLUR_FADE_DELAY = 0.04;

export default function JourneyPageClient() {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="journey-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MinimalJourney />
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="journey-static"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StaticJourney />
        </motion.div>
      ) : (
        <motion.div
          key="journey-dynamic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <DynamicJourney />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function MinimalJourney() {
  const entries = [...journey_data].reverse();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* Header */}
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="mb-16 space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              // the archives
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Changelog of my Journey
            </h1>
            <p className="text-sm text-muted-foreground font-mono max-w-md leading-relaxed">
              From my first line of code to building scalable systems.
            </p>
          </div>
        </BlurFade>

        {/* Entries */}
        <ol className="space-y-0 divide-y divide-border/60">
          {entries.map((entry, i) => (
            <BlurFade key={entry.date} delay={BLUR_FADE_DELAY * (i + 2)}>
              <li className="py-8 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Badge variant="outline" className="rounded-sm font-mono text-[10px] uppercase tracking-wider">
                    {entry.date}
                  </Badge>
                  <span className="text-sm font-semibold text-foreground">
                    {entry.role}
                  </span>
                </div>
                <div className="pl-9 text-sm text-muted-foreground font-mono leading-relaxed prose-minimal">
                  {entry.content}
                </div>
              </li>
            </BlurFade>
          ))}
        </ol>
      </div>
    </main>
  );
}


function StaticJourney() {
  return <Timeline />;
}


function DynamicJourney() {
  const entries = [...journey_data].reverse();

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      {/* Dot-grid */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Hero strip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full border-b border-border/40"
      >
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              The Archives
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-none">
              <span className="font-instrument-serif italic font-normal text-muted-foreground/80 mr-3">
                Changelog
              </span>
              <br className="md:hidden" />
              of my Journey
            </h1>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              From my first line of code to building scalable systems. A
              timeline of experiments, failures, and shipped products.
            </p>
          </div>
          <div className="flex flex-col gap-1 shrink-0 text-right">
            <span className="text-4xl md:text-5xl font-bold font-mono text-foreground/10 leading-none select-none">
              {String(entries.length).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Milestones
            </span>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] md:left-[7px] top-2 bottom-2 w-px bg-border/50" />

          <div className="space-y-0">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.date}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex gap-6 md:gap-10 pb-16 last:pb-0"
              >
                {/* Dot */}
                <div className="relative flex-shrink-0 mt-1.5">
                  <span className="bg-primary/20 flex size-4 items-center justify-center rounded-full ring-4 ring-background">
                    <span className="bg-primary size-2 rounded-full" />
                  </span>
                </div>

                {/* Card */}
                <div className="flex-1 min-w-0">
                  <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 md:p-8 hover:border-primary/30 hover:bg-card transition-all duration-300">
                    {/* Date + role */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge
                        variant="outline"
                        className="rounded-sm font-mono text-[10px] uppercase tracking-wider shrink-0"
                      >
                        {entry.date}
                      </Badge>
                      <h3 className="text-base md:text-lg font-bold tracking-tight text-foreground">
                        {entry.role}
                      </h3>
                    </div>

                    {/* Content */}
                    <div
                      className={cn(
                        "text-sm text-muted-foreground leading-relaxed",
                        "[&_p]:font-mono [&_p]:leading-6",
                        "[&_strong]:text-foreground [&_strong]:font-semibold",
                        "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-border hover:[&_a]:decoration-primary [&_a]:transition-all",
                        "[&_.rounded-xl]:mt-4",
                      )}
                    >
                      {entry.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
