"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

interface CreditEntry {
  person: string;
  attribute: string;
}

interface AttributionPageClientProps {
  journey: string[];
  credits: CreditEntry[];
  displayName: string;
  email: string;
}

export default function AttributionPageClient({
  journey,
  credits,
  displayName,
  email,
}: AttributionPageClientProps) {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="attribution-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MinimalAttribution
            journey={journey}
            credits={credits}
            displayName={displayName}
            email={email}
          />
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="attribution-static"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StaticAttribution
            journey={journey}
            credits={credits}
            displayName={displayName}
            email={email}
          />
        </motion.div>
      ) : (
        <motion.div
          key="attribution-dynamic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <DynamicAttribution
            journey={journey}
            credits={credits}
            displayName={displayName}
            email={email}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function MinimalAttribution({ journey, credits, displayName, email }: AttributionPageClientProps) {
  return (
    <main className="min-h-screen py-24 px-6 max-w-3xl mx-auto space-y-16">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <header className="space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            // credits
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Standing on the shoulders of Giants.
          </h1>
        </header>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <section className="space-y-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            // story
          </p>
          <div className="space-y-4">
            {journey.map((para, i) => (
              <p key={i} className="text-base text-muted-foreground leading-relaxed">
                {para}
              </p>
            ))}
          </div>
          <p className="text-sm font-semibold text-foreground mt-4">
            — {displayName}
          </p>
        </section>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <section className="space-y-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            // acknowledgements
          </p>
          <ol className="divide-y divide-border/60">
            {credits.map(({ person, attribute }, i) => (
              <li
                key={i}
                className="flex items-center gap-4 py-4 text-sm"
              >
                <span className="text-[10px] font-mono text-muted-foreground/40 w-5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center justify-center size-8 rounded-full bg-secondary text-foreground font-bold text-xs shrink-0">
                  {person[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{person}</p>
                  <p className="text-xs text-muted-foreground truncate">{attribute}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </BlurFade>
    </main>
  );
}


function StaticAttribution({ journey, credits, displayName, email }: AttributionPageClientProps) {
  return (
    <main className="min-h-screen py-24 px-6 max-w-7xl mx-auto mt-20">
      {/* Header */}
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="space-y-4 mb-16">
          <Badge variant="secondary" className="rounded-full gap-1.5 text-xs">
            <Heart className="size-3 text-rose-500 fill-rose-500" />
            Attributions
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
            Standing on the shoulders
            <br />
            <span className="text-colorful-titanium">of Giants.</span>
          </h1>
        </div>
      </BlurFade>

      {/* 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16">
        {/* Left — journey + signature */}
        <div className="space-y-8">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="space-y-5 text-base text-muted-foreground leading-relaxed">
              {journey.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-px w-12 bg-border" />
              <p className="text-sm font-semibold text-foreground">{displayName}</p>
            </div>
          </BlurFade>
        </div>

        {/* Right — credits + CTA */}
        <div className="space-y-10">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-foreground">
                Acknowledgements
              </h2>
              <div className="divide-y divide-border/60">
                {credits.map(({ person, attribute }, i) => (
                  <CreditRow key={i} person={person} attribute={attribute} />
                ))}
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 space-y-4">
              <Sparkles className="size-5 text-primary" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Want to collaborate or work together? I&apos;d love to hear from you.
              </p>
              <Button asChild size="sm" className="gap-1.5">
                <Link href={`mailto:${email}`}>
                  Say Hello
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </BlurFade>
        </div>
      </div>
    </main>
  );
}


function DynamicAttribution({ journey, credits, displayName, email }: AttributionPageClientProps) {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      {/* Dot-grid */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Hero strip */}
      <div className="w-full border-b border-border/40 py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-secondary/40 text-xs font-mono text-muted-foreground"
          >
            <Heart className="size-3 text-rose-500 fill-rose-500" />
            Attributions
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-black tracking-tighter leading-none"
          >
            Standing on the
            <br />
            <span className="text-colorful-titanium">shoulders of Giants.</span>
          </motion.h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16">
        {/* Left — journey */}
        <div className="space-y-10">
          {journey.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-base text-muted-foreground leading-relaxed"
            >
              {para}
            </motion.p>
          ))}

          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="h-px w-12 bg-border" />
            <p className="text-sm font-semibold text-foreground">{displayName}</p>
          </motion.div>
        </div>

        {/* Right — credits + CTA */}
        <div className="space-y-10">
          <div className="space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              // acknowledgements
            </p>
            <div className="divide-y divide-border/40">
              {credits.map(({ person, attribute }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <CreditRow person={person} attribute={attribute} />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 space-y-4"
          >
            <Sparkles className="size-5 text-primary" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Want to collaborate or work together? I&apos;d love to hear from you.
            </p>
            <Button asChild size="sm" className="gap-1.5">
              <Link href={`mailto:${email}`}>
                Say Hello
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

/* ─── Shared credit row ───────────────────────────────── */
function CreditRow({ person, attribute }: CreditEntry) {
  const initials = person
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-start gap-3 py-4">
      <div className="flex items-center justify-center size-9 rounded-full bg-secondary text-foreground font-bold text-xs shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{person}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{attribute}</p>
      </div>
    </div>
  );
}
