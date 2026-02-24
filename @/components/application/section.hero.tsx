"use client";
import { GlowFillButton } from "@/components/animated/button.fill";
import { Icon, IconType } from "@/components/icons";
import { ButtonLink, TransitionLink } from "@/components/utils/link";
import { StyleModels, StylingModel } from "@/constants/ui";
import { AnimatePresence, Variants, motion, useMotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { appConfig, resume_link } from "root/project.config";

import useStorage from "@/hooks/use-storage";
import * as React from "react";

import Magnet from "@/components/animated/elements.magnet";
import { SpotlightReveal } from "@/components/animated/section.reveal";
import { TextFlip } from "@/components/animated/text-flip";
import { CountingNumber } from "@/components/animated/text.counter";
import { Panel } from "@/components/application/panel";
import { Logo } from "@/components/logo";
import { GreaterSeparator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { HyperText } from "../animated/text.hyper";
import RotatingText from "../animated/text.rotate";
import { ShimmeringText } from "../animated/text.shimmer";


export default function Section() {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="hero-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <MinimalHero />
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="hero-static"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StaticHero />
        </motion.div>
      ) : (
        <motion.div
          key="hero-dynamic"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <SpotlightReveal>
            <DynamicHero />
          </SpotlightReveal>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function DynamicHero() {
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
      {/* ── Background layers ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Fine dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_hsl(var(--foreground)/0.08)_1px,_transparent_1px)] bg-[size:28px_28px]" />
        {/* Dual radial glows */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
        {/* Vignette */}
        <div className="absolute inset-0 [background:radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,hsl(var(--background)/0.7)_100%)]" />
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
              <div className="overflow-hidden rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 min-w-[180px]">
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
              color="hsl(var(--muted-foreground))"
              shimmeringColor="hsl(var(--foreground))"
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
            {[
              { value: "2+", label: "yrs exp" },
              { value: "20+", label: "projects" },
              { value: "10+", label: "OSS repos" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-card/40 backdrop-blur-sm"
              >
                <span className="text-sm font-black tracking-tight">{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="hidden lg:flex items-center justify-center">
          <HeroOrbit />
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
            className="w-px h-8 bg-gradient-to-b from-muted-foreground/40 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}




function MinimalHero() {
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

      <div className="relative flex border-x border-edge">
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
            <div className="line-clamp-1 font-mono text-xs text-zinc-300 select-none max-sm:hidden dark:text-zinc-800">
              {"text-3xl "}
              <span className="inline dark:hidden">text-zinc-950</span>
              <span className="hidden dark:inline">text-zinc-50</span>
              {" font-medium"}
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
                  className="font-pixel-square text-sm text-balance text-muted-foreground"
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
    </>
  );
}

function StaticHero() {
  return (
    <section
      id="hero"
      className="w-full mx-auto max-w-3xl mt-16 px-6 py-16 flex flex-col sm:flex-row items-start gap-8"
    >
      {/* Avatar */}
      <motion.div layoutId="hero-avatar" className="shrink-0">
        <img
          className="size-24 sm:size-28 rounded-2xl ring-1 ring-border object-cover select-none"
          alt={`${appConfig.displayName}'s avatar`}
          src={appConfig.avatar}
          fetchPriority="high"
        />
      </motion.div>

      {/* Text */}
      <div className="flex flex-col gap-3">
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
      </div>
    </section>
  );
}
/** Social + tech icons that orbit the avatar */
const ORBIT_INNER = ["github", "linkedin", "twitter"] as const;
const ORBIT_OUTER = [
  "terminal",
  "code",
  "package",
  "globe",
  "rocket",
  "cpu",
] as const;

/** Activity items shown on the right panel */
const ACTIVITY = [
  { icon: "rocket" as IconType,   label: "Shipped", value: "nexo-mdx v2",      time: "2d ago" },
  { icon: "package" as IconType,  label: "Published", value: "custom-domain-sdk", time: "1w ago" },
  { icon: "code" as IconType,     label: "PR merged", value: "college-ecosystem", time: "3d ago" },
  { icon: "stars:bs" as IconType, label: "Starred",   value: "20+ repos",        time: "ongoing" },
] as const;

function HeroOrbit() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(
    useSpring(y, { stiffness: 380, damping: 80 }),
    [-0.4, 0.4],
    [10, -10],
  );
  const rotateY = useTransform(
    useSpring(x, { stiffness: 380, damping: 80 }),
    [-0.4, 0.4],
    [-10, 10],
  );

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: 16 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 260, damping: 22 } as never,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className="select-none"
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
    >
      {/* Outer glow */}
      <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-primary/5 blur-2xl" />

      {/* Card shell */}
      <div className="relative w-[340px] rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-red-500/80" />
            <span className="size-2.5 rounded-full bg-yellow-500/80" />
            <span className="size-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground tracking-widest">
            {appConfig.usernames?.github ?? "kanakkholwal"}
          </span>
          <div className="flex items-center gap-1 text-emerald-500">
            <span className="relative flex size-1.5">
              <span className="animate-ping absolute inline-flex size-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-mono">active</span>
          </div>
        </div>

        {/* ── Avatar + identity ── */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-border/30">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg scale-110" />
            <div className="relative size-14 rounded-full ring-2 ring-border ring-offset-2 ring-offset-card overflow-hidden">
              <Image
                src={appConfig.avatar}
                alt={appConfig.displayName}
                width={56}
                height={56}
                className="w-full h-full object-cover"
                fetchPriority="high"
              />
            </div>
            <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 ring-2 ring-card" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold truncate">{appConfig.displayName}</p>
              <Icon name="verified:color" className="size-3.5 text-sky-500 shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground truncate">{appConfig.role}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono truncate">
              {appConfig.location}
            </p>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 divide-x divide-border/40 border-b border-border/30">
          {[
            { to: 20, suffix: "+", label: "Projects" },
            { to: 10, suffix: "+", label: "OSS repos" },
            { to: 2,  suffix: "+", label: "Yrs exp" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center py-3 gap-0.5">
              <span className="text-base font-black tracking-tight tabular-nums">
                <CountingNumber to={s.to} suffix={s.suffix} duration={1.8} startOnView once />
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Activity feed ── */}
        <div className="px-4 py-3">
          <p className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-2.5">
            Recent activity
          </p>
          <motion.ul
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {ACTIVITY.map((item) => (
              <motion.li
                key={item.value}
                variants={itemVariants}
                className="flex items-center gap-2.5"
              >
                <div className="flex items-center justify-center size-6 rounded-md bg-muted/60 shrink-0">
                  <Icon name={item.icon} className="size-3 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] text-muted-foreground">{item.label}{" "}</span>
                  <span className="text-[11px] font-medium text-foreground truncate">{item.value}</span>
                </div>
                <span className="text-[9px] font-mono text-muted-foreground/50 shrink-0">{item.time}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* ── Social footer ── */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/30">
          {ORBIT_INNER.map((key) => (
            <a
              key={key}
              href={appConfig.social[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={key as IconType} className="size-3.5" />
              <span className="capitalize font-medium text-[11px]">{key}</span>
            </a>
          ))}
          <a
            href={appConfig.social["cal.com"]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="cal.com" className="size-3.5" />
            <span className="font-medium text-[11px]">Book a call</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}