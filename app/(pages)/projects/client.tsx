"use client";

import {
  ExpandableProjectCards,
  SimpleProjectCards,
} from "@/components/application/projects.card";
import BlurFade from "@/components/magicui/blur-fade";
import { ButtonTransitionLink, TransitionLink } from "@/components/utils/link";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { getProjectList } from "@/lib/project.source";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, TrendingUp } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

/* ─────────────────────────────────────────────
   Root export
───────────────────────────────────────────── */
export default function ProjectsShowcase() {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );
  const projects = getProjectList();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="projects-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MinimalProjects projects={projects} />
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="projects-static"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StaticProjects projects={projects} />
        </motion.div>
      ) : (
        <motion.div
          key="projects-dynamic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
            <DynamicProjects projects={projects} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function MinimalProjects({
  projects,
}: {
  projects: ReturnType<typeof getProjectList>;
}) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 pt-20">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="mb-10 space-y-1">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            // Projects
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Selected work
          </h1>
        </div>
      </BlurFade>

      <div className="divide-y divide-border">
        {projects.map((project, i) => (
          <BlurFade key={project.id} delay={BLUR_FADE_DELAY * (i + 3)}>
            <TransitionLink
              href={`/projects/${project.id}`}
              className="group flex items-center justify-between gap-6 py-4 hover:bg-muted/30 -mx-3 px-3 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-5 overflow-hidden">
                <span className="text-xs font-mono text-muted-foreground/50 w-5 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {project.title}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {project.dates}
                    {project.tags?.[0] ? ` · ${project.tags[0]}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {project.status && (
                  <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-border text-muted-foreground">
                    {project.status}
                  </span>
                )}
                <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </div>
            </TransitionLink>
          </BlurFade>
        ))}
      </div>

      <BlurFade delay={BLUR_FADE_DELAY * (projects.length + 5)}>
        <div className="mt-10 flex items-center gap-4">
          <ButtonTransitionLink
            href="/stats"
            variant="outline"
            rounded="full"
          >
            <TrendingUp className="size-4 text-indigo-500" />
            GitHub Stats
          </ButtonTransitionLink>
          <ButtonTransitionLink href="/" variant="dark" rounded="full">
            Back to Home
            <ArrowRight className="size-4" />
          </ButtonTransitionLink>
        </div>
      </BlurFade>
    </div>
  );
}


function StaticProjects({
  projects,
}: {
  projects: ReturnType<typeof getProjectList>;
}) {
  return (
    <div className="max-w-app mx-auto px-6 md:px-12 pb-24 pt-20">
      {/* Header */}
      <div className="flex flex-col items-start max-w-2xl mx-auto md:mx-0 space-y-5 pt-12 md:pt-20 pb-14">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            // Selected work
          </p>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Engineering with
            <br />
            <span className="text-colorful-titanium">
              Purpose &amp; Precision.
            </span>
          </h1>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
            A curated archive of applications, open-source libraries, and
            experiments — focused on scalable architecture and intuitive UX.
          </p>
        </BlurFade>
      </div>

      {/* Grid */}
      <BlurFade delay={BLUR_FADE_DELAY * 5}>
        <SimpleProjectCards cards={projects} />
      </BlurFade>

      {/* Footer CTA */}
      <BlurFade delay={BLUR_FADE_DELAY * 7}>
        <div className="mt-24 border-t border-border/50 pt-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                // What's next
              </p>
              <h3 className="text-2xl font-bold tracking-tight">
                Curious about the numbers?
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                See commit history, open-source stats, and GitHub activity.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <ButtonTransitionLink
                href="/stats"
                variant="outline"
                rounded="full"
                className="h-11 px-6"
              >
                <TrendingUp className="size-4 text-indigo-500" />
                GitHub Stats
              </ButtonTransitionLink>
              <ButtonTransitionLink
                href="/"
                variant="default_soft"
                rounded="full"
                shadow="default_soft"
                className="h-11 px-6"
              >
                Back to Home
                <ArrowRight className="size-4" />
              </ButtonTransitionLink>
            </div>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}

function DynamicProjects({
  projects,
}: {
  projects: ReturnType<typeof getProjectList>;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Dot-grid background */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-background opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 pb-24">
        {/* Animated hero */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 pt-12 md:pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-border/50 text-xs font-mono text-muted-foreground uppercase tracking-widest backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/80 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Ship / Iterate / Scale
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[1.1]"
          >
            Engineering with
            <br />
            <span className="text-colorful-titanium">
              Purpose &amp; Precision.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            A curated archive of applications, open-source libraries, and
            experiments. Focusing on scalable architecture and intuitive user
            experiences.
          </motion.p>
        </div>

        {/* Expandable card grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ExpandableProjectCards cards={projects} />
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-32 border-t border-border/50 pt-16"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Left: copy */}
            <div className="space-y-3 text-center md:text-left">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                // What's next
              </p>
              <h3 className="text-3xl font-bold tracking-tight leading-tight">
                Curious about
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/70 to-foreground/30">
                  the numbers?
                </span>
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto md:mx-0">
                Commit history, open-source contributions, and GitHub activity
                — all in one place.
              </p>
            </div>

            {/* Right: action cards */}
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <ButtonTransitionLink
                href="/stats"
                variant="outline"
                rounded="full"
                className="h-12 px-8 gap-2"
              >
                <TrendingUp className="size-4 text-indigo-500" />
                View GitHub Stats
              </ButtonTransitionLink>
              <ButtonTransitionLink
                href="/"
                variant="default_soft"
                rounded="full"
                shadow="default_soft"
                className="h-12 px-8 gap-2"
              >
                Back to Home
                <ArrowRight className="size-4" />
              </ButtonTransitionLink>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
