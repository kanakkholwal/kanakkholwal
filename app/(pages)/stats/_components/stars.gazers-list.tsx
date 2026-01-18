"use client";
import { cn } from "@/lib/utils";
import { formatDate, formatStatNumber } from "../lib/format";
import type { GitHubStarHistory } from "../lib/github";

import Image from "next/image";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { statsConfig } from "../config";

// --- ICONS ---
import {
  PiBuildingsDuotone,
  PiCalendarBlankDuotone,
  PiLinkSimpleDuotone,
  PiUserCircleDuotone,
  PiUsersThreeDuotone
} from "react-icons/pi";

type Stargazer = GitHubStarHistory["bins"][number]["stargarzers"][number];

type StargazersListProps = {
  data: Record<string, GitHubStarHistory>;
};

export default function StargazersList({ data }: StargazersListProps) {
  const [activeRepo] = useQueryState(
    "repo",
    parseAsStringLiteral(
      statsConfig.repositories.map((repo) => repo.repo),
    ).withDefault(statsConfig.repositories[0].repo),
  );
  const stars = data[activeRepo];

  return (
    <ul className="h-full overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
      {stars.bins.map((bin, index) => (
        <section key={bin.date} className="relative">
          {/* Sticky Date Header */}
          <div className="sticky top-0 z-10 flex items-center gap-2 border-y border-border/50 bg-muted/80 backdrop-blur-md px-4 py-2 text-[10px] font-mono font-medium uppercase tracking-widest text-muted-foreground">
            <PiCalendarBlankDuotone className="text-sm" />
            {formatDate(bin.date, "", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            })}
          </div>

          {bin.stargarzers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
              <span className="text-2xl mb-2 opacity-50">
                {index === 0 ? "⏳" : "💤"}
              </span>
              <span className="text-xs font-mono uppercase tracking-wider">
                {index === 0 ? "Awaiting Data" : "No Activity Logged"}
              </span>
            </div>
          )}

          <div className="divide-y divide-border/30">
            {bin.stargarzers.map((stargazer) => (
              <Stargazer
                data={stargazer}
                key={stargazer.login + stargazer.avatarUrl}
              />
            ))}
          </div>
        </section>
      ))}
    </ul>
  );
}

type StargazerProps = {
  data: Stargazer;
};

function Stargazer({
  data: { login, name, avatarUrl, company, followers },
}: StargazerProps) {
  return (
    <li className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/30">
      {/* Avatar */}
      <a
        href={`https://github.com/${login}`}
        className="relative shrink-0"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="h-9 w-9 overflow-hidden rounded-md border border-border/50 bg-background transition-transform group-hover:scale-105 group-hover:border-primary/50">
          <Image
            src={avatarUrl}
            alt={name ?? login}
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        </div>
      </a>

      {/* Info Column */}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center gap-2">
          <a
            href={`https://github.com/${login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sm text-foreground truncate hover:text-primary transition-colors flex items-center gap-1.5"
          >
            {name || login}
            <PiLinkSimpleDuotone className="opacity-0 group-hover:opacity-50 text-xs" />
          </a>
          {name && (
            <span className="hidden sm:inline-block text-xs font-mono text-muted-foreground/60 truncate">
              @{login}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          {company && (
            <div className="flex items-center gap-1 truncate max-w-[120px]">
              <PiBuildingsDuotone />
              <span className="truncate">{company}</span>
            </div>
          )}
          {!company && (
            <div className="flex items-center gap-1 opacity-50">
              <PiUserCircleDuotone />
              <span>Individual</span>
            </div>
          )}
        </div>
      </div>

      {/* Followers Metric */}
      <div className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-mono font-medium",
        followers > 500
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
          : followers > 100
            ? "bg-blue-500/10 border-blue-500/20 text-blue-600"
            : "bg-muted/30 border-border/50 text-muted-foreground"
      )}>
        <PiUsersThreeDuotone className="text-sm" />
        <span>{formatStatNumber(followers)}</span>
      </div>
    </li>
  );
}