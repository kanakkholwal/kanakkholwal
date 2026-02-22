"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WorkExperienceType } from "@/lib/work.source";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";

interface WorkExperienceCardProps {
  work: WorkExperienceType;
}

export function WorkExperienceCard({ work }: WorkExperienceCardProps) {
  const Mdx = work.body;

  
  return (
    <div className="group relative grid md:grid-cols-[200px_1fr] gap-x-12 gap-y-8 transition-all">
      <div className="hidden md:block absolute left-[217px] top-2 bottom-0 w-px bg-gradient-to-b from-border via-border/40 to-transparent" />

      <div className="flex flex-col items-start gap-4 md:sticky md:top-32 self-start z-10">
        {/* Date Range */}
        <div className="flex items-center gap-2 relative">
          {/* Timeline Node Dot */}
          <div className="hidden md:block size-2.5 rounded-full border-[3px] border-background bg-border group-hover:bg-primary group-hover:scale-125 transition-all duration-300 absolute -right-[19.5px] top-1.5 z-10" />
          <time
            className="font-mono text-xs font-medium text-muted-foreground/80 uppercase tracking-wider"
            dateTime={work.startDate}
          >
            {work.startDate} — {work.endDate ?? "Present"}
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
            <h3 className="font-semibold text-sm text-metallic text-shadow-glow leading-none mb-1">
              {work.company}
            </h3>
            <Link
              href={work.href}
              target="_blank"
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              {
                work.href
                  .replace(/(^\w+:|^)\/\//, "")
                  .replace(/www\./, "")
                  .split("/")[0]
              }
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Location & Type Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="px-2 py-0 h-5 text-[10px] font-mono font-normal text-muted-foreground bg-background"
          >
            {work.locationType === "Remote" ? "Remote" : "On-site"}
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
        <div
                   className={cn(
                     "prose dark:prose-invert max-w-none",
                     "prose-headings:font-mono prose-headings:tracking-tight prose-headings:font-bold",
                     "prose-p:font-mono prose-p:leading-6 prose-p:text-zinc-600 dark:prose-p:text-zinc-300",
                     "prose-li:font-mono",
       
                     // override typography anchor underline
                     "[&_a[data-card].peer]:no-underline",
                     "text-muted-foreground max-w-none mb-6 text-sm md:text-base leading-relaxed",
                     // "prose-pre:border prose-pre:border-border/50 prose-pre:bg-zinc-950",
                     // "prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none"
                   )}
                 >
                   <Mdx components={defaultMdxComponents} />
                 </div>
      </div>
    </div>
  );
}
