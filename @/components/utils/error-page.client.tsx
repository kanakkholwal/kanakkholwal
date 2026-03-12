"use client";

import { SpotlightReveal } from "@/components/animated/section.reveal";
import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Copy,
    Home,
    RefreshCcw,
    Terminal,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BLUR_FADE_DELAY = 0.04;

interface ErrorPageClientProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPageClient({ error, reset }: ErrorPageClientProps) {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="error-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex min-h-screen w-full items-center justify-center p-6"
        >
          <MinimalError error={error} reset={reset} />
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="error-static"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="flex min-h-screen w-full items-center justify-center p-6"
        >
          <StaticError error={error} reset={reset} />
        </motion.div>
      ) : (
        <motion.div
          key="error-dynamic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="w-full"
        >
          <DynamicError error={error} reset={reset} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   MINIMAL — sparse mono terminal style, max-w-sm centred
───────────────────────────────────────────────────────── */
function MinimalError({ error, reset }: ErrorPageClientProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const text = [
      error.message,
      error.digest ? `digest: ${error.digest}` : null,
      error.stack ? `\n${error.stack}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-sm space-y-10">
      {/* Header */}
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            // runtime error
          </p>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h1>
          {error.message && (
            <p className="text-sm font-mono text-muted-foreground leading-relaxed break-all">
              {error.message}
            </p>
          )}
        </div>
      </BlurFade>

      {/* Digest */}
      {error.digest && (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <button
            onClick={copy}
            className="group flex w-full items-center gap-3 rounded-lg border border-border/50 bg-muted/40 px-3 py-2 transition-colors hover:bg-muted/70 text-left"
          >
            <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
              ID
            </span>
            <code className="flex-1 truncate text-xs font-mono text-foreground">
              {error.digest}
            </code>
            <Copy className="size-3 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
          </button>
        </BlurFade>
      )}

      {/* Actions */}
      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <div className="flex flex-col gap-2">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 w-full rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
          >
            <RefreshCcw className="size-3.5" />
            Try Again
          </button>
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 w-full rounded-lg py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Go Back
          </button>
        </div>
      </BlurFade>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STATIC — centred card, dot-grid bg, icon + prose
───────────────────────────────────────────────────────── */
function StaticError({ error, reset }: ErrorPageClientProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(error.digest ?? error.message ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-lg space-y-8 text-center">
      {/* Dot-grid */}
      <div className="fixed inset-0 -z-10 opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />

      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-red-500/8 blur-[120px] rounded-full -z-10" />

      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
          <AlertCircle className="size-7 text-red-500" />
        </div>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            An unexpected error occurred. You can try reloading, go back, or
            head home.
          </p>
          {error.message && (
            <p className="text-sm font-mono text-muted-foreground/80 mt-2 break-all">
              {error.message}
            </p>
          )}
        </div>
      </BlurFade>

      {error.digest && (
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <button
            onClick={copy}
            className="group inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-4 py-1.5 transition-colors hover:bg-muted/70"
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Error ID
            </span>
            <code className="max-w-[180px] truncate text-xs font-mono text-foreground">
              {error.digest}
            </code>
            <Copy className="size-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
            {copied && (
              <span className="text-[9px] font-mono text-emerald-500">
                copied!
              </span>
            )}
          </button>
        </BlurFade>
      )}

      <BlurFade delay={BLUR_FADE_DELAY * 4}>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={reset}
            className="h-10 px-5 gap-2"
          >
            <RefreshCcw className="size-3.5" />
            Try Again
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="h-10 px-5 gap-2"
          >
            <ArrowLeft className="size-3.5" />
            Go Back
          </Button>
          <Button variant="ghost" size="sm" className="h-10 px-5 gap-2" asChild>
            <Link href="/">
              <Home className="size-3.5" />
              Home
            </Link>
          </Button>
        </div>
      </BlurFade>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DYNAMIC — SpotlightReveal, glitch hero strip, stack trace
   Left: animated error identity | Right: actions + details
───────────────────────────────────────────────────────── */
function DynamicError({ error, reset }: ErrorPageClientProps) {
  const router = useRouter();
  const [showStack, setShowStack] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const text = [
      error.message,
      error.digest ? `digest: ${error.digest}` : null,
      error.stack ? `\n${error.stack}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SpotlightReveal className="min-h-screen w-full overflow-x-hidden">
      {/* Dot-grid */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Red ambient glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-red-500/8 blur-[100px] rounded-full -z-10" />

      {/* Hero strip */}
      <div className="w-full border-b border-border/40 bg-background/60 backdrop-blur-md py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-12">
          {/* Left — identity */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/8 text-xs font-mono text-red-500"
            >
              <span className="relative flex size-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full size-1.5 bg-red-500" />
              </span>
              Runtime Error
              {error.digest && (
                <span className="opacity-50 ml-1">#{error.digest.slice(0, 8)}</span>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl font-black tracking-tighter leading-none"
            >
              Something
              <br />
              <span className="text-red-500">went wrong.</span>
            </motion.h1>

            {error.message && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.5 }}
                className="text-sm font-mono text-muted-foreground leading-relaxed max-w-md break-all"
              >
                {error.message}
              </motion.p>
            )}
          </div>

          {/* Right — big icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
            className="flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center size-28 rounded-3xl border border-red-500/20 bg-red-500/10">
              <AlertTriangle className="size-12 text-red-500" strokeWidth={1.5} />
              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-3xl border border-red-500/20"
                animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12">
        {/* Left — debug info */}
        <div className="space-y-8">
          {/* Stack trace toggle */}
          {error.stack && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <button
                onClick={() => setShowStack((v) => !v)}
                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Terminal className="size-3.5 group-hover:text-primary transition-colors" />
                // stack trace
                <span className="opacity-40 ml-1 group-hover:opacity-70">
                  {showStack ? "▲ hide" : "▼ show"}
                </span>
              </button>

              <AnimatePresence>
                {showStack && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="relative rounded-xl border border-border/60 bg-muted/30 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-muted/50">
                        <div className="flex items-center gap-1.5">
                          <div className="size-2.5 rounded-full bg-red-500/40" />
                          <div className="size-2.5 rounded-full bg-amber-500/40" />
                          <div className="size-2.5 rounded-full bg-emerald-500/40" />
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground/60">
                          stack.trace
                        </span>
                        <button
                          onClick={copy}
                          className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Copy className="size-3" />
                          {copied ? "copied" : "copy"}
                        </button>
                      </div>
                      <pre className="p-4 text-[11px] font-mono text-muted-foreground leading-relaxed overflow-x-auto whitespace-pre-wrap break-all max-h-56 overflow-y-auto">
                        {error.stack}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Digest */}
          {error.digest && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="space-y-2"
            >
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                // error id
              </p>
              <button
                onClick={copy}
                className="group flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 px-4 py-3 hover:bg-muted/60 transition-colors w-full text-left"
              >
                <Zap className="size-4 text-amber-500 shrink-0" />
                <code className="flex-1 truncate text-xs font-mono text-foreground">
                  {error.digest}
                </code>
                <Copy className="size-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
                {copied && (
                  <span className="text-[9px] font-mono text-emerald-500 shrink-0">
                    copied!
                  </span>
                )}
              </button>
            </motion.div>
          )}
        </div>

        {/* Right — actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            // what to do
          </p>

          <div className="space-y-2.5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={reset}
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-foreground text-background px-4 py-3.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <RefreshCcw className="size-4 shrink-0" />
              <span className="flex-1 text-left">Try Again</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3.5 text-sm font-medium hover:bg-card transition-colors"
            >
              <ArrowLeft className="size-4 shrink-0" />
              <span className="flex-1 text-left">Go Back</span>
            </motion.button>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/"
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3.5 text-sm font-medium hover:bg-card transition-colors"
              >
                <Home className="size-4 shrink-0" />
                <span className="flex-1">Go Home</span>
              </Link>
            </motion.div>
          </div>

          <p className="text-xs text-muted-foreground/60 leading-relaxed pt-2">
            If this keeps happening, copy the error ID above and report the
            issue.
          </p>
        </motion.div>
      </div>
    </SpotlightReveal>
  );
}
