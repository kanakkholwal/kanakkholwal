"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Globe, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useId, useRef, useState } from "react";
import Markdown from "react-markdown";

// --- TYPES ---
interface ProjectLink {
  icon: React.ReactNode;
  type: string;
  href: string;
}

interface ProjectCardData {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: string[];
  link?: string;
  image?: string;
  video?: string;
  links?: ProjectLink[];
}

export interface ExpandableCardProps {
  cards: ProjectCardData[];
}

// --- UTILITY: GENERATIVE FALLBACK ---
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
};

function ProjectFallback({ title }: { title: string }) {
  const color1 = stringToColor(title);
  const color2 = stringToColor(title.split("").reverse().join(""));

  return (
    <div className="relative w-full h-full bg-zinc-50 dark:bg-zinc-900 overflow-hidden flex items-center justify-center">
      {/* Abstract Gradient Blobs */}
      <div
        className="absolute top-[-50%] left-[-20%] w-[100%] h-[100%] rounded-full blur-[80px] opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen"
        style={{ backgroundColor: color1 }}
      />
      <div
        className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full blur-[80px] opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen"
        style={{ backgroundColor: color2 }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Central Monogram */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="text-6xl font-bold tracking-tighter text-foreground/10 select-none font-mono">
          {title.substring(0, 2).toUpperCase()}
        </div>
      </div>
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay" />
    </div>
  );
}

// --- UTILITY: CLOSE ICON ---
const CloseIcon = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn("p-1 bg-white/10 backdrop-blur-sm rounded-full", className)}
    >
      <X className="w-5 h-5 text-zinc-500 dark:text-zinc-200" />
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export function ExpandableProjectCards({ cards }: ExpandableCardProps) {
  const [active, setActive] = useState<ProjectCardData | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () => setActive(null));

  return (
    <>
      {/* --- OVERLAY & MODAL (EXPANDED VIEW) --- */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm h-full w-full z-40"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-50 p-4">
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-3xl h-[85vh] md:h-fit md:max-h-[85vh] flex flex-col bg-background dark:bg-zinc-900 sm:rounded-3xl overflow-hidden shadow-2xl border border-border"
            >
              {/* --- MODAL HEADER (MEDIA) --- */}
              <div className="relative h-64 md:h-80 w-full shrink-0 group">
                {/* Close Button */}
                <motion.button
                  key={`button-${active.title}-${id}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                  onClick={() => setActive(null)}
                >
                  <X className="size-5" />
                </motion.button>

                <motion.div layoutId={`media-${active.title}-${id}`} className="h-full w-full relative">
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
                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
                </motion.div>

                {/* Floating Title on Image */}
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full pointer-events-none">
                   <motion.div layoutId={`tags-${active.title}-${id}`} className="flex flex-wrap gap-2 mb-3">
                    {active.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-background/80 backdrop-blur-md text-foreground border-transparent">
                        {tag}
                      </Badge>
                    ))}
                  </motion.div>
                  <motion.h3
                    layoutId={`title-${active.title}-${id}`}
                    className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground"
                  >
                    {active.title}
                  </motion.h3>
                </div>
              </div>

              {/* --- MODAL CONTENT --- */}
              <div className="flex flex-col h-full overflow-hidden bg-background">
                <ScrollArea className="flex-1 p-6 md:p-8">
                  <div className="grid md:grid-cols-[2fr_1fr] gap-10">
                    
                    {/* Left: Description */}
                    <motion.div 
                      layoutId={`description-${active.title}-${id}`}
                      className="prose prose-sm md:prose-base dark:prose-invert text-muted-foreground"
                    >
                      <Markdown>{active.description}</Markdown>
                    </motion.div>

                    {/* Right: Metadata sidebar */}
                    <div className="flex flex-col gap-6">
                       {/* Links */}
                       <div className="flex flex-col gap-3">
                          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Links</h4>
                          <div className="flex flex-wrap gap-2">
                             {active.href && (
                               <Link href={active.href} target="_blank" className="w-full">
                                 <Button className="w-full justify-between" variant="default">
                                   View Live Project <Globe className="size-4" />
                                 </Button>
                               </Link>
                             )}
                             {active.links?.map((link, i) => (
                               <Link href={link.href} key={i} target="_blank" className="w-full">
                                 <Button variant="outline" className="w-full justify-between">
                                   {link.type} 
                                   {link.icon || <ArrowUpRight className="size-4" />}
                                 </Button>
                               </Link>
                             ))}
                          </div>
                       </div>

                       {/* Tech Stack (Full List) */}
                       <div className="flex flex-col gap-3">
                          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Technologies</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {active.tags?.map((tag) => (
                              <Badge key={tag} variant="outline" className="font-mono text-xs font-normal">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                       </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* --- GRID VIEW (CLOSED CARDS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
        {cards?.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="group relative flex flex-col h-[400px] w-full bg-background dark:bg-zinc-900 rounded-3xl border border-border overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-zinc-900/10 dark:hover:shadow-black/50 transition-all duration-500 hover:-translate-y-2"
          >
            {/* Media Section (Top 65%) */}
            <div className="h-[65%] w-full overflow-hidden relative">
              <motion.div layoutId={`media-${card.title}-${id}`} className="h-full w-full">
                {card.video ? (
                  <video
                    src={card.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : card.image ? (
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  // Fallback wrapper to handle hover scale
                  <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                     <ProjectFallback title={card.title} />
                  </div>
                )}
              </motion.div>
              
              {/* Overlay Gradient on Hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            </div>

            {/* Content Section (Bottom 35%) */}
            <div className="flex flex-col justify-between flex-1 p-6 bg-background relative z-10">
              <div>
                <motion.div 
                   layoutId={`tags-${card.title}-${id}`}
                   className="flex flex-wrap gap-2 mb-3"
                >
                   {/* Show max 2 tags in grid view */}
                  {card.tags?.slice(0, 2).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {card.tags && card.tags.length > 2 && (
                     <span className="text-[10px] text-muted-foreground self-center">+{card.tags.length - 2}</span>
                  )}
                </motion.div>
                
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors"
                >
                  {card.title}
                </motion.h3>
                
                {/* Short Description (Truncated) */}
                <motion.div layoutId={`description-${card.title}-${id}`}>
                   <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                     {card.description.replace(/[#*_`]/g, '')}
                   </p>
                </motion.div>
              </div>

              {/* View Project Arrow (Appears on Hover) */}
              <div className="flex items-center gap-2 text-xs font-medium text-primary opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                 View Case Study <ArrowUpRight className="size-3" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}