"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WorkExperienceType } from "@/lib/work.source";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface WorkExperienceCardProps {
  work: WorkExperienceType;
}

export function WorkExperienceCard({ work }: WorkExperienceCardProps) {
  const Mdx = work.body;
  const domain = work.href
    ?.replace(/(^\w+:|^)\/\//, "")
    .replace(/www\./, "")
    .split("/")[0];

  return (
    <article className="group relative flex gap-5 py-8 border-b border-border/50 last:border-0 transition-colors hover:bg-muted/20 -mx-4 px-4 rounded-lg">
      {/* Avatar column */}
      <div className="shrink-0 pt-0.5">
        <Avatar className="size-9 rounded-md border border-border/60 bg-muted/40 shadow-xs group-hover:border-border transition-colors">
          <AvatarImage
            src={work.logoUrl}
            alt={work.company}
            className="object-contain p-1"
          />
          <AvatarFallback className="rounded-md text-[11px] font-bold text-muted-foreground">
            {work.company[0]}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Content column */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Top row: company + date */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {work.href ? (
              <Link
                href={work.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-foreground/90 hover:text-foreground transition-colors flex items-center gap-1 group/link"
              >
                {work.company}
                <ArrowUpRight className="size-3 text-muted-foreground/50 group-hover/link:text-foreground transition-colors" />
              </Link>
            ) : (
              <span className="text-sm font-semibold text-foreground/90">
                {work.company}
              </span>
            )}
            <span className="text-muted-foreground/30 text-xs select-none">·</span>
            <span className="text-xs text-muted-foreground truncate">
              {work.locationType}
            </span>
          </div>
          <time
            className="shrink-0 font-mono text-[11px] text-muted-foreground/60 tabular-nums"
            dateTime={work.startDate}
          >
            {work.startDate} — {work.endDate ?? "Present"}
          </time>
        </div>

        {/* Role title */}
        <h3 className="text-base font-semibold leading-snug text-foreground tracking-tight">
          {work.title}
          {work.employmentType && (
            <span className="ml-2 font-mono text-[10px] font-normal text-muted-foreground/60 uppercase tracking-widest align-middle">
              {work.employmentType}
            </span>
          )}
        </h3>

        {/* MDX body */}
        <div
          className={cn(
            "prose dark:prose-invert max-w-none text-sm",
            "prose-p:my-0 prose-p:leading-6 prose-p:text-muted-foreground",
            "prose-li:text-muted-foreground prose-li:my-0.5",
            "prose-ul:my-2 prose-ul:pl-4",
            "[&_a[data-card].peer]:no-underline",
          )}
        >
          <Mdx components={defaultMdxComponents} />
        </div>

        {/* Badges */}
        {Array.isArray(work.badges) && work.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {work.badges.map((badge) => (
              <Badge
                key={badge}
                variant="secondary"
                className="px-2 py-0 h-5 text-[10px] font-mono font-normal rounded-sm bg-muted/60 text-muted-foreground border-transparent"
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
