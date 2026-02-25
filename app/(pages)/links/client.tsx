"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { Socials } from "@/components/socials";
import { Badge } from "@/components/ui/badge";
import { StyleModels, StylingModel } from "@/constants/ui";
import useStorage from "@/hooks/use-storage";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Globe, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

interface LinksPageClientProps {
  displayName: string;
  avatar: string;
  email: string;
  url: string;
}

export default function LinksPageClient({
  displayName,
  avatar,
  email,
  url,
}: LinksPageClientProps) {
  const [selectedStyle] = useStorage<StylingModel>(
    "styling.model",
    StyleModels[0].id,
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedStyle === "minimal" ? (
        <motion.div
          key="links-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MinimalLinks
            displayName={displayName}
            avatar={avatar}
            email={email}
            url={url}
          />
        </motion.div>
      ) : selectedStyle === "static" ? (
        <motion.div
          key="links-static"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StaticLinks
            displayName={displayName}
            avatar={avatar}
            email={email}
            url={url}
          />
        </motion.div>
      ) : (
        <motion.div
          key="links-dynamic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <DynamicLinks
            displayName={displayName}
            avatar={avatar}
            email={email}
            url={url}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function MinimalLinks({ displayName, avatar, email, url }: LinksPageClientProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
      <div className="w-full max-w-sm space-y-12">
        {/* Header */}
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="flex flex-col items-center gap-4 text-center">
            <Image
              src={avatar}
              width={64}
              height={64}
              alt={displayName}
              className="rounded-full border border-border"
              priority
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {displayName}
              </h1>
              <p className="text-xs font-mono text-muted-foreground mt-1">
                Full Stack Engineer &amp; UI/UX Designer
              </p>
            </div>
          </div>
        </BlurFade>

        {/* Links */}
        <div className="space-y-10">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <section className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                // connect
              </p>
              <ol className="divide-y divide-border/60">
                {[
                  { href: url, icon: Globe, label: "Portfolio Website", sub: url.replace("https://", "") },
                  { href: `mailto:${email}`, icon: Mail, label: "Email Me", sub: email },
                ].map(({ href, icon: Icon, label, sub }, i) => (
                  <li key={href}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 py-4 hover:text-primary transition-colors"
                    >
                      <span className="text-[10px] font-mono text-muted-foreground/40 w-5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {label}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground truncate">
                          {sub}
                        </p>
                      </div>
                      <ArrowUpRight className="size-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0" />
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <section className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                // socials
              </p>
              <Socials />
            </section>
          </BlurFade>
        </div>
      </div>
    </main>
  );
}


function StaticLinks({ displayName, avatar, email, url }: LinksPageClientProps) {
  return (
    <main className="min-h-screen w-full relative overflow-hidden flex flex-col items-center py-20 px-4">
      {/* Background */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-background opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-40 pointer-events-none" />

      <div className="w-full max-w-md space-y-10">
        {/* Profile */}
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary to-purple-500 opacity-50 blur-md group-hover:opacity-75 transition-opacity duration-500" />
              <div className="relative p-1 bg-background rounded-full">
                <Image
                  src={avatar}
                  width={110}
                  height={110}
                  alt={displayName}
                  className="rounded-full border border-border"
                  priority
                />
              </div>
              <div className="absolute bottom-1 right-1 size-5 bg-background rounded-full flex items-center justify-center">
                <div className="size-3 bg-emerald-500 rounded-full border border-background animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="text-colorful-titanium">{displayName}</span>
              </h1>
              <p className="text-muted-foreground font-medium">
                Full Stack Engineer &amp; UI/UX Designer
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {["Developer", "Freelancer", "Builder"].map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1 bg-secondary/50 border border-border/50 text-muted-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* Links */}
        <div className="space-y-8">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground ml-1">
                Connect
              </h2>
              <div className="grid gap-3">
                <StaticLinkCard
                  href={url}
                  icon={Globe}
                  label="Portfolio Website"
                  sublabel="View my work & case studies"
                  variant="primary"
                />
                <StaticLinkCard
                  href={`mailto:${email}`}
                  icon={Mail}
                  label="Email Me"
                  sublabel={email}
                />
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground ml-1">
                Social Presence
              </h2>
              <Socials />
            </div>
          </BlurFade>
        </div>
      </div>
    </main>
  );
}


function DynamicLinks({ displayName, avatar, email, url }: LinksPageClientProps) {
  return (
    <main className="min-h-screen w-full overflow-x-hidden flex flex-col items-center py-20 px-4">
      {/* Dot-grid */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Ambient glow */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-40 pointer-events-none" />

      <div className="w-full max-w-md space-y-12">
        {/* Avatar + name */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center gap-6"
        >
          <div className="relative">
            {/* Pulsing ring */}
            <motion.div
              className="absolute -inset-3 rounded-full border border-primary/30"
              animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -inset-6 rounded-full border border-primary/15"
              animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.05, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <div className="relative p-1 bg-background rounded-full border border-border/50">
              <Image
                src={avatar}
                width={96}
                height={96}
                alt={displayName}
                className="rounded-full"
                priority
              />
            </div>
            <div className="absolute bottom-1 right-1 size-5 bg-background rounded-full flex items-center justify-center">
              <div className="size-3 bg-emerald-500 rounded-full border border-background animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">
              {displayName}
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              Full Stack Engineer &amp; UI/UX Designer
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {["Developer", "Freelancer", "Builder"].map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Connect links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Connect
          </p>
          <div className="grid gap-3">
            {[
              { href: url, icon: Globe, label: "Portfolio Website", sub: "View my work & case studies", primary: true },
              { href: `mailto:${email}`, icon: Mail, label: "Email Me", sub: email, primary: false },
            ].map(({ href, icon: Icon, label, sub, primary }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
                  <div
                    className={cn(
                      "group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                      primary
                        ? "bg-foreground text-background border-foreground hover:opacity-90 shadow-xl"
                        : "bg-card/50 hover:bg-card border-border hover:border-foreground/20 backdrop-blur-sm",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex items-center justify-center size-10 rounded-full",
                          primary ? "bg-background/20 text-background" : "bg-primary text-white",
                        )}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className={cn("font-medium leading-none", primary ? "text-lg" : "text-base")}>
                          {label}
                        </span>
                        <span className={cn("text-xs mt-1", primary ? "text-background/80" : "text-muted-foreground")}>
                          {sub}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight
                      className={cn(
                        "size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1",
                        primary ? "text-background/70" : "text-muted-foreground",
                      )}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Social Presence
          </p>
          <Socials />
        </motion.div>
      </div>
    </main>
  );
}

/* ─── Static variant LinkCard ─────────────────────────── */
function StaticLinkCard({
  href,
  icon: Icon,
  label,
  sublabel,
  variant = "default",
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  variant?: "default" | "primary";
}) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
      <div
        className={cn(
          "group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-[1.02] active:scale-[0.98]",
          variant === "primary"
            ? "bg-foreground text-background border-foreground hover:opacity-90 shadow-xl"
            : "bg-card/50 hover:bg-card border-border hover:border-foreground/20 backdrop-blur-sm",
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center justify-center size-10 rounded-full",
              variant === "primary" ? "bg-background/20 text-background" : "bg-primary text-white",
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className={cn("font-medium leading-none", variant === "primary" ? "text-lg" : "text-base")}>
              {label}
            </span>
            {sublabel && (
              <span className={cn("text-xs mt-1", variant === "primary" ? "text-background/80" : "text-muted-foreground")}>
                {sublabel}
              </span>
            )}
          </div>
        </div>
        <ArrowUpRight
          className={cn(
            "size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1",
            variant === "primary" ? "text-background/70" : "text-muted-foreground",
          )}
        />
      </div>
    </Link>
  );
}
