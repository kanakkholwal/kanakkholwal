"use client";
import { GlowFillButton } from "@/components/animated/button.fill";
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
import { ButtonLink, TransitionLink } from "@/components/utils/link";
import { StyleModels, StylingModel } from "@/constants/ui";
import { Variants, motion } from "framer-motion";
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
import { HyperText } from "../animated/text.hyper";
import RotatingText from "../animated/text.rotate";
import { ShimmeringText } from "../animated/text.shimmer";


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
        <a
          href="#about"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-all hover:gap-2.5"
        >
          Start reading
          <ArrowRight className="size-4" />
        </a>
      </motion.div>

      <motion.div
        layoutId="hero-socials"
        className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/30 pt-6"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
          Find me
        </span>
        {Object.entries(appConfig.social).map(([key, link]) => (
          <a
            key={key}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon name={key as IconType} className="size-3.5" />
            <span className="capitalize">{key}</span>
          </a>
        ))}
      </motion.div>

      {orbitData && <HeroOrbitStory {...orbitData} />}
    </StoryOpening>
  );
}

function DynamicHero({ orbitData }: { orbitData?: HeroOrbitPayload } = {}) {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 240, damping: 24 } as never,
    },
  };

  const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[95dvh] flex flex-col overflow-hidden"
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
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
            Available for work
          </span>
        </div>
        <span className="text-xs font-mono text-muted-foreground/50 hidden sm:block">
          {appConfig.location}
        </span>
      </motion.div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-6 items-center px-6 md:px-14 py-4">
        {/* Left — Text column */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5 max-w-2xl"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <div className="h-px w-8 bg-primary/60" />
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              {appConfig.role}
            </span>
          </motion.div>

          {/* Headline — name scramble + rotating roles */}
          <motion.div variants={fadeUp} className="space-y-2">
            <motion.h1
              layoutId="hero-name"
              className="text-[clamp(2.6rem,6.5vw,5rem)] font-black tracking-tighter leading-[0.9] text-foreground"
            >
              <HyperText
                className="inline"
                duration={900}
                startOnView
                animateOnHover
              >
                {appConfig.displayName}
              </HyperText>
            </motion.h1>
            <motion.div
              layoutId="hero-role"
              className="flex items-center gap-3 text-[clamp(1rem,2.5vw,1.4rem)] font-semibold text-muted-foreground"
            >
              <span>I</span>
              <div className="overflow-hidden rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 min-w-45">
                <RotatingText
                  texts={appConfig.applicableRoles}
                  mainClassName="text-primary font-bold"
                  rotationInterval={2800}
                  transition={{ type: "spring", damping: 20, stiffness: 200 }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Shimmering description */}
          <motion.p
            variants={fadeUp}
            className="text-sm md:text-base leading-relaxed max-w-lg"
          >
            <ShimmeringText
              text={appConfig.description}
              duration={2.5}
              wave
              color="var(--muted-foreground)"
              shimmeringColor="var(--foreground)"
            />
          </motion.p>

          {/* CTA row */}
          <motion.div layoutId="hero-cta" variants={fadeUp} className="flex flex-wrap gap-3">
            <GlowFillButton
              icon={ArrowRight}
              className="h-11 px-6 rounded-full font-medium text-foreground bg-muted border border-border/50 backdrop-blur-sm my-0 relative overflow-hidden"
            >
              <TransitionLink href="/projects">View Projects</TransitionLink>
            </GlowFillButton>
            <ButtonLink
              href={resume_link}
              target="_blank"
              size="default"
              rounded="full"
              variant="outline"
              className="h-11 px-6"
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
                className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-card/40 backdrop-blur-sm"
              >
                <span className="text-sm font-black tracking-tight tabular-nums">{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="hidden lg:flex items-center justify-center">
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
        <span className="text-[10px] font-mono tracking-widest text-muted-foreground/50 uppercase shrink-0">
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
        <div className="ml-auto flex items-center gap-2 text-muted-foreground/30">
          <span className="text-[10px] font-mono uppercase tracking-widest hidden md:block">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-muted-foreground/30"
          />
        </div>
      </motion.div>
    </section>
  );
}




function MinimalHero({ orbitData }: { orbitData?: HeroOrbitPayload } = {}) {
  return (
    <>
      <div
        className={cn(
          "aspect-2/1 border-x border-edge select-none sm:aspect-3/1",
          "flex items-center justify-center text-black dark:text-white",
          "screen-line-before screen-line-after before:-top-px after:-bottom-px",
          "bg-black/0.75 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5"
        )}
      >
        <Magnet magnetStrength={6}>
          <Logo id="js-cover-mark" className="h-14 w-28 sm:h-16 sm:w-32" />
        </Magnet>
      </div>

      <div className="relative flex border-x border-edge px-3">
        <div className="shrink-0 border-r border-edge">
          <div className="mx-0.5 my-0.75">
            <motion.img
              layoutId="hero-avatar"
              className="size-30 rounded-full ring-1 ring-border ring-offset-2 ring-offset-background select-none sm:size-40"
              alt={`${appConfig.displayName}'s avatar`}
              src={appConfig.avatar}
              fetchPriority="high"
            />
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
                className="-translate-y-px text-3xl font-semibold tracking-tight"
              >
                {appConfig.displayName}
              </motion.h1>
              <Icon
                name="verified:color"
                className="size-4.5 text-sky-500 select-none"
                aria-label="Verified"
              />
            </div>

            <div className="h-12.5 border-t border-edge py-1 pl-4 sm:h-9">
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
          <span className="text-[10px] font-mono tracking-widest text-muted-foreground/50 uppercase">
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