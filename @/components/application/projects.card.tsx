"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ButtonLink, TransitionLink } from "@/components/utils/link";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { ProjectType } from "@/lib/project.source";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Layers, Play, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import Markdown from "react-markdown";

import { ProjectFallback } from "./projects.card.fallback";

import { MousePointerClick } from "lucide-react";
import { Icon, IconType } from "../icons";

export function ExpandableProjectCards({ cards }: { cards: Omit<ProjectType, "body">[] }) {
  const [active, setActive] = useState<Omit<ProjectType, "body"> | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    if (active) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () =>
    setActive(null),
  );

  return (
    <div className="w-full min-h-screen relative" id="project-list">
      <AnimatePresence mode="wait">
        {active ? (
          <div className="absolute inset-0 z-[100] flex  items-center justify-center p-4 sm:p-10 pointer-events-none">
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className={cn(
                "w-full h-fit max-h-[80dvh] max-w-xl flex flex-col bg-card rounded-3xl overflow-hidden shadow-2xl border border-border pointer-events-auto",
              )}
            >
              <motion.div
                layoutId={`media-${active.id}-${id}`}
                className="relative w-full h-60 aspect-video shrink-0 bg-card border-b md:border-b-0 md:border-r border-border"
              >
                <button
                  className="absolute top-4 left-4 z-20 p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-black/70 transition-colors"
                  onClick={() => setActive(null)}
                >
                  <X className="size-4" />
                </button>

                <div className="relative h-full w-full overflow-hidden">
                  {active.video ? (
                    <video
                      src={active.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : active.image ? (
                    <Image
                      src={active.image}
                      alt={active.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ProjectFallback title={active.title} />
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 p-6 w-full z-20">
                    <motion.h3
                      layoutId={`title-${active.id}-${id}`}
                      className="text-2xl font-bold tracking-tighter text-white mb-2"
                    >
                      {active.title}
                    </motion.h3>

                    {/* Tags in expanded view - FADE IN only (No layoutId) */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: 0.1 }}
                      className="flex flex-wrap gap-2"
                    >
                      {active.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono uppercase px-2 py-1 bg-white/20 text-white backdrop-blur-md rounded-md border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                // IMPORTANT: Quick exit to prevent squash effect
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="flex-1 flex flex-col bg-card relative min-h-0"
              >
                <ScrollArea className="flex-1 p-6 md:p-10 overflow-y-auto">
                  <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground">
                    <Markdown>{active.description}</Markdown>
                  </div>
                </ScrollArea>

                <div className="p-4 md:p-6 border-t border-border bg-card/50 backdrop-blur-sm flex gap-3 z-10">
                  {active.href && (
                    <ButtonLink
                      href={active.href}
                      target="_blank"
                      variant="dark"
                      className="flex-1 w-full h-10 md:h-12 text-sm font-medium flex items-center justify-center rounded-lg"
                    >
                      Visit Live Site{" "}
                      <Icon name="arrow-up-right" className="ml-2" />
                    </ButtonLink>
                  )}
                  {active.links?.map((link, i) => (
                    <ButtonLink
                      key={i}
                      href={link.url}
                      target="_blank"
                      variant="secondary"
                      size="icon"
                      className="size-10 md:size-12 flex items-center justify-center border rounded-lg"
                    >
                      <Icon name={(link.icon as IconType) || "external-link"} />
                    </ButtonLink>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* GRID VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
        {cards?.map((card) => (
          <motion.div
            layoutId={`card-${card.id}-${id}`}
            key={card.id}
            onClick={() => setActive(card)}
            className="group relative flex flex-col h-[400px] w-full rounded-3xl bg-card border border-border p-2 cursor-pointer hover:border-border/20 hover:shadow-xl dark:hover:shadow-black/40 transition-all duration-500"
          >
            {/* Media Chassis */}
            <div className="relative h-[60%] w-full overflow-hidden rounded-2xl bg-background border border-border/5">
              <motion.div
                layoutId={`media-${card.id}-${id}`}
                className="h-full w-full"
              >
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
              </motion.div>

              <div className="absolute top-3 left-3 z-10">
                <div className="px-2 py-1 rounded-md bg-card/90 backdrop-blur-md border border-border/10 text-[10px] font-mono font-medium text-foreground uppercase tracking-wider shadow-sm">
                  {card.status || "Active"}
                </div>
              </div>

              <div className="absolute inset-0 z-6 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                <div className="size-12 rounded-full bg-primary/10 backdrop-blur-md border border-border/20 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                  <MousePointerClick className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>

            {/* Info Chassis */}
            <div className="flex flex-col flex-1 px-2 pt-4 pb-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-foreground/60 mb-2 uppercase tracking-widest">
                <span>{card.dates}</span>
                {card.tags?.[0] && (
                  <span className="flex items-center gap-1">
                    <Layers className="size-3" /> {card.tags[0]}
                  </span>
                )}
              </div>

              <motion.h3
                layoutId={`title-${card.id}-${id}`}
                className="text-lg font-bold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors"
              >
                {card.title}
              </motion.h3>

              {/* Description (No layoutId) */}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Footer Tags (No layoutId) */}
              <div className="mt-auto pt-4 border-t border-dashed border-border/10 flex items-center gap-2 overflow-hidden">
                {card.tags?.slice(1, 4).map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] bg-card text-[10px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {card.tags && card.tags.length > 4 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{card.tags.length - 4}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

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
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto",
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

function ProjectCard({ card, index }: { card: Omit<ProjectType, "body">; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video playback on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {}); // Ignore auto-play errors
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
          "bg-zinc-50 dark:bg-zinc-900/40", // Chassis background
          "border border-zinc-200 dark:border-white/10", // Chassis border
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

          <div className="absolute top-3 left-3 z-20 flex gap-2">
            <div className="px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono font-medium text-white uppercase tracking-wider shadow-sm">
              {card.status}
            </div>
          </div>

          {/* "Play" hint overlay if video exists */}
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
                <span>•</span>
                <span>{card.tags?.[0]}</span>
              </div>
            </div>

            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-400 dark:text-zinc-400 group-hover:bg-zinc-900 group-hover:dark:bg-white group-hover:text-white group-hover:dark:text-black transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
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
