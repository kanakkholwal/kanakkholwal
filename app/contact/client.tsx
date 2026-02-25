"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { Socials } from "@/components/socials";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import Cal, { getCalApi } from "@calcom/embed-react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Calendar, Mail, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect } from "react";

const BLUR_FADE_DELAY = 0.04;

interface ContactPageClientProps {
  displayName: string;
  email: string;
}

export default function ContactPageClient({
  displayName,
  email,
}: ContactPageClientProps) {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="contact-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MinimalContact displayName={displayName} email={email} />
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="contact-static"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StaticContact displayName={displayName} email={email} />
        </motion.div>
      ) : (
        <motion.div
          key="contact-dynamic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <DynamicContact displayName={displayName} email={email} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function MinimalContact({ displayName, email }: ContactPageClientProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-start pt-28 pb-20 px-4">
      <div className="w-full max-w-2xl space-y-12">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <header className="space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              // contact
            </p>
            <h1 className="text-2xl font-bold tracking-tight">Get in touch</h1>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 text-base font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="size-4 shrink-0" />
              {email}
            </a>
            <div className="pt-1">
              <Socials className="items-center gap-x-1" />
            </div>
          </header>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              // book a call
            </p>
            <BookACallForm />
          </div>
        </BlurFade>
      </div>
    </section>
  );
}


function StaticContact({ displayName, email }: ContactPageClientProps) {
  return (
    <section className="relative px-4 pt-10">
      <div className="mt-24 mb-6 flex w-full flex-col items-center text-balance">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <h2 className="text-shadow-glow relative z-2 text-5xl font-medium tracking-tight text-balance sm:text-5xl md:mb-36 md:text-6xl text-center !mb-0">
            <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
              Contact
            </p>
            <span className="font-instrument-serif">
              <span>Get in touch</span>{" "}
              <span className="text-colorful animate-gradient font-instrument-serif pe-2 tracking-tight italic" />
            </span>
          </h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 py-2 font-light outline-hidden transition-all duration-300 cursor-pointer hover:text-black/60 dark:hover:text-white/90 text-xl text-black/85 dark:text-white/85 md:text-2xl"
          >
            {email}
          </a>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <Socials className="items-center gap-x-1" />
        </BlurFade>
      </div>
      <BookACallForm />
    </section>
  );
}


function DynamicContact({ displayName, email }: ContactPageClientProps) {
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
      <div className="w-full border-b border-border/40 pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4"
          >
            Contact
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6"
          >
            Get in touch
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-6"
          >
            <Link
              href={`mailto:${email}`}
              className="group inline-flex items-center gap-2 text-lg font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="size-4 shrink-0 text-primary" />
              {email}
              <ArrowUpRight className="size-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </Link>
            <Socials className="items-center gap-x-1" />
          </motion.div>
        </div>
      </div>

      {/* Cal embed section */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3"
        >
          <Calendar className="size-4 text-primary shrink-0" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Book a call
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <BookACallForm />
        </motion.div>

        {/* Fallback CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 pt-4 border-t border-border/40"
        >
          <MessageSquare className="size-4 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            Prefer email?{" "}
            <Link
              href={`mailto:${email}`}
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              Send a message directly
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

/* ─── Shared Cal embed ────────────────────────────────── */
export function BookACallForm() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "book-a-call" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
  return (
    <Cal
      namespace="book-a-call"
      calLink="kanakkholwal/book-a-call"
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{
        theme: resolvedTheme === "dark" ? "dark" : "light",
        layout: "month_view",
      }}
    />
  );
}
