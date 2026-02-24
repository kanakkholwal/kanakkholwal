"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Code2, Cpu, Globe, Layers, Quote, Rocket } from "lucide-react";
import { useRef } from "react";
import Markdown from "react-markdown";
import { appConfig } from "root/project.config";
import { SpotlightReveal } from "../animated/section.reveal";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

const BLUR_FADE_DELAY = 0.04;

const TRAITS = ["User Centric", "Pixel Perfect", "Scalable", "OSS First"] as const;

const PILLARS = [
  {
    icon: Layers,
    label: "Full-Stack",
    description: "End-to-end systems from DB schema to UI interaction.",
  },
  {
    icon: Cpu,
    label: "AI-Driven",
    description: "Integrating models and automation into real products.",
  },
  {
    icon: Globe,
    label: "Open Source",
    description: "Contributing to and building in public.",
  },
  {
    icon: Rocket,
    label: "Ship Fast",
    description: "Iterating quickly without sacrificing quality.",
  },
] as const;


export default function SectionAbout() {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="about-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <MinimalAbout />
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="about-static"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StaticAbout />
        </motion.div>
      ) : (
        <motion.div
          key="about-dynamic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <SpotlightReveal>
            <DynamicAbout />
          </SpotlightReveal>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

//  Minimal 

function MinimalAbout() {
  return (
    <Panel id="about">
      <PanelHeader>
        <motion.div layoutId="about-label" className="inline-block">
          <PanelTitle>About</PanelTitle>
        </motion.div>
      </PanelHeader>
      <PanelContent
        className={cn(
          "prose dark:prose-invert max-w-none",
          "prose-headings:font-mono prose-headings:tracking-tight prose-headings:font-bold",
          "prose-p:font-mono prose-p:leading-6 prose-p:text-zinc-600 dark:prose-p:text-zinc-300",
          "prose-li:font-mono",
        )}
      >
        <Markdown>{appConfig.summary}</Markdown>
      </PanelContent>
    </Panel>
  );
}

//  Static

function StaticAbout() {
  return (
    <section id="about" className="max-w-3xl mx-auto w-full px-4 py-16 md:py-24">
      <div className="border-t border-border pt-12 space-y-10">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="space-y-2">
            <motion.span
              layoutId="about-label"
              className="inline-block text-xs font-mono font-medium tracking-widest uppercase text-muted-foreground"
            >
              // About me
            </motion.span>
            <motion.h2
              layoutId="about-heading"
              className="text-3xl md:text-4xl font-bold tracking-tight"
            >
              My approach to engineering
            </motion.h2>
          </div>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <div className="flex flex-wrap gap-2">
            {TRAITS.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-xs font-medium text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-muted-foreground">
            <Markdown
              components={{
                p: ({ children }) => <p className="mb-4">{children}</p>,
                strong: ({ children }) => (
                  <span className="text-foreground font-semibold">{children}</span>
                ),
              }}
            >
              {appConfig.summary}
            </Markdown>
          </div>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 7}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PILLARS.map(({ icon: Icon, label, description }) => (
              <div
                key={label}
                className="flex flex-col gap-2 p-4 rounded-2xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <Icon className="size-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">{label}</span>
                <span className="text-[11px] text-muted-foreground leading-snug">{description}</span>
              </div>
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 9}>
          <div className="flex items-center gap-3 pt-2">
            <div className="h-px w-8 bg-border/60" />
            <span className="text-sm text-muted-foreground italic">Always building.</span>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

//  Dynamic

function DynamicAbout() {
  return (
    <section
      id="about"
      className="relative w-full py-24 md:py-32 px-4 md:px-12 overflow-hidden mx-auto max-w-app"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_hsl(var(--foreground)/0.04)_1px,_transparent_1px)] bg-[size:28px_28px]" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-14">

        {/* ── Header ── */}
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <motion.span
                layoutId="about-label"
                className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest"
              >
                <Code2 className="size-3.5" />
                About me
              </motion.span>
              <motion.h2
                layoutId="about-heading"
                className="text-4xl md:text-6xl font-bold tracking-tighter leading-none"
              >
                <span className="font-instrument-serif italic font-normal text-muted-foreground/70 mr-3">
                  My
                </span>
                Approach
              </motion.h2>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end md:max-w-xs">
              {TRAITS.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full border border-primary/15 bg-primary/5 text-xs font-medium text-primary/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* ── Two-column body ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">

          {/* Left — prose */}
          <SummaryReveal text={appConfig.summary} />

          {/* Right — pillars card with window chrome */}
          <BlurFade delay={BLUR_FADE_DELAY * 6} className="lg:sticky lg:top-28">
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-xl shadow-xl">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-card/60">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-red-500/30 border border-red-500/50" />
                  <div className="size-2.5 rounded-full bg-amber-500/30 border border-amber-500/50" />
                  <div className="size-2.5 rounded-full bg-emerald-500/30 border border-emerald-500/50" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-muted-foreground tracking-widest">
                    engineering_pillars.ts
                  </span>
                </div>
              </div>

              {/* Pillars list */}
              <div className="p-4 space-y-1">
                {PILLARS.map(({ icon: Icon, label, description }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.07, duration: 0.45 }}
                    viewport={{ once: true }}
                    className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors cursor-default"
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-primary/8 group-hover/item:bg-primary/15 transition-colors shrink-0">
                      <Icon className="size-3.5 text-primary/70" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-semibold text-foreground">{label}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug">{description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom bar */}
              <div className="px-4 py-3 border-t border-border/40 bg-muted/20">
                <p className="text-[10px] font-mono text-muted-foreground/50 text-center tracking-wider">
                  {PILLARS.length} core principles · always evolving
                </p>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* ── Sign-off ── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 border-t border-border/40 pt-8"
        >
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="text-primary/10 select-none"
            aria-hidden
          >
            <Quote size={32} />
          </motion.div>
          <span className="font-instrument-serif italic text-xl text-muted-foreground">
            Always building.
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function SummaryReveal({ text }: { text: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="prose prose-base md:prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
    >
      <Markdown
        components={{
          p: ({ children }) => <p className="mb-5 text-pretty">{children}</p>,
          strong: ({ children }) => (
            <span className="text-foreground font-semibold bg-primary/5 px-1 rounded">
              {children}
            </span>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2 mb-5 list-none border-l-2 border-primary/20 pl-5">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="relative pl-2 before:absolute before:left-[-20px] before:top-[10px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/50 before:content-['']">
              {children}
            </li>
          ),
        }}
      >
        {text}
      </Markdown>
    </motion.div>
  );
}
