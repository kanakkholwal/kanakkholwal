"use client";

import { DynamicHeading } from "@/components/application/dynamic.heading";

import { hingeDown, liftIn } from "@/components/animated/dynamic-motion";
import BlurFade from "@/components/magicui/blur-fade";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { StyleSwap } from "@/components/animated/style-swap";
import { Serif, StoryChapter, StoryReveal } from "@/components/application/story.frame";
import { Code2, Cpu, Globe, Layers, Rocket } from "lucide-react";
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
    <StyleSwap swapKey={selectedStyle}>
      {selectedStyle === "minimal" ? (
        <MinimalAbout />
      ) : selectedStyle === "static" ? (
        <StaticAbout />
      ) : selectedStyle === "story" ? (
        <StoryAbout />
      ) : (
        <SpotlightReveal>
          <DynamicAbout />
        </SpotlightReveal>
      )}
    </StyleSwap>
  );
}

function StoryAbout() {
  return (
    <StoryChapter
      index={1}
      kicker="The person"
      id="about"
      title={<>Beyond the <Serif className="text-muted-foreground/80">résumé</Serif>.</>}
    >
      <StoryReveal className="space-y-5 text-base leading-relaxed text-muted-foreground">
        <p>
          I&apos;m a product engineer who likes owning the whole thing, from the
          database schema all the way to the last few pixels.
        </p>
        <p>
          What keeps me interested is the craft in the parts people feel but
          rarely notice: the loading state that never flickers, the copy that
          sounds like a person, the transition that just feels right.
        </p>
      </StoryReveal>

      <StoryReveal delay={0.1} className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {PILLARS.map((pillar) => (
          <div key={pillar.label} className="flex gap-3">
            <pillar.icon className="size-5 shrink-0 text-primary/70" />
            <div>
              <p className="text-sm font-semibold text-foreground">{pillar.label}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </div>
          </div>
        ))}
      </StoryReveal>

      <StoryReveal delay={0.16} className="mt-8 flex flex-wrap gap-2">
        {TRAITS.map((trait) => (
          <span
            key={trait}
            className="rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            {trait}
          </span>
        ))}
      </StoryReveal>
    </StoryChapter>
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
          "prose-headings:tracking-tight prose-headings:font-bold",
          "prose-p:leading-7 prose-p:text-muted-foreground",
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
    <section id="about" className="max-w-4xl mx-auto w-full px-4 py-16 md:py-24">
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
                <span className="text-2xs text-muted-foreground leading-snug">{description}</span>
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
  const reduce = Boolean(useReducedMotion());
  const { lede, rest } = splitLede(appConfig.summary);

  return (
    <section
      id="about"
      className="relative mx-auto w-full max-w-app px-4 py-24 md:px-12 md:py-32"
    >
      <div className="space-y-16 md:space-y-20">
        {/* ── Header ── */}
        <BlurFade delay={BLUR_FADE_DELAY}>
          <DynamicHeading id="about" label="About me" icon={Code2} serif="My">
            Approach
          </DynamicHeading>
        </BlurFade>

        {/* ── Statement, then elaboration ──
            The summary was a single undifferentiated prose block. Its first
            sentence is the thesis; the rest is support. Setting them at one
            size threw that away. */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <Reveal reduce={reduce}>
            <p className="text-balance text-2xl font-medium leading-snug tracking-tight text-foreground md:text-3xl">
              {lede}
            </p>
          </Reveal>
          <Reveal reduce={reduce} delay={0.08}>
            <div className="prose prose-base max-w-none text-pretty leading-relaxed text-muted-foreground dark:prose-invert prose-p:mb-4 prose-strong:font-semibold prose-strong:text-foreground">
              <Markdown>{rest}</Markdown>
            </div>
          </Reveal>
        </div>

        {/* ── Pillars ──
            No cards. The rest of this variant is already card-heavy — hero
            profile, work, projects, bento — and four more rounded boxes with
            icon chips is the default shape, not a decision. A ruled four-column
            spec reads as capability, and gives the section its own texture.
            Each block hinges down off its own rule: the perspective device has
            something to be hinged to, instead of floating for its own sake. */}
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, label, description }, i) => (
            <motion.div
              key={label}
              variants={hingeDown(reduce)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07 }}
              style={{ transformOrigin: "top" }}
              className="group border-t border-border pt-5"
            >
              <Icon className="size-4 text-subtle-foreground transition-colors duration-200 ease-out group-hover:text-primary" />
              <p className="mt-4 text-sm font-semibold tracking-tight text-foreground">
                {label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Closing rail ──
            The traits used to float in the header opposite the heading, four
            adjectives with nothing to attach to that paraphrased the pillars
            below them. Set as a single mono line they read as a summary of the
            section rather than four more chips. */}
        <Reveal reduce={reduce}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-border pt-6">
            <p className="font-mono text-xs uppercase tracking-widest text-subtle-foreground">
              {TRAITS.join(" · ")}
            </p>
            <span className="font-serif text-xl italic text-muted-foreground">
              Always building.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────

/** First sentence carries the claim; the remainder supports it. */
function splitLede(text: string) {
  const match = text.match(/^(.*?[.!?])\s+([\s\S]+)$/);
  return match
    ? { lede: match[1], rest: match[2] }
    : { lede: text, rest: "" };
}

/** No `filter: blur()` — it is paint-bound, and the hero dropped it for exactly
 *  that reason. Dynamic reveals with depth instead. */
function Reveal({
  children,
  reduce,
  delay = 0,
}: {
  children: React.ReactNode;
  reduce: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      variants={liftIn(reduce)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
