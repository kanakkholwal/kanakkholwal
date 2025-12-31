"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { ProjectType } from "~/data/projects";

// --- DATA DEFINITION ---
// I've cleaned up the data structure. You can move this to a separate file if preferred.

export const TimelineProjectGrid = ({ yearFilter,projectsList }: { yearFilter: string[], projectsList: ProjectType[] }) => {
  const filteredProjects = projectsList.filter((project) => {
    if (!project.image) return false;
    return yearFilter.some((year) => project.dates.includes(year));
  });

  if (filteredProjects.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {filteredProjects.map((project) => (
        <Link
          key={project.title}
          href={project.links[0]?.href || project.href || "#"}
          target="_blank"
          className="group relative block aspect-video overflow-hidden rounded-xl border border-border/50 bg-muted/20"
        >
          <Image
            src={project.image!}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
             <div className="bg-background/90 backdrop-blur-sm rounded-full p-2">
                <ArrowUpRight className="size-4 text-foreground" />
             </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}
interface TimelineProps {
  data: TimelineEntry[];
  title?: string;
  description?: string;
}

export const Timeline = ({ data, }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        // We wrap the timeline content in a div with id="timeline-content" to measure height
        const contentHeight = entries[0].contentRect.height;
        setHeight(contentHeight);
      });
      
      const contentEl = document.getElementById("timeline-inner-content");
      if (contentEl) resizeObserver.observe(contentEl);

      return () => resizeObserver.disconnect();
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 80%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section className="w-full md:px-10" ref={containerRef}>
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
         <div className="flex flex-col mb-4">
            <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">
               // The Archives
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
               <span className="font-instrument-serif italic font-normal text-muted-foreground/80 mr-3">
                  Changelog
               </span>
               <span className="text-colorful-titanium">
                  of my Journey
               </span>
            </h2>
         </div>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          From my first line of code to building scalable systems. A timeline of experiments, failures, and shipped products.
        </p>
      </div>

      {/* TIMELINE CONTAINER */}
      <div className="relative max-w-7xl mx-auto pb-20 px-4 md:px-8 lg:px-10">
        
        {/* THE BEAM (Scroll Line) */}
        <div
          className="absolute left-8 md:left-[59px] top-0 bottom-0 w-[2px] bg-border/40"
          aria-hidden="true"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-indigo-500 via-purple-500 to-transparent rounded-full"
          />
        </div>

        <div id="timeline-inner-content" className="relative flex flex-col gap-12 md:gap-24">
          {data.map((item, index) => (
            <div
              key={index}
              className="relative flex flex-col md:flex-row gap-8 md:gap-16"
            >
              {/* NODE & DATE (Left Side) */}
              <div className="flex flex-row md:flex-col items-center md:items-end md:w-[200px] shrink-0">
                 {/* The Node Dot */}
                 <div className="absolute left-[11px] md:left-[42px] z-20 flex items-center justify-center bg-background rounded-full border border-border p-1 shadow-sm">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 dark:from-zinc-100 dark:to-zinc-600" />
                 </div>
                 
                 {/* Date Label */}
                 <div className="ml-12 md:ml-0 md:text-right">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-colorful-titanium">
                       {item.title}
                    </h3>
                 </div>
              </div>

              {/* CONTENT (Right Side) */}
              <div className="relative pl-12 md:pl-0 w-full">
                <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed">
                   {item.content}
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};