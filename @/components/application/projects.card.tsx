"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ButtonLink, ButtonTransitionLink, TransitionLink } from "@/components/utils/link";
import { ProjectType } from "@/lib/project.source";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  ExternalLink,
  Layers,
  Play,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import Markdown from "react-markdown";

import { Icon, IconType } from "../icons";
import { ProjectFallback } from "./projects.card.fallback";

/* 
   STATUS badge colours
─ */
const STATUS_STYLES: Record<string, string> = {
  "In Progress": "bg-amber-500/10 border-amber-500/30 text-amber-500",
  Active: "bg-emerald-500/10 border-emerald-500/30 text-emerald-500",
  Shipped: "bg-blue-500/10 border-blue-500/30 text-blue-500",
  Completed: "bg-blue-500/10 border-blue-500/30 text-blue-500",
  Archived: "bg-zinc-500/10 border-zinc-500/30 text-zinc-400",
};

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const cls =
    STATUS_STYLES[status] ?? "bg-muted border-border text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-widest border",
        cls,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
      </span>
      {status}
    </span>
  );
}

/* 
   EXPANDABLE CARDS (Dynamic variant with Drawer)
    responsive bento grid + side drawer
 */
export function ExpandableProjectCards({
  cards,
}: {
  cards: Omit<ProjectType, "body">[];
}) {
  const [active, setActive] = useState<Omit<ProjectType, "body"> | null>(null);

  return (
    <div className="relative" id="project-list">
      {/* Responsive Drawer — works on mobile & desktop */}
      <Drawer open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DrawerContent className="max-h-[88vh] max-w-2xl mx-auto flex flex-col">
          {active && (
            <>
              {/* Drawer Header — close button + title */}
              <DrawerHeader className="relative shrink-0 border-b border-border/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <StatusBadge status={active.status} />
                    <DrawerTitle className="text-2xl md:text-3xl">
                      {active.title}
                    </DrawerTitle>
                    <DrawerDescription className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="size-3" />
                      {active.dates}
                    </DrawerDescription>
                  </div>
                  <DrawerClose className="shrink-0 opacity-70 hover:opacity-100 transition-opacity" />
                </div>
              </DrawerHeader>
              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="p-5 space-y-6">
                  {/* description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <Markdown>{active.description}</Markdown>
                  </p>
                  {/* metrics */}
                  {active.metrics && active.metrics.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
                        // Impact
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {active.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-muted/30 text-center"
                          >
                            <span className="text-xl font-bold font-mono tracking-tight text-foreground">
                              {m.value.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                              {m.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                  {active.technologies && active.technologies.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
                        <Tag className="size-3" /> Stack
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {active.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted border border-border text-xs font-medium text-foreground/80"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {active.tags && active.tags.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
                        <Layers className="size-3" /> Categories
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {active.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-xs text-primary/80 font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>




              {/* Footer actions */}
              <div className="p-4 border-t border-border bg-card/80 backdrop-blur-sm flex flex-wrap items-center gap-2 shrink-0">
                {active.href && (
                  <ButtonLink
                    href={active.href}
                    target="_blank"
                    variant="dark"
                    className="flex-1 min-w-[140px] h-10 text-sm font-medium rounded-lg"
                  >
                    <ExternalLink className="size-4" />
                    Visit Live Site
                  </ButtonLink>
                )}
                <ButtonTransitionLink
                  href={`/projects/${active.id}`}
                  variant="default_soft"
                  className="h-10 px-4 text-sm font-medium rounded-lg"
                >
                  <Icon name="arrow-right" className="size-4!" />
                  Full Project
                </ButtonTransitionLink>
                {active.links?.map((link, i) => (
                  <ButtonLink
                    key={i}
                    href={link.url}
                    target="_blank"
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-lg border shrink-0"
                  >
                    <Icon name={(link.icon as IconType) || "external-link"} />
                  </ButtonLink>
                ))}
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>


      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-app mx-auto">
        {cards?.map((card) => (
          <ExpandableCard
            key={card.id}
            card={card}
            onClick={() => setActive(card)}
            isActive={active?.id === card.id}
          />
        ))}
      </div>
    </div>
  );
}

function ExpandableCard({
  card,
  onClick,
  isActive,
}: {
  card: Omit<ProjectType, "body">;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={isActive ? {} : { y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 360, damping: 30 }}
      className={cn(
        "group relative flex flex-col text-left w-full overflow-hidden",
        "bg-card border border-border",
        "transition-shadow duration-300 hover:shadow-2xl dark:hover:shadow-black/60",
        isActive && "opacity-40 pointer-events-none",
      )}
      style={{ borderRadius: 24 }}
    >
      {/* Media */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
        {card.image ? (
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <ProjectFallback title={card.title} />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Status - top left */}
        <div className="absolute top-3 left-3 z-10">
          <StatusBadge status={card.status} />
        </div>

        {/* Expand hint - top right */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80">
            <ArrowUpRight className="size-3" />
            Details
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="text-base font-bold text-white leading-snug">
            {card.title}
          </h3>
          <p className="text-[10px] font-mono text-white/50 mt-1 flex items-center gap-1">
            <Calendar className="size-3 shrink-0" />
            {card.dates}
          </p>
        </div>
      </div>

      {/* Info strip */}
      <div className="px-4 py-3.5 flex items-center justify-between gap-3 bg-card border-t border-border/60">
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-1">
            {card.technologies?.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] bg-muted text-[10px] text-muted-foreground border border-border/60"
              >
                {tech}
              </span>
            ))}
            {card.technologies && card.technologies.length > 3 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{card.technologies.length - 3}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center size-8 rounded-full border border-border bg-muted/40 text-muted-foreground group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 shrink-0">
          <ArrowUpRight className="size-3.5" />
        </div>
      </div>
    </motion.button>
  );
}

/* 
   SIMPLE CARDS  (Static variant)
 */
export function SimpleProjectCards({
  cards,
  className,
}: {
  cards: Omit<ProjectType, "body">[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 @xs:grid-cols-2 @3xl:grid-cols-3 gap-6 w-full mx-auto",
        className,
      )}
      id="project-list"
    >
      {cards?.map((card, index) => (
        <ProjectCard key={card.id} card={card} index={index} />
      ))}
    </div>
  );
}

function ProjectCard({
  card,
  index,
}: {
  card: Omit<ProjectType, "body">;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => { });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <TransitionLink href={`/projects/${card.id}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "group relative h-full flex flex-col overflow-hidden rounded-3xl",
          "bg-zinc-50 dark:bg-zinc-900/40",
          "border border-zinc-200 dark:border-white/10",
          "p-2 transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50",
        )}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800 border border-black/5 dark:border-white/5">
          {card.video ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-10 bg-black"
            >
              <video
                ref={videoRef}
                src={card.video}
                loop
                muted
                playsInline
                className="h-full w-full object-cover opacity-90"
              />
            </motion.div>
          ) : card.image ? (
            <Image
              src={card.image}
              alt={card.title}
              fill
              className={cn(
                "object-cover transition-transform duration-700 ease-out",
                isHovered ? "scale-105" : "scale-100",
              )}
            />
          ) : (
            <ProjectFallback title={card.title} />
          )}

          <div className="absolute top-3 left-3 z-20">
            <StatusBadge status={card.status} />
          </div>

          {card.video && !isHovered && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 px-2 pt-5 pb-2">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1">
                <span>{card.dates}</span>
                {card.tags?.[0] && (
                  <>
                    <span></span>
                    <span>{card.tags[0]}</span>
                  </>
                )}
              </div>
            </div>

            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-400 group-hover:bg-zinc-900 group-hover:dark:bg-white group-hover:text-white group-hover:dark:text-black transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-6">
            {card.description}
          </p>

          <div className="mt-auto pt-4 border-t border-dashed border-zinc-200 dark:border-white/10">
            <div className="flex flex-wrap gap-2">
              {card.tags?.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/50 text-[10px] font-medium text-zinc-500 dark:text-zinc-400 border border-transparent group-hover:border-zinc-200 group-hover:dark:border-white/10 transition-colors"
                >
                  {tag}
                </span>
              ))}
              {card.tags && card.tags.length > 3 && (
                <span className="text-[10px] py-1 text-zinc-400 self-center">
                  +{card.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </TransitionLink>
  );
}