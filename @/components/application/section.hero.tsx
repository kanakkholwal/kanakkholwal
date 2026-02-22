"use client";
import { GlowFillButton } from "@/components/animated/button.fill";
import { Icon, IconType } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, TransitionLink } from "@/components/utils/link";
import { StyleModels, StylingModel } from "@/constants/ui";
import { motion, useMotionValue } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { appConfig, resume_link } from "root/project.config";

import useStorage from "@/hooks/use-storage";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useSpring, useTransform } from "framer-motion";
import { Fingerprint, Wifi } from "lucide-react";
import Image from "next/image";
import Magnet from "../animated/elements.maginet";
import { SpotlightReveal } from "../animated/section.reveal";
import { TextFlip } from "../animated/text-flip";
import { Logo } from "../logo";
import { GreaterSeparator } from "../ui/separator";
import { Panel } from "./panel";

export function HeroSection() {
  return (
    <section
      id="hero"
      className={cn(
        "w-full relative h-full px-6 md:px-12 md:min-h-[60dvh] z-10 pt-16 min-h-[90dvh]",
        "mx-auto my-auto grid lg:grid-cols-12 gap-12 lg:gap-8",
      )}
    >
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="lg:col-span-7 flex flex-col justify-center text-left pt-12 lg:pt-0 space-y-4 z-2">
        <div className="flex items-start lg:items-center flex-col lg:flex-row gap-2">
          <Badge
            variant="outline"
            className="group relative pl-2 pr-4 py-1.5 rounded-full"
          >
            <span className="relative flex h-2 w-2 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>

            <span className="text-xs font-semibold tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
              AVAILABLE FOR WORK
            </span>
          </Badge>
          <span className="text-sm font-mono text-muted-foreground font-medium tracking-wide">
            {`// Hi, I am ${appConfig.displayName}`}
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.9] text-foreground">
            Building digital
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground/60 pb-2">
              products for
            </span>
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-foreground">modern web.</span>
              {/* Subtle underline highlight */}
              <span className="absolute -bottom-1 left-0 w-full h-3 bg-primary/10 -rotate-1 rounded-full -z-10" />
            </span>
          </h1>
        </div>

        <p className="text-lg text-left md:text-xl text-muted-foreground leading-relaxed font-medium text-balance">
          {appConfig.description}
        </p>

        <div
          id="cta-buttons"
          className="flex flex-wrap items-start justify-start gap-4 p-2"
        >
          <ButtonLink
            href={resume_link}
            target="_blank"
            size="lg"
            rounded="full"
            variant="light"
            className="h-12 px-6"
          >
            <Icon name="download" />
            Download Resume
          </ButtonLink>

          <GlowFillButton
            icon={ArrowRight}
            className="h-12 px-4 sm:px-8text-sm sm:text-base rounded-full font-medium text-foreground bg-muted border border-border/50 backdrop-blur-sm my-0 relative overflow-hidden"
          >
            <TransitionLink href="/projects">View Projects</TransitionLink>
          </GlowFillButton>
        </div>
      </div>

      <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center perspective-1000">
        <FloatingCard>
          <div className="relative z-10 w-full aspect-square max-w-lg flex items-center justify-center">
            {/* Inner Glow */}

            <HeroVisual />
            {/* <ProfileCard
                            avatarUrl={appConfig.avatar}
                            iconUrl={appConfig.avatar}
                            name={appConfig.displayName}
                            title={appConfig.role}
                            handle={appConfig.usernames.twitter}
                            showUserInfo={false}
                        /> */}
          </div>
        </FloatingCard>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-muted-foreground/50 to-transparent" />
      </motion.div>
    </section>
  );
}

const HeroVisual = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  return (
    <div className="flex items-center justify-center perspective-1000 py-10">
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-[340px] h-[500px] rounded-[24px] bg-gradient-to-br from-card/90 to-accent/90 border border-border/10 shadow-2xl backdrop-blur-xl group cursor-default overflow-hidden"
      >
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-15 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div
          className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden"
          style={{ mixBlendMode: "overlay" }}
        >
          <motion.div
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)",
              x: useTransform(mouseX, [-0.5, 0.5], [-100, 100]),
              y: useTransform(mouseY, [-0.5, 0.5], [-100, 100]),
            }}
            className="w-full h-full transform scale-150"
          />
        </div>

        <div
          className="relative z-10 h-full flex flex-col p-6 justify-between text-card-foreground"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="flex justify-end items-start">


            <div className="flex flex-col items-end gap-1">
              <Wifi className="text-foreground/50" size={20} />
              <span className="text-[9px] font-mono tracking-widest text-muted-foreground">
                OSS ACTIVE
              </span>
            </div>
          </div>

          {/*  Photo & Name */}
          <div className="flex flex-col items-center text-center mt-4">
            <div className="relative w-28 h-28 mb-4 group-hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 rounded-full border border-border/20 border-dashed animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-1 rounded-full bg-gradient-to-b from-card/10 to-transparent backdrop-blur-sm overflow-hidden border border-border/20">
                <Image
                  src={appConfig.avatar}
                  alt="Profile"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Active Status Dot */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-[3px] border-slate-900 rounded-full" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
              {appConfig.displayName}
            </h2>
            <div className="px-3 py-1 rounded-full bg-card/5 border border-border/10 text-xs font-medium text-muted-foreground">
              {appConfig.role}
            </div>

            <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground">
              <MapPin size={12} />
              <span>{appConfig.location}</span>
            </div>
          </div>

          {/*Barcode & ID */}
          <div className="mt-auto space-y-4">
            {/* "Signature" or Motto Area */}
            <div className="flex justify-between items-center px-2">
              <div className="flex flex-col">
                <span className="text-[9px] text-foreground/30 uppercase tracking-wider">
                  Valid Thru
                </span>
                <span className="text-xs font-mono text-muted-foreground/70">
                  12/28
                </span>
              </div>
              <div className="font-handwriting text-foreground/50 text-lg rotate-[-5deg] opacity-80">
                {appConfig.displayName.split(" ")[0]}
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-border/10 to-transparent" />

            <div className="flex justify-between items-center">
              <div className="flex gap-0.5 items-end h-8 opacity-80">
                {[3, 2, 4, 1, 3, 5, 2, 3, 4, 2, 5, 1, 3, 2, 4, 3].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary/90 rounded-sm"
                      style={{ height: `${h * 20}%` }}
                    />
                  ),
                )}
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-2 text-emerald-400">
                  <Fingerprint size={16} />
                  <span className="text-[10px] font-bold tracking-widest">
                    VERIFIED
                  </span>
                </div>
                <span className="text-[9px] font-mono text-muted-foreground tracking-[0.2em] block mt-0.5">
                  ID-8492-X
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// A simple 3D Tilt Wrapper for the right-side visual
const FloatingCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="relative overflow-hidden"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotateX: [0, 5, 0],
          rotateY: [0, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-20"
      >
        {children}
      </motion.div>

    </motion.div>
  );
};


export default function Section() {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );
  if (selectedStyle === "minimal") {
    return <>
      <div
        className={cn(
          "aspect-2/1 border-x border-edge select-none sm:aspect-3/1",
          "flex items-center justify-center text-black dark:text-white",
          "screen-line-before screen-line-after before:-top-px after:-bottom-px",
          "bg-black/0.75 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5"
        )}
      >
        <Magnet magnetStrength={6}>
          <Logo
            id="js-cover-mark"
            className="h-14 w-28 sm:h-16 sm:w-32"
          />
        </Magnet>
      </div>
      <div className="relative flex border-x border-edge">
        {/* <div className="absolute top-[-3.5px] left-[-4.5px] size-2 rounded-xs border bg-popover" /> */}
        {/* <div className="absolute top-[-3.5px] right-[-4.5px] size-2 rounded-xs border bg-popover" /> */}

        <div className="shrink-0 border-r border-edge">
          <div className="mx-0.5 my-0.75">
            <img
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
              <h1 className="-translate-y-px text-3xl font-semibold tracking-tight">
                {appConfig.displayName}
              </h1>

              <Icon name="verified:color"
                className="size-4.5 text-sky-500 select-none"
                aria-label="Verified"
              />


            </div>

            <div className="h-12.5 border-t border-edge py-1 pl-4 sm:h-9">
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
            </div>
          </div>
        </div>
      </div>
      <GreaterSeparator />
      <Panel className="before:content-none after:content-none">
        <h2 className="sr-only">Social Links</h2>

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-2 gap-2 md:grid-cols-3">
            <div className="border-r border-edge" />
            <div className="border-l border-edge md:border-x" />
            <div className="border-l border-edge max-md:hidden" />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {Object.entries(appConfig.social).map(([key, link], index) => {
              return <a
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

                <Icon name="arrow-up-right" className="size-4 text-muted-foreground transition-[rotate] duration-300 group-hover:rotate-45" />
              </a>
            })}
          </div>
        </div>
      </Panel>
    </>;
  }
  return <SpotlightReveal>
    <HeroSection />
  </SpotlightReveal>
}