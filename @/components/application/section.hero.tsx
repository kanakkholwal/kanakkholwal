"use client";
import { StyleSwap } from "@/components/animated/style-swap";
import { StoryOpening, StoryReveal } from "@/components/application/story.frame";
import { HeroOrbit } from "@/components/application/hero.orbit.client";
import {
  HeroOrbitMinimal,
  HeroOrbitStatic,
  HeroOrbitStory,
  type HeroOrbitPayload,
} from "@/components/application/hero.orbit.shared";
import { Icon, IconType } from "@/components/icons";
import { ButtonLink } from "@/components/utils/link";
import { StyleModels, StylingModel } from "@/constants/ui";
import { Variants, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { appConfig, resume_link } from "root/project.config";

import useStorage from "@/hooks/use-storage";

import Magnet from "@/components/animated/elements.magnet";
import { SpotlightReveal } from "@/components/animated/section.reveal";
import { TextFlip } from "@/components/animated/text-flip";
import { Panel } from "@/components/application/panel";
import { Logo } from "@/components/logo";
import { GreaterSeparator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import RotatingText from "../animated/text.rotate";


export default function Section({ orbitData }: { orbitData?: HeroOrbitPayload }) {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <StyleSwap swapKey={selectedStyle}>
      {selectedStyle === "minimal" ? (
        <MinimalHero orbitData={orbitData} />
      ) : selectedStyle === "static" ? (
        <StaticHero orbitData={orbitData} />
      ) : selectedStyle === "story" ? (
        <StoryHero orbitData={orbitData} />
      ) : (
        <SpotlightReveal>
          <DynamicHero orbitData={orbitData} />
        </SpotlightReveal>
      )}
    </StyleSwap>
  );
}


function StoryHero({ orbitData }: { orbitData?: HeroOrbitPayload } = {}) {
  return (
    <StoryOpening id="hero">
      {/* Avatar / name / role carry the same layoutIds as the other heroes, so
          they travel into place when you switch into or out of story mode. */}
      <div className="flex items-center gap-4">
        <motion.div layoutId="hero-avatar" className="shrink-0">
          <Image
            src={appConfig.avatar}
            alt={appConfig.displayName}
            width={56}
            height={56}
            className="size-14 rounded-full border border-border/60 object-cover"
            fetchPriority="high"
          />
        </motion.div>
        <div className="min-w-0">
          <motion.h1
            layoutId="hero-name"
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            {appConfig.displayName}
          </motion.h1>
          <motion.div layoutId="hero-role" className="mt-1">
            <RotatingText
              texts={appConfig.applicableRoles}
              mainClassName="text-sm font-medium text-muted-foreground"
              rotationInterval={2800}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
            />
          </motion.div>
        </div>
      </div>

      <StoryReveal delay={0.05}>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          A portfolio, read as a story
        </p>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-foreground/90">
          {appConfig.summary}
        </p>
      </StoryReveal>

      <motion.div layoutId="hero-cta" className="mt-8 flex flex-wrap items-center gap-3">
        <ButtonLink
          href={resume_link}
          target="_blank"
          rounded="full"
          variant="outline"
          className="h-11 px-6"
        >
          <Icon name="download" />
          Resume
        </ButtonLink>
        {/* The arrow moves, not the gap — animating `gap` forces layout on
            every frame to shift an icon 4px. */}
        <a
          href="#about"
          className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-foreground"
        >
          Start reading
          <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-1" />
        </a>
      </motion.div>

      <motion.div
        layoutId="hero-socials"
        className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/30 pt-6"
      >
        <span className="font-mono text-2xs uppercase tracking-widest text-subtle-foreground">
          Find me
        </span>
        {Object.entries(appConfig.social).map(([key, link]) => (
          <a
            key={key}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 text-xs font-medium capitalize text-muted-foreground transition-colors duration-150 ease-out hoverable:text-foreground"
          >
            <Icon name={key as IconType} className="size-4" />
            <span>{key}</span>
          </a>
        ))}
      </motion.div>

      {orbitData && <HeroOrbitStory {...orbitData} />}
    </StoryOpening>
  );
}

// Hoisted: these were rebuilt on every render, which defeats variant identity.
// No `filter: blur()` — it is paint-bound and ran across the full-width hero
// during hydration.
const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0, duration: 0.42 },
  },
};

const STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
};

const REDUCED: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

function DynamicHero({ orbitData }: { orbitData?: HeroOrbitPayload } = {}) {
  const reduce = useReducedMotion();
  const fadeUp = reduce ? REDUCED : FADE_UP;
  const stagger = reduce ? REDUCED : STAGGER;

  return (
    <section
      id="hero"
      className="relative flex min-h-[95dvh] w-full flex-col"
    >
      {/* ── Background: subtle dot grid only (no glows / vignette) ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle,color-mix(in_oklab,var(--foreground)_8%,transparent)_1px,transparent_1px)] bg-[size:28px_28px]" />
      </div>

      {/* ── Top status strip ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex items-center justify-between px-6 md:px-14 pt-6 pb-2"
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Available for work
          </span>
        </div>
        {/* Was muted-foreground/50 — roughly 2.3:1. The subtle token is the
            third tier and still clears 4.5:1. */}
        <span className="hidden font-mono text-xs text-subtle-foreground sm:block">
          {appConfig.location}
        </span>
      </motion.div>

      {/* ── Main content ──
          `minmax(0,1fr)`, not `1fr`. A bare `1fr` is `minmax(auto,1fr)`, so the
          track refuses to shrink below its min-content width — and the h1 at
          clamp(2.6rem,6.5vw,5rem) plus the CTA row set a large one. That is what
          pushed the grid past its container and out through the page. */}
      <div className="relative z-10 grid flex-1 items-center gap-8 px-6 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,380px)] md:gap-10 md:px-14">
        {/* Left — Text column */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex min-w-0 max-w-2xl flex-col gap-5"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <div className="h-px w-8 bg-primary/60" />
            <span className="text-2xs font-semibold uppercase tracking-[0.18em] text-primary">
              {appConfig.role}
            </span>
          </motion.div>

          {/* Headline — rotating roles */}
          <motion.div variants={fadeUp} className="space-y-2">
            {/* Plain text. HyperText scrambled the name into random glyphs for
                900ms on view and again on every hover — unselectable, and the
                mutating DOM text thrashed screen readers. */}
            <motion.h1
              layoutId="hero-name"
              className="text-balance text-[clamp(2.6rem,6.5vw,5rem)] font-black leading-[0.9] tracking-tighter text-foreground"
            >
              {appConfig.displayName}
            </motion.h1>
            <motion.div
              layoutId="hero-role"
              className="flex flex-wrap items-center gap-3 text-[clamp(1rem,2.5vw,1.4rem)] font-semibold text-muted-foreground"
            >
              <span>I</span>
              {/* Sits on the card so text-primary reads at 4.05:1 rather than
                  the 3.42:1 a 10% primary wash gave. Width is a min, not a
                  fixed 45 — a longer role used to clip. */}
              <div className="min-w-44 overflow-hidden rounded-lg border border-primary/25 bg-card px-3 py-1">
                <RotatingText
                  texts={appConfig.applicableRoles}
                  mainClassName="text-primary font-bold"
                  rotationInterval={2800}
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Description. Was an infinite shimmer wave running under body copy,
              dipping below 4.5:1 at the trough of every cycle. */}
          <motion.p
            variants={fadeUp}
            className="max-w-lg text-base leading-relaxed text-muted-foreground"
          >
            {appConfig.description}
          </motion.p>

          {/* CTA row — one primary, one secondary. Both used to be neutral
              pills of identical weight. */}
          <motion.div layoutId="hero-cta" variants={fadeUp} className="flex flex-wrap gap-3">
            <ButtonLink
              href="/projects"
              size="lg"
              rounded="full"
              variant="default"
              icon={ArrowRight}
              iconPlacement="right"
              effect="expandIcon"
            >
              View projects
            </ButtonLink>
            <ButtonLink
              href={resume_link}
              target="_blank"
              size="lg"
              rounded="full"
              variant="outline"
            >
              <Icon name="download" />
              Resume
            </ButtonLink>
          </motion.div>

          {/* Stat pills */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            {(orbitData
              ? [
                  { value: `${orbitData.stats.yearsExp}+`, label: "yrs exp" },
                  { value: `${orbitData.stats.projects}+`, label: "projects" },
                  { value: `${orbitData.stats.ossRepos}+`, label: "OSS repos" },
                ]
              : [
                  { value: "2+", label: "yrs exp" },
                  { value: "20+", label: "projects" },
                  { value: "10+", label: "OSS repos" },
                ]
            ).map((s) => (
              <div
                key={s.label}
                className="flex items-baseline gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 backdrop-blur-sm"
              >
                {/* Was text-sm against a text-xs label — 2px of hierarchy
                    between a number and its caption. */}
                <span className="text-lg font-bold tabular-nums tracking-tight text-foreground">
                  {s.value}
                </span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* md, not lg. Gating the hero's only visual at 1024px left the whole
            768–1023px range with a half-empty 95dvh screen. */}
        <div className="hidden min-w-0 items-center justify-center md:flex">
          {orbitData ? (
            <HeroOrbit
              stats={orbitData.stats}
              activity={orbitData.activity}
              fallback={orbitData.fallback}
            />
          ) : null}
        </div>
      </div>

      {/* ── Social strip ── */}
      <motion.div
        layoutId="hero-socials"
        className="relative z-10 flex items-center gap-4 px-6 md:px-14 pb-6 pt-4 border-t border-border/30"
      >
        <span className="shrink-0 font-mono text-2xs uppercase tracking-widest text-subtle-foreground">
          Find me
        </span>
        <div className="flex flex-wrap items-center gap-1">
          {Object.entries(appConfig.social).map(([key, link]) => (
            <a
              key={key}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              // min-h-11/min-w-11 = 44px. These were ~30px, icon-only on
              // mobile, at the very bottom edge of a 95dvh section.
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-transparent px-3 text-xs font-medium capitalize text-muted-foreground transition-colors duration-150 ease-out hoverable:border-border/50 hoverable:bg-accent hoverable:text-foreground"
            >
              <Icon name={key as IconType} className="size-4 shrink-0" />
              <span className="hidden sm:inline">{key}</span>
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-subtle-foreground">
          <span className="hidden font-mono text-2xs uppercase tracking-widest md:block">
            Scroll
          </span>
          {/* Infinite, so it stops under reduced motion. Was ungated, and the
              /30 tint measured ~1.4:1 — implied rather than visible. */}
          <motion.div
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-subtle-foreground"
          />
        </div>
      </motion.div>
    </section>
  );
}




function MinimalHero({ orbitData }: { orbitData?: HeroOrbitPayload } = {}) {
  return (
    <>
      {/* Was `bg-black/0.75` (0.75% — the modifier is 0–100) and
          `[--pattern-foreground:…]/5`, where the /5 cannot apply alpha to a
          custom property, so the dots rendered at full opacity. */}
      <div
        className={cn(
          "aspect-2/1 select-none border-x border-edge sm:aspect-3/1",
          "flex items-center justify-center text-foreground",
          "screen-line-before screen-line-after before:-top-px after:-bottom-px",
          "bg-center bg-size-[10px_10px] bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)]",
          "[--pattern-foreground:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
        )}
      >
        <Magnet magnetStrength={6}>
          <Logo id="js-cover-mark" className="h-14 w-28 sm:h-16 sm:w-32" />
        </Magnet>
      </div>

      <div className="relative flex border-x border-edge px-3">
        <div className="shrink-0 border-r border-edge">
          <div className="m-1">
            {/* next/image with explicit dimensions, matching the story hero.
                A raw <img> with no width/height shifted the layout on load. */}
            <motion.div layoutId="hero-avatar" className="relative size-28 sm:size-40">
              <Image
                src={appConfig.avatar}
                alt={`${appConfig.displayName}'s avatar`}
                width={160}
                height={160}
                priority
                className="size-full select-none rounded-full object-cover ring-1 ring-input ring-offset-2 ring-offset-background"
              />
            </motion.div>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex grow items-end pb-1 pl-4">
            <div className="line-clamp-1 font-mono text-xs text-muted-foreground select-none max-sm:hidden inline-flex items-center gap-1">
              <MapPin className="inline-block mr-1 size-3" size={12} />
              {appConfig.location}
            </div>
          </div>

          <div className="border-t border-edge">
            <div className="flex items-center gap-2 pl-4">
              <motion.h1
                layoutId="hero-name"
                className="text-3xl font-semibold tracking-tight"
              >
                {appConfig.displayName}
              </motion.h1>
              {/* aria-label needs a role to be announced on a non-interactive
                  element. */}
              <Icon
                name="verified:color"
                role="img"
                aria-label="Verified"
                className="size-4 select-none text-primary"
              />
            </div>

            <div className="min-h-12 border-t border-edge py-1 pl-4 sm:min-h-9">
              <motion.div layoutId="hero-role">
                <TextFlip
                  className="font-mono text-sm text-balance text-muted-foreground"
                  variants={{
                    initial: { y: -10, opacity: 0 },
                    animate: { y: -1, opacity: 1 },
                    exit: { y: 10, opacity: 0 },
                  }}
                >
                  {appConfig.applicableRoles}
                </TextFlip>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <GreaterSeparator />

      <motion.div layoutId="hero-socials">
        <Panel className="before:content-none after:content-none">
          <h2 className="sr-only">Social Links</h2>
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-2 gap-2 md:grid-cols-3">
              <div className="border-r border-edge" />
              <div className="border-l border-edge md:border-x" />
              <div className="border-l border-edge max-md:hidden" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {Object.entries(appConfig.social).map(([key, link]) => (
                <a
                  key={key}
                  className={cn(
                    "group flex cursor-pointer items-center gap-4 p-4 pr-2 transition-[background-color] ease-out hover:bg-accent-muted",
                    "max-md:nth-[2n+1]:screen-line-before max-md:nth-[2n+1]:screen-line-after",
                    "md:nth-[3n+1]:screen-line-before md:nth-[3n+1]:screen-line-after"
                  )}
                  href={link}
                  target="_blank"
                  rel="noopener"
                >
                  <div className="relative size-8 shrink-0 inline-flex items-center justify-center">
                    <Icon
                      className="rounded-lg select-none corner-squircle supports-corner-shape:rounded-[50%]"
                      name={key as IconType}
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-black/10 corner-squircle ring-inset dark:ring-white/15 supports-corner-shape:rounded-[50%]" />
                  </div>
                  <h3 className="flex-1 font-medium underline-offset-4 group-hover:underline capitalize">
                    {key}
                  </h3>
                  <Icon
                    name="arrow-up-right"
                    className="size-4 text-muted-foreground transition-[rotate] duration-300 group-hover:rotate-45"
                  />
                </a>
              ))}
            </div>
          </div>
        </Panel>
      </motion.div>

      {orbitData && (
        <div className="border-x border-edge px-3 py-3">
          <HeroOrbitMinimal {...orbitData} />
        </div>
      )}
    </>
  );
}

function StaticHero({ orbitData }: { orbitData?: HeroOrbitPayload } = {}) {
  return (
    <section
      id="hero"
      className="w-full mx-auto max-w-4xl mt-16 px-6 py-16 flex flex-col sm:flex-row items-start gap-8"
    >
      {/* Avatar */}
      <motion.div layoutId="hero-avatar" className="shrink-0">
        <Image
          className="size-24 sm:size-28 rounded-2xl ring-1 ring-border object-cover select-none hover:-rotate-4 transition-all duration-300"
          alt={`${appConfig.displayName}'s avatar`}
          src={appConfig.avatar}
          fetchPriority="high"
          height={96}
          width={96}
        />
      </motion.div>

      {/* Text */}
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <motion.h1
              layoutId="hero-name"
              className="text-2xl font-semibold tracking-tight"
            >
              {appConfig.displayName}
            </motion.h1>
            <Icon
              name="verified:color"
              className="size-4 text-sky-500 select-none"
              aria-label="Verified"
            />
          </div>
          <motion.div layoutId="hero-role">
            <TextFlip
              className="text-sm text-muted-foreground"
              variants={{
                initial: { y: -6, opacity: 0 },
                animate: { y: 0, opacity: 1 },
                exit: { y: 6, opacity: 0 },
              }}
            >
              {appConfig.applicableRoles}
            </TextFlip>
          </motion.div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
          {appConfig.description}
        </p>

        <motion.div layoutId="hero-cta" className="flex flex-wrap gap-2">
          <ButtonLink
            href={resume_link}
            target="_blank"
            size="sm"
            rounded="full"
            variant="outline"
          >
            <Icon name="download" />
            Resume
          </ButtonLink>
          <ButtonLink
            href="/projects"
            size="sm"
            rounded="full"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            Projects
            <ArrowRight className="size-3.5" />
          </ButtonLink>
        </motion.div>

        <motion.div
          layoutId="hero-socials"
          className="flex flex-col items-start gap-2 pt-3 border-t border-border/30"
        >
          <span className="text-2xs font-mono tracking-widest text-muted-foreground/50 uppercase">
            Find me
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {Object.entries(appConfig.social).map(([key, link]) => (
              <a
                key={key}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-200 border border-transparent hover:border-border/50"
              >
                <Icon name={key as IconType} className="size-3.5 shrink-0" />
                <span className="capitalize hidden sm:inline">{key}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {orbitData && <HeroOrbitStatic {...orbitData} />}
      </div>
    </section>
  );
}