"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ButtonLink, TransitionLink } from "@/components/utils/link";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Layers, Play, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import Markdown from "react-markdown";
import { ProjectType } from "~/data/projects";

import { ProjectFallback } from "./projects.card.fallback";

import { MousePointerClick } from "lucide-react";
import { Icon } from "../icons";

export function ExpandableProjectCards({ cards }: { cards: ProjectType[] }) {
  const [active, setActive] = useState<ProjectType | null>(null);
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

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 h-full w-full"
          />
        )}
      </AnimatePresence>

      {/* EXPANDED*/}
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-50 p-4 pointer-events-none">
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-5xl h-[85vh] md:h-[80vh] bg-white dark:bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/10 flex flex-col md:flex-row pointer-events-auto"
            >
              {/* Left: Media Column */}
              <div className="w-full md:w-[45%] h-64 md:h-full relative bg-zinc-100 dark:bg-zinc-900 flex flex-col border-b md:border-b-0 md:border-r border-border">
                <button
                  className="absolute top-4 left-4 z-20 p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-black/70 transition-colors"
                  onClick={() => setActive(null)}
                >
                  <X className="w-4 h-4" />
                </button>

                <motion.div layoutId={`media-${active.title}-${id}`} className="relative h-full w-full overflow-hidden">
                  {active.video ? (
                    <video src={active.video} autoPlay loop muted playsInline className="h-full w-full object-cover" />
                  ) : active.image ? (
                    <Image src={active.image} alt={active.title} fill className="object-cover" />
                  ) : (
                    <ProjectFallback title={active.title} />
                  )}
                  {/* Gradient to make text readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <motion.h3 layoutId={`title-${active.title}-${id}`} className="text-3xl font-bold tracking-tighter text-white mb-2">
                      {active.title}
                    </motion.h3>
                    <motion.div layoutId={`tags-${active.title}-${id}`} className="flex flex-wrap gap-2">
                      {active.tags?.map(tag => (
                        <span key={tag} className="text-[10px] font-mono uppercase px-2 py-1 bg-white/20 text-white backdrop-blur-md rounded-md border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Right: Content Column */}
              <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-950 relative">
                <ScrollArea className="flex-1 p-8 md:p-10">
                  <motion.div
                    layoutId={`description-${active.title}-${id}`}
                    className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300"
                  >
                    <Markdown>{active.content || active.description}</Markdown>
                  </motion.div>
                </ScrollArea>

                <div className="p-6 border-t border-border bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm flex gap-3">
                  {active.href && (
                    <ButtonLink href={active.href} target="_blank" variant="dark" className="flex-1 w-full h-12 text-base font-medium">
                        Visit Live Site <Icon name="arrow-up-right" />
                    </ButtonLink>
                  )}
                  {active.links?.map((link, i) => (
                    <ButtonLink key={i} href={link.href} target="_blank"
                      variant="glass" size="icon" className="h-12 w-12">
                        {link.icon}
                    </ButtonLink>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
        {cards?.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="group relative flex flex-col h-[400px] w-full rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 p-2 cursor-pointer hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-xl dark:hover:shadow-black/40 transition-all duration-500"
          >
            <div className="relative h-[60%] w-full overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800 border border-black/5 dark:border-white/5">
              <motion.div layoutId={`media-${card.title}-${id}`} className="h-full w-full">
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
                <div className="px-2 py-1 rounded-md bg-white/90 dark:bg-black/60 backdrop-blur-md border border-zinc-200 dark:border-white/10 text-[10px] font-mono font-medium text-zinc-800 dark:text-white uppercase tracking-wider shadow-sm">
                  {card.status}
                </div>
              </div>

              <div className="absolute inset-0 z-6 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                <div className="size-12 rounded-full bg-primary/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                  <MousePointerClick className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>

            {/* 2. INFO CHASSIS (Bottom 40%) */}
            <div className="flex flex-col flex-1 px-2 pt-4 pb-2">
              {/* Header: Date & Meta */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mb-2 uppercase tracking-widest">
                <span>{card.dates}</span>
                <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {card.tags?.[0]}</span>
              </div>

              {/* Title */}
              <motion.h3
                layoutId={`title-${card.title}-${id}`}
                className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-2 group-hover:text-primary transition-colors"
              >
                {card.title}
              </motion.h3>

              {/* Description (Fade out on expand, so no layoutId needed usually, but kept for consistency if desired) */}
              <motion.div layoutId={`description-${card.title}-${id}`} className="flex-1">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {card.description}
                </p>
              </motion.div>

              {/* Footer: Tags Scroller */}
              <motion.div layoutId={`tags-${card.title}-${id}`} className="mt-auto pt-4 border-t border-dashed border-zinc-200 dark:border-white/10 flex items-center gap-2 overflow-hidden">
                {card.tags?.slice(1, 4).map((tag, i) => ( // Skipping first tag as it is in header
                  <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                    {tag}
                  </span>
                ))}
                {card.tags && card.tags.length > 4 && (
                  <span className="text-[10px] text-zinc-400">+{card.tags.length - 4}</span>
                )}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export function SimpleProjectCards({ cards }: { cards: ProjectType[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
      {cards?.map((card, index) => (
        <ProjectCard key={card.id} card={card} index={index} />
      ))}
    </div>
  );
}

function ProjectCard({ card, index }: { card: ProjectType; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video playback on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => { }); // Ignore auto-play errors
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
          "p-2 transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50"
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
                isHovered ? "scale-105" : "scale-100"
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
                <span key={i} className="inline-flex items-center px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/50 text-[10px] font-medium text-zinc-500 dark:text-zinc-400 border border-transparent group-hover:border-zinc-200 group-hover:dark:border-white/10 transition-colors">
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