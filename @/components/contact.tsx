"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { Socials } from "@/components/socials";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/utils/link";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Copy,
  Mail,
  MapPin,
  Sparkles,
  Timer
} from "lucide-react";
import { useRef, useState } from "react";
import { appConfig } from "root/project.config";
import { Icon, IconType } from "./icons";

const BLUR_FADE_DELAY = 0.04;

const QUICK_STATS = [
  { label: "Response time", value: "< 24h", icon: Timer },
  { label: "Availability", value: "Open", icon: Sparkles },
  { label: "Location", value: "India", icon: MapPin },
] as const;

export function ContactSection() {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );
  const [copied, setCopied] = useState(false);
  const email = appConfig.emails[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="contact-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <MinimalContact email={email} copied={copied} onCopy={handleCopy} />
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="contact-static"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StaticContact email={email} copied={copied} onCopy={handleCopy} />
        </motion.div>
      ) : (
        <motion.div
          key="contact-dynamic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
            <DynamicContact email={email} copied={copied} onCopy={handleCopy} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Minimal


function MinimalContact({
  email,
  copied,
  onCopy,
}: {
  email: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <section id="contact" className="w-full mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">
            Let's work together
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Have a project in mind? Reach out and let's build something great.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onCopy}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-500" />
            ) : (
              <Copy className="size-3.5" />
            )}
            <span className="font-mono text-xs">{email}</span>
          </button>
          <div className="w-px h-4 bg-border" />
          <Button asChild size="sm" rounded="full" variant="outline">
            <TransitionLink href="/contact">
              <Sparkles className="size-3.5" />
              Get in touch
            </TransitionLink>
          </Button>
        </div>
      </div>
    </section>
  );
}


function StaticContact({
  email,
  copied,
  onCopy,
}: {
  email: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <section
      id="contact"
      className="max-w-4xl mx-auto w-full px-4 py-16 md:py-24"
    >
      <div className="border-t border-border pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* ── Left column ── */}
          <div className="space-y-8">
            <BlurFade delay={BLUR_FADE_DELAY}>
              <div className="space-y-3">
                <motion.span
                  layoutId="contact-label"
                  className="inline-block text-xs font-mono font-medium tracking-widest uppercase text-muted-foreground"
                >
                  // Get in Touch
                </motion.span>
                <motion.h2
                  layoutId="contact-heading"
                  className="text-3xl md:text-4xl font-bold tracking-tight leading-tight"
                >
                  Let's work<br />together.
                </motion.h2>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <p className="text-muted-foreground text-base leading-relaxed">
                Open to freelance, collaborations, and full-time roles. Whether
                it's a product idea, a design system, or a quick chat — I'm
                all ears.
              </p>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 5}>
              <div className="flex items-center gap-1">
                <Socials />
              </div>
            </BlurFade>
          </div>

          {/* ── Right column ── */}
          <BlurFade delay={BLUR_FADE_DELAY * 4} className="flex flex-col gap-4">
            {/* Availability pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 tracking-wide">
                Available for new projects
              </span>
            </div>

            {/* Email copy row */}
            <button
              onClick={onCopy}
              className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border bg-muted/40 hover:bg-muted transition-colors text-left"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="flex items-center justify-center size-8 rounded-lg bg-background border border-border text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                  <Mail className="size-4" />
                </span>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Email
                  </p>
                  <p className="text-sm font-medium font-mono truncate text-foreground">
                    {email}
                  </p>
                </div>
              </div>
              {copied ? (
                <Check className="size-3.5 text-emerald-500 shrink-0" />
              ) : (
                <Copy className="size-3.5 text-muted-foreground shrink-0" />
              )}
            </button>

            {/* Book a call row */}
            <a
              href={appConfig.social["cal.com"]}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border bg-muted/40 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center size-8 rounded-lg bg-background border border-border text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                  <CalendarDays className="size-4" />
                </span>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Schedule
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    Book a 30-min call
                  </p>
                </div>
              </div>
              <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            </a>

            {/* CTA */}
            <Button asChild size="default" rounded="full" variant="dark" className="mt-1">
              <TransitionLink href="/contact">
                <Sparkles className="size-4" />
                Start a project
                <ArrowUpRight className="size-4" />
              </TransitionLink>
            </Button>

            {/* Quick stats strip */}
            <div className="grid grid-cols-3 divide-x divide-border border border-border rounded-2xl overflow-hidden mt-2">
              {QUICK_STATS.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center py-4 px-2 bg-muted/20 hover:bg-muted/40 transition-colors text-center gap-1"
                >
                  <Icon className="size-3.5 text-muted-foreground" />
                  <span className="text-base font-bold font-mono tracking-tight text-foreground">
                    {value}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}

// Dynamic


function DynamicContact({
  email,
  copied,
  onCopy,
}: {
  email: string;
  copied: boolean;
  onCopy: () => void;
}) {
  const ref = useRef(null);

  return (
    <section
      id="contact"
      className="relative w-full py-32 px-4 overflow-hidden max-w-7xl mx-auto"
    >
  

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 } }
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="group relative"
        >
       

          <div className="p-8 md:p-14 flex flex-col md:flex-row items-start gap-10 md:gap-14">
            <div className="flex-1 space-y-7 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-emerald-500 tracking-wide">
                  Available for new projects
                </span>
              </motion.div>

              {/* Heading */}
              <div className="space-y-3">
                <motion.span layoutId="contact-label" className="sr-only" aria-hidden />
                <motion.h2
                  layoutId="contact-heading"
                  className="text-4xl md:text-5xl font-bold tracking-tight leading-tight"
                >
                  Let's build the{" "}
                  <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-foreground/30">
                    next big thing.
                  </span>
                </motion.h2>
                <p className="text-base text-muted-foreground max-w-xs mx-auto md:mx-0 leading-relaxed">
                  Open to freelance, collabs, and full-time roles. Let's turn
                  ideas into products.
                </p>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {QUICK_STATS.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border text-xs text-muted-foreground"
                  >
                    <Icon className="size-3 shrink-0" />
                    <span>{value}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                asChild
                rounded="full"
                variant="dark"
                className="shadow-xl shadow-foreground/10"
              >
                <TransitionLink href="/contact">
                  <Sparkles  />
                  Start a Project
                </TransitionLink>
              </Button>
            </div>

            {/* ── Right: reach-me card ── */}
            <div className="w-full md:w-[340px] shrink-0">
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
                {/* Card header */}
                <div className="px-5 py-4 border-b border-border60">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-foreground">
                    // How to reach me
                  </p>
                </div>

                {/* Email copy row */}
                <button
                  onClick={onCopy}
                  className="group/copy w-full flex items-center justify-between px-5 py-4 border-b border-border/60 hover:bg-card transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="flex items-center justify-center size-8 rounded-lg bg-card/90 text-muted-foreground group-hover/copy:text-foreground transition-colors shrink-0">
                      <Mail className="size-4" />
                    </span>
                    <div className="overflow-hidden text-left">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-foreground">
                        Email
                      </p>
                      <p className="text-sm font-mono text-muted-foreground truncate max-w-[190px]">
                        {email}
                      </p>
                    </div>
                  </div>
                  <div className="relative size-8 flex items-center justify-center shrink-0">
                    <motion.div
                      initial={false}
                      animate={{ scale: copied ? 0 : 1, opacity: copied ? 0 : 1 }}
                      className="absolute"
                    >
                      <Copy className="size-3.5 text-foreground group-hover/copy:text-white transition-colors" />
                    </motion.div>
                    <motion.div
                      initial={false}
                      animate={{ scale: copied ? 1 : 0, opacity: copied ? 1 : 0 }}
                      className="absolute"
                    >
                      <Check className="size-3.5 text-emerald-400" />
                    </motion.div>
                  </div>
                </button>

                {/* Social link rows */}
                {Object.entries(appConfig.social).map(([key, social]) => (
                  <a
                    key={key}
                    href={social}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex items-center justify-between px-5 py-3.5 border-b border-border/60 last:border-0 hover:bg-card transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center size-8 rounded-lg bg-card/90 text-muted-foreground group-hover/link:text-foreground transition-colors shrink-0">
                        <Icon className="size-4" name={key as IconType} />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground leading-none">
                          {key === "cal.com" ? "Schedule a call" : key.charAt(0).toUpperCase() + key.slice(1)}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                          {"@" + social.split("https://")[1].split("/").pop()}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="size-3.5 text-muted-foreground group-hover/link:text-foreground group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
    </section>
  );
}