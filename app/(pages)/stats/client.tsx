"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const BLUR_FADE_DELAY = 0.04;

interface StatsPageClientProps {
  /** The big header block */
  header: React.ReactNode;
  /** GitHub star history + activity */
  repoSection: React.ReactNode;
  /** NPM downloads + version adoption */
  registrySection: React.ReactNode;
  /** Project health / insight cards */
  healthSection: React.ReactNode;
}

export default function StatsPageClient({
  header,
  repoSection,
  registrySection,
  healthSection,
}: StatsPageClientProps) {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="stats-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MinimalStats
            header={header}
            repoSection={repoSection}
            registrySection={registrySection}
            healthSection={healthSection}
          />
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="stats-static"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StaticStats
            header={header}
            repoSection={repoSection}
            registrySection={registrySection}
            healthSection={healthSection}
          />
        </motion.div>
      ) : (
        <motion.div
          key="stats-dynamic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <DynamicStats
            header={header}
            repoSection={repoSection}
            registrySection={registrySection}
            healthSection={healthSection}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function MinimalStats(props: StatsPageClientProps) {
  const sections = [
    { label: "// repository", node: props.repoSection },
    { label: "// registry",   node: props.registrySection },
    { label: "// health",     node: props.healthSection },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24 space-y-16">
      <BlurFade delay={BLUR_FADE_DELAY}>{props.header}</BlurFade>

      {sections.map((s, i) => (
        <BlurFade key={s.label} delay={BLUR_FADE_DELAY * (i + 2)}>
          <section>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4 pb-2 border-b border-dashed border-border">
              {s.label}
            </p>
            {s.node}
          </section>
        </BlurFade>
      ))}
    </div>
  );
}


function StaticStats(props: StatsPageClientProps) {
  return (
    <div className="mx-auto max-w-app px-4 py-12 md:py-20 md:pt-40 @container">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="mb-12 border-b border-border pb-8">{props.header}</div>
      </BlurFade>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main column */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <section>
              <SectionLabel>Repository Intelligence</SectionLabel>
              {props.repoSection}
            </section>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <section>
              <SectionLabel>Registry Performance</SectionLabel>
              {props.registrySection}
            </section>
          </BlurFade>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className="sticky top-20">
              <SectionLabel>Project Health</SectionLabel>
              {props.healthSection}
            </div>
          </BlurFade>
        </aside>
      </div>
    </div>
  );
}


function DynamicStats(props: StatsPageClientProps) {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      {/* Dot-grid texture */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Header — full-width hero strip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full border-b border-border/40 bg-background/60 backdrop-blur-md"
      >
        <div className="mx-auto max-w-app px-6 py-12 md:py-20">
          {props.header}
        </div>
      </motion.div>

      <div className="mx-auto max-w-app px-6 py-16 space-y-24">
        {/* Repo section — wide card */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <DynamicSectionHeader
            index="01"
            title="Repository Intelligence"
            subtitle="Star History & Community Growth"
          />
          <div className="mt-8">{props.repoSection}</div>
        </motion.section>

        {/* Registry section — wide card */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <DynamicSectionHeader
            index="02"
            title="Registry Performance"
            subtitle="Downloads & Adoption Rates"
          />
          <div className="mt-8">{props.registrySection}</div>
        </motion.section>

        {/* Health section — bento grid */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <DynamicSectionHeader
            index="03"
            title="Project Health"
            subtitle="Live Analysis"
          />
          <div className="mt-8">{props.healthSection}</div>
        </motion.section>
      </div>
    </main>
  );
}

/* ─── Shared sub-components ──────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2">
      <span className="h-px w-4 bg-border inline-block" />
      {children}
    </p>
  );
}

function DynamicSectionHeader({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-end gap-5 pb-5 border-b border-border/40">
      <span className="text-4xl font-bold font-mono text-muted-foreground/20 leading-none select-none">
        {index}
      </span>
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-none">
          {title}
        </h2>
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
