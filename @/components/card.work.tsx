"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import { WorkExperience } from "~/data/work";

interface WorkExperienceCardProps {
  work: WorkExperience;
}

export function WorkExperienceCard({ work }: WorkExperienceCardProps) {
  return (
    <div className="group relative grid md:grid-cols-[200px_1fr] gap-x-12 gap-y-8 transition-all">
      
      {/* --- TIMELINE THREAD (Desktop Only) --- */}
      <div className="hidden md:block absolute left-[217px] top-2 bottom-0 w-px bg-gradient-to-b from-border via-border/40 to-transparent" />
      
      {/* --- LEFT COLUMN: METADATA (Sticky) --- */}
      <div className="flex flex-col items-start gap-4 md:sticky md:top-32 self-start z-10">
        
        {/* Date Range */}
        <div className="flex items-center gap-2 relative">
           {/* Timeline Node Dot */}
           <div className="hidden md:block size-2.5 rounded-full border-[3px] border-background bg-border group-hover:bg-primary group-hover:scale-125 transition-all duration-300 absolute -right-[19.5px] top-1.5 z-10" />
           <time
            className="font-mono text-xs font-medium text-muted-foreground/80 uppercase tracking-wider"
            dateTime={work.start}
          >
            {work.start} — {work.end ?? "Present"}
          </time>
        </div>

        {/* Company Identity */}
        <div className="flex items-center gap-3">
          <Avatar className="size-10 border border-border bg-background shadow-sm group-hover:border-primary/30 transition-colors">
            <AvatarImage
              src={work.logoUrl}
              alt={work.company}
              className="object-contain p-1.5"
            />
            <AvatarFallback className="text-xs font-bold text-muted-foreground">
              {work.company[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <h3 className="font-semibold text-sm text-foreground leading-none mb-1">
              {work.company}
            </h3>
            <Link
              href={work.href}
              target="_blank"
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              {work.href.replace(/(^\w+:|^)\/\//, "").replace(/www\./, "").split('/')[0]}
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Location & Type Badges */}
        <div className="flex flex-wrap gap-2">
           <Badge variant="outline" className="px-2 py-0 h-5 text-[10px] font-mono font-normal text-muted-foreground bg-background">
              {work.locationType === "remote" ? "Remote" : "On-site"}
           </Badge>
           {work.location && (
             <span className="flex items-center text-[10px] text-muted-foreground/60 font-medium sr-only">
                <MapPin className="size-3 mr-1" />
                {work.location}
             </span>
           )}
        </div>
      </div>

      <div className="relative pb-12 md:pb-20">
        {/* Role Title with "Titanium" Hover Effect */}
        <h3 className="text-xl md:text-2xl font-bold text-metallic tracking-tight mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-slate-500 transition-all duration-300 ease-out">
          {work.title}
        </h3>

        {/* Description: Perfectly Aligned Lists */}
        <div className="text-muted-foreground leading-relaxed max-w-none text-base">
          <Markdown
            components={{
              // 1. Remove default list padding/margin
              ul: ({ children }) => (
                <ul className="flex flex-col gap-3 my-0 list-none pl-0">{children}</ul>
              ),
              // 2. Custom List Item Layout
              li: ({ children }) => (
                <li className="flex items-start gap-3">
                  {/* The "Arrow" Bullet - Fixed width ensures alignment */}
                  <span className="mt-[5px] shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors duration-300">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 1.5L7 5L3.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {/* The Content */}
                  <span className="prose-sm dark:prose-invert text-pretty">
                    {children}
                  </span>
                </li>
              ),
              // 3. High-Contrast Strong Text
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              // 4. Subtle Links
              a: ({ href, children }) => (
                 <Link href={href || "#"} target="_blank" className="text-foreground underline underline-offset-4 decoration-border hover:decoration-primary transition-all">
                    {children}
                 </Link>
              ),
              p: ({ children }) => (
                <p className="mb-4 last:mb-0">{children}</p>
              )
            }}
          >
            {work.description}
          </Markdown>
        </div>
      </div>
    </div>
  );
}