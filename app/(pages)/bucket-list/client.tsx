"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Trophy } from "lucide-react";
import Image from "next/image";
import { appConfig } from "root/project.config";

const BLUR_FADE_DELAY = 0.04;

type BucketItem = (typeof appConfig.bucketList)[number];

interface BucketListClientProps {
  items: BucketItem[];
  total: number;
  completed: number;
  percentage: number;
}

export default function BucketListClient({
  items,
  total,
  completed,
  percentage,
}: BucketListClientProps) {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="bucket-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MinimalBucketList
            items={items}
            total={total}
            completed={completed}
            percentage={percentage}
          />
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="bucket-static"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StaticBucketList
            items={items}
            total={total}
            completed={completed}
            percentage={percentage}
          />
        </motion.div>
      ) : (
        <motion.div
          key="bucket-dynamic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <DynamicBucketList
            items={items}
            total={total}
            completed={completed}
            percentage={percentage}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function MinimalBucketList({ items, total, completed, percentage }: BucketListClientProps) {
  const done = items.filter((i) => i.completed);
  const pending = items.filter((i) => !i.completed);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* Header */}
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="mb-14 space-y-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              // life roadmap v1.0
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Bucket List
            </h1>
            <p className="text-sm font-mono text-muted-foreground">
              {completed} of {total} completed &mdash; {percentage}%
            </p>
            {/* Progress */}
            <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </BlurFade>

        {/* Completed */}
        {done.length > 0 && (
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <section className="mb-10">
              <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 mb-4">
                ✓ Completed
              </p>
              <ol className="divide-y divide-border/60">
                {done.map((item, i) => (
                  <li
                    key={item.name}
                    className="flex items-start gap-4 py-4"
                  >
                    <span className="text-xs font-mono text-muted-foreground/40 w-5 shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-snug">
                        {item.name}
                      </p>
                      {item.description && (
                        <p className="text-xs font-mono text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </BlurFade>
        )}

        {/* Pending */}
        {pending.length > 0 && (
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <section>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 mb-4">
                ○ Pending
              </p>
              <ol className="divide-y divide-border/60">
                {pending.map((item, i) => (
                  <li
                    key={item.name}
                    className="flex items-start gap-4 py-4 opacity-60"
                  >
                    <span className="text-xs font-mono text-muted-foreground/40 w-5 shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <CircleDashed className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-muted-foreground leading-snug">
                        {item.name}
                      </p>
                      {item.description && (
                        <p className="text-xs font-mono text-muted-foreground/60 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </BlurFade>
        )}
      </div>
    </main>
  );
}


function StaticBucketList({ items, total, completed, percentage }: BucketListClientProps) {
  return (
    <main className="min-h-screen w-full relative">
      <div className="fixed inset-0 -z-50 h-full w-full opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />

      <div className="mx-auto max-w-5xl px-6 md:px-12 py-24">
        {/* Header */}
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="flex flex-col items-center text-center space-y-8 mb-20">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-border/50 text-xs font-mono text-muted-foreground uppercase tracking-widest backdrop-blur-md">
              Life Roadmap v1.0
            </span>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[1.1]">
              Collecting
              <br />
              <span className="font-instrument-serif italic font-normal text-muted-foreground mr-3">
                Moments
              </span>
              <span className="text-colorful-titanium">Not Things.</span>
            </h1>

            <div className="w-full max-w-md space-y-3">
              <div className="flex justify-between text-xs font-mono text-muted-foreground uppercase tracking-wider">
                <span>Progress</span>
                <span>{percentage}% Complete</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center pt-2">
                {completed} adventures unlocked / {total - completed} pending
              </p>
            </div>
          </div>
        </BlurFade>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {items.map((item, index) => (
            <BlurFade key={item.name} delay={BLUR_FADE_DELAY * (index + 3)}>
              <BucketCard item={item} />
            </BlurFade>
          ))}
        </div>
      </div>
    </main>
  );
}


function DynamicBucketList({ items, total, completed, percentage }: BucketListClientProps) {
  const done = items.filter((i) => i.completed);
  const pending = items.filter((i) => !i.completed);

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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full border-b border-border/40"
      >
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-end">
            <div className="space-y-5">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Life Roadmap v1.0
              </p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-none">
                Collecting{" "}
                <span className="font-instrument-serif italic font-normal text-muted-foreground">
                  Moments
                </span>
                <br />
                <span className="text-colorful-titanium">Not Things.</span>
              </h1>

              {/* Animated progress */}
              <div className="max-w-sm space-y-2 pt-2">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  <span>Progress</span>
                  <span>{percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                  />
                </div>
              </div>
            </div>

            {/* Stats cluster */}
            <div className="flex gap-6 md:flex-col md:gap-3 md:text-right shrink-0">
              <div>
                <span className="text-4xl md:text-5xl font-bold font-mono text-foreground/10 leading-none select-none block">
                  {String(completed).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500">
                  Completed
                </span>
              </div>
              <div>
                <span className="text-4xl md:text-5xl font-bold font-mono text-foreground/10 leading-none select-none block">
                  {String(total - completed).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20 space-y-20">
        {/* Completed section */}
        {done.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/40">
              <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-foreground">Completed</h2>
                <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-500">
                  {done.length} adventures unlocked
                </p>
              </div>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
              {done.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="break-inside-avoid"
                >
                  <BucketCard item={item} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Pending section */}
        {pending.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/40">
              <CircleDashed className="size-5 text-muted-foreground shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  On the list
                </h2>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {pending.length} experiences to unlock
                </p>
              </div>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
              {pending.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="break-inside-avoid"
                >
                  <BucketCard item={item} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}

/* ─── Shared BucketCard (used by Static + Dynamic) ──────── */
function BucketCard({ item }: { item: BucketItem }) {
  return (
    <div
      className={cn(
        "group relative rounded-3xl border p-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl",
        item.completed
          ? "bg-card border-border shadow-sm"
          : "bg-background/50 border-dashed border-border/60 opacity-80 hover:opacity-100",
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
        {item.images && item.images.length > 0 ? (
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              item.completed
                ? "group-hover:scale-105"
                : "grayscale group-hover:grayscale-0 group-hover:scale-105 opacity-70",
            )}
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
            <Trophy className="size-12 text-muted-foreground/20" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={item.completed ? "default" : "secondary"}
            className={cn(
              "backdrop-blur-md shadow-sm border font-mono text-[10px] uppercase tracking-wider px-2 py-1",
              item.completed
                ? "bg-emerald-500/90 hover:bg-emerald-500 text-white border-transparent"
                : "bg-black/50 text-white border-white/20",
            )}
          >
            {item.completed ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3" /> Completed
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <CircleDashed className="size-3" /> Planned
              </span>
            )}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="pt-4 px-2 pb-2 space-y-2">
        <h3
          className={cn(
            "text-xl font-bold tracking-tight leading-tight",
            item.completed
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground transition-colors",
          )}
        >
          {item.name}
        </h3>

        {item.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        )}

        <div className="pt-2 flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {item.images.slice(1, 4).map((img, idx) => (
              <div
                key={idx}
                className="relative size-6 rounded-full ring-2 ring-background overflow-hidden"
              >
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
          {item.completed && (
            <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              <CheckCircle2 className="size-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
