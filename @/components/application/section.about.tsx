"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import { useRef } from "react";
import Markdown from "react-markdown";
import { appConfig } from "root/project.config";
import { SpotlightReveal } from "../animated/section.reveal";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";


const TRAITS = ["User Centric", "Pixel Perfect", "Scalable", "OSS First"] as const;


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

// ─── Minimal ─────────────────────────────────────────────────────────────────

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

// ─── Static ───────────────────────────────────────────────────────────────────

function StaticAbout() {
  return (
    <section id="about" className="w-full mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-8">
        <motion.span
          layoutId="about-label"
          className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase"
        >
          // About me
        </motion.span>
        <motion.h2
          layoutId="about-heading"
          className="text-2xl font-semibold tracking-tight"
        >
          My approach to engineering
        </motion.h2>
      </div>

      {/* Trait chips */}
      <BlurFade delay={0.1}>
        <div className="flex flex-wrap gap-2 mb-8">
          {TRAITS.map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full border border-border/60 bg-card/40 text-xs font-medium text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </BlurFade>

      {/* Body */}
      <BlurFade delay={0.2}>
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

      {/* Sign-off */}
      <BlurFade delay={0.3}>
        <div className="mt-10 flex items-center gap-3 border-t border-border/40 pt-6">
          <div className="h-px w-8 bg-border/60" />
          <span className="text-sm text-muted-foreground italic">
            Always building.
          </span>
        </div>
      </BlurFade>
    </section>
  );
}

// ─── Dynamic ──────────────────────────────────────────────────────────────────

function DynamicAbout() {
  return (
    <section
      id="about"
      className="relative w-full py-20 px-6 md:px-14 overflow-hidden"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_hsl(var(--foreground)/0.05)_1px,_transparent_1px)] bg-[size:28px_28px]" />
        <div className="absolute -top-24 -right-24 w-[360px] h-[360px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-20">

        {/* ── Left sidebar ── */}
        <div className="lg:sticky lg:top-28 lg:self-start flex flex-col gap-5">
          <BlurFade delay={0.08}>
            <motion.div layoutId="about-label" className="inline-flex items-center gap-2">
              <div className="h-px w-6 bg-primary/60" />
              <span className="text-xs font-mono tracking-widest text-primary uppercase">
                About me
              </span>
            </motion.div>
          </BlurFade>

          <BlurFade delay={0.13}>
            <motion.h2
              layoutId="about-heading"
              className="text-3xl font-bold tracking-tight leading-tight"
            >
              My approach
              <br />
              <span className="text-muted-foreground font-normal">
                to engineering
              </span>
            </motion.h2>
          </BlurFade>

          <BlurFade delay={0.18}>
            <div className="flex flex-wrap gap-2">
              {TRAITS.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full border border-primary/15 bg-primary/5 text-xs font-medium text-primary/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </BlurFade>

          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="text-primary/8 select-none hidden lg:block mt-2"
            aria-hidden
          >
            <Quote size={64} />
          </motion.div>
        </div>

        {/* ── Right prose ── */}
        <div className="flex flex-col gap-6">
          <SummaryReveal text={appConfig.summary} />

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 border-t border-border/40 pt-6"
          >
            <div className="h-px w-10 bg-primary/30" />
            <span className="font-instrument-serif italic text-xl text-muted-foreground">
              Always building.
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────

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
