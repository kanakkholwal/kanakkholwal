import { Socials } from "@/components/socials";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Globe, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { appConfig } from "root/project.config";
import { generateMetadata } from "~/utils/seo";

export const metadata = generateMetadata({
  title: `Links | ${appConfig.name}`,
  description: `Connect with ${appConfig.name}. Socials, portfolio, and contact info.`,
  path: "/links",
});

function LinkCard({
  href,
  icon: Icon,
  label,
  sublabel,
  variant = "default",
}: {
  href: string;
  icon: any;
  label: string;
  sublabel?: string;
  variant?: "default" | "primary";
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
    >
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
              variant === "primary"
                ? "bg-background/20 text-background"
                : "bg-primary text-white",
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="flex flex-col text-left">
            <span
              className={cn(
                "font-medium leading-none",
                variant === "primary" ? "text-lg" : "text-base",
              )}
            >
              {label}
            </span>
            {sublabel && (
              <span
                className={cn(
                  "text-xs mt-1",
                  variant === "primary"
                    ? "text-background/80"
                    : "text-muted-foreground",
                )}
              >
                {sublabel}
              </span>
            )}
          </div>
        </div>

        <ArrowUpRight
          className={cn(
            "size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1",
            variant === "primary"
              ? "text-background/70"
              : "text-muted-foreground",
          )}
        />
      </div>
    </Link>
  );
}

// --- MAIN PAGE ---
export default function LinksPage() {
  return (
    <main className="min-h-screen w-full relative overflow-hidden flex flex-col items-center py-20 px-4">
      {/* Background Texture */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-background opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)" />

      {/* Ambient Glow */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-40 pointer-events-none" />

      <div className="w-full max-w-md space-y-10">
        {/* --- HEADER PROFILE --- */}
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Avatar with Glow Ring */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary to-purple-500 opacity-50 blur-md group-hover:opacity-75 transition-opacity duration-500" />
            <div className="relative p-1 bg-background rounded-full">
              <Image
                src={appConfig.logo}
                width={110}
                height={110}
                alt={appConfig.name}
                className="rounded-full border border-border"
                priority
              />
            </div>
            {/* Online Status Dot */}
            <div className="absolute bottom-1 right-1 size-5 bg-background rounded-full flex items-center justify-center">
              <div className="size-3 bg-emerald-500 rounded-full border border-background animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-colorful-titanium">{appConfig.name}</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Full Stack Engineer & UI/UX Designer
            </p>
          </div>

          {/* Tags */}
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

        <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground ml-1">
              Connect
            </h2>
            <div className="grid gap-3">
              <LinkCard
                href={appConfig.url}
                icon={Globe}
                label="Portfolio Website"
                sublabel="View my work & case studies"
                variant="primary"
              />
              <LinkCard
                href={`mailto:${appConfig.emails[0]}`}
                icon={Mail}
                label="Email Me"
                sublabel={appConfig.emails[0]}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground ml-1">
              Social Presence
            </h2>
            <Socials />
          </div>
        </div>
      </div>
    </main>
  );
}
