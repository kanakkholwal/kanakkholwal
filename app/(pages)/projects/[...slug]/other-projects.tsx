"use client";

import { ProjectFallback } from "@/components/application/projects.card.fallback";
import BlurFade from "@/components/magicui/blur-fade";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { ProjectType, getOtherProjects } from "@/lib/project.source";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ProjectData = Omit<ProjectType, "body">;
type OtherProjectsProps = { currentProjectId: string };

const BLUR_FADE_DELAY = 0.04;

export function OtherProjects({ currentProjectId }: OtherProjectsProps) {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );
  const projects = getOtherProjects(currentProjectId);
  if (!projects.length) return null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="other-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MinimalOtherProjects projects={projects} />
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="other-static"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StaticOtherProjects projects={projects} />
        </motion.div>
      ) : (
        <motion.div
          key="other-dynamic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <DynamicOtherProjects projects={projects} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   MINIMAL — plain numbered list
───────────────────────────────────────────────────────── */
function MinimalOtherProjects({ projects }: { projects: ProjectData[] }) {
  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-16 border-t border-dashed border-border">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-8">
          // more projects
        </p>
      </BlurFade>

      <ol className="space-y-0">
        {projects.map((p, i) => (
          <BlurFade key={p.id} delay={BLUR_FADE_DELAY * (i + 2)}>
            <Link
              href={`/projects/${p.id}`}
              className="group flex items-baseline justify-between gap-6 py-4 border-b border-border/40 hover:border-border transition-colors"
            >
              <div className="flex items-baseline gap-4 min-w-0">
                <span className="text-[10px] font-mono text-muted-foreground/40 w-6 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate block">
                    {p.title}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground/60">
                    {p.dates}
                    {p.tags?.[0] ? ` · ${p.tags[0]}` : ""}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="size-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </Link>
          </BlurFade>
        ))}
      </ol>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   STATIC — horizontal scroll row of cards
───────────────────────────────────────────────────────── */
function StaticOtherProjects({ projects }: { projects: ProjectData[] }) {
  return (
    <section className="w-full py-20 border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="flex items-center gap-3 mb-10">
            <Layers className="size-4 text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">
              System Archive // Select Project
            </h2>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <BlurFade key={p.id} delay={BLUR_FADE_DELAY * (i + 2)}>
              <Link
                href={`/projects/${p.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card hover:border-border/80 hover:shadow-xl transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <ProjectFallback title={p.title} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {p.title}
                    </h3>
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                      {p.dates}
                      {p.tags?.[0] ? ` · ${p.tags[0]}` : ""}
                    </p>
                  </div>
                  <div className="size-7 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 shrink-0">
                    <ArrowUpRight className="size-3.5" />
                  </div>
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   DYNAMIC — masonry-style staggered grid, hover reveal
───────────────────────────────────────────────────────── */
function DynamicOtherProjects({ projects }: { projects: ProjectData[] }) {
  return (
    <section className="w-full py-24 border-t border-border/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              // more projects
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Keep exploring
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden md:inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-foreground/40 px-4 py-2 rounded-full"
          >
            View all <ArrowUpRight className="size-3" />
          </Link>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={`/projects/${p.id}`}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-3xl",
                  "bg-card border border-border",
                  "hover:shadow-2xl dark:hover:shadow-black/60 hover:border-border/60",
                  "transition-all duration-400",
                )}
              >
                {/* Media */}
                <div className="relative aspect-[16/10] bg-zinc-900 overflow-hidden">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <ProjectFallback title={p.title} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Status badge */}
                  {p.status && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-widest border bg-black/50 backdrop-blur-sm text-white/80 border-white/10">
                        {p.status}
                      </span>
                    </div>
                  )}

                  {/* Hover arrow */}
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80">
                      <ArrowUpRight className="size-3" />
                      Open
                    </div>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {p.title}
                    </h3>
                  </div>
                </div>

                {/* Bottom strip */}
                <div className="px-4 py-3 flex items-center justify-between gap-3 bg-card border-t border-border/50">
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {p.dates}
                    </p>
                    <div className="flex gap-1 mt-1">
                      {p.technologies?.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] bg-muted text-[9px] text-muted-foreground border border-border/50"
                        >
                          {t}
                        </span>
                      ))}
                      {p.technologies && p.technologies.length > 3 && (
                        <span className="text-[9px] text-muted-foreground self-center">
                          +{p.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center size-7 rounded-full border border-border bg-muted/40 text-muted-foreground group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 shrink-0">
                    <ArrowUpRight className="size-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile "view all" */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 flex justify-center md:hidden"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-foreground/40 px-4 py-2 rounded-full"
          >
            View all projects <ArrowUpRight className="size-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
