"use client";

import { getProjectList } from "@/lib/project.source";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { journey_data } from "~/data/journey";
import ChangelogContent from "../application/page.timeline";


export function TimelineProjectGrid({
  yearFilter,
}: {
  yearFilter: string[];
}) {

  const filteredProjects = useMemo(() => getProjectList().filter((project) => {
    if (!project.image) return false;
    return yearFilter.some((year) => project.dates.includes(year));
  }).map(({ body, ...rest }) => ({
    ...rest,
  })), []);


  if (filteredProjects.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {filteredProjects.map((project) => (
        <Link
          key={project.title}
          href={project?.links?.[0]?.url || project.href || "#"}
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



export function Timeline() {

  return (
    <section className="w-full md:px-10">
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <div className="flex flex-col mb-4">
          <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">
            // The Archives
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
            <span className="font-instrument-serif italic font-normal text-muted-foreground/80 mr-3">
              Changelog
            </span>
            <span className="text-colorful-titanium">of my Journey</span>
          </h2>
        </div>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          From my first line of code to building scalable systems. A timeline of
          experiments, failures, and shipped products.
        </p>
      </div>

      {/* TIMELINE CONTAINER */}
      <div className="relative max-w-app mx-auto pb-20 px-4 md:px-8 lg:px-10 flex flex-col items-start">
        <ChangelogContent releases={journey_data.toReversed().map((item) => ({
          version: item.date,
          // date: item.date,
          content: item.content,
        }))} />
  
      </div>
    </section>
  );
};
