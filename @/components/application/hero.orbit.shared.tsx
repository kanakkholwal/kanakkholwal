import { Icon, IconType } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { HeroOrbitActivityItem } from "~/api/github";

export type HeroOrbitPayload = {
  stats: {
    projects: number;
    ossRepos: number;
    yearsExp: number;
  };
  activity: HeroOrbitActivityItem[];
  fallback: boolean;
};

export const heroOrbitIconMap: Record<HeroOrbitActivityItem["kind"], IconType> = {
  rocket: "rocket",
  package: "package",
  code: "code",
  "stars:bs": "stars:bs",
  "git-commit": "git-commit",
  "git-pull-request": "git-pull-request",
  "message-circle": "message-circle",
  star: "star",
};

export type HeroOrbitRowProps = {
  item: HeroOrbitActivityItem;
  variant?: "card" | "minimal" | "story" | "static";
};

function rowInner(item: HeroOrbitActivityItem, variant: "card" | "minimal" | "story" | "static") {
  const iconName = heroOrbitIconMap[item.kind] ?? "code";
  if (variant === "minimal") {
    return (
      <>
        <Icon name={iconName} className="size-3 text-muted-foreground shrink-0" />
        <span className="text-[11px] text-muted-foreground shrink-0">{item.label}</span>
        <span className="text-[11px] font-medium text-foreground truncate max-w-[180px]">
          {item.value}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground/50 tabular-nums shrink-0">
          {item.time}
        </span>
      </>
    );
  }
  return (
    <>
      <span className="shrink-0 inline-flex items-center justify-center size-5 rounded bg-muted/60 text-muted-foreground">
        <Icon name={iconName} className="size-3" />
      </span>
      <span className="text-[11px] text-muted-foreground shrink-0">{item.label}</span>
      <span className="flex-1 min-w-0 truncate text-[11px] font-medium text-foreground">
        {item.value}
      </span>
      <span className="shrink-0 text-[10px] font-mono text-muted-foreground/50 tabular-nums">
        {item.time}
      </span>
    </>
  );
}

export function HeroOrbitRow({ item, variant = "card" }: HeroOrbitRowProps) {
  const containerClass = cn(
    "flex items-center min-w-0",
    variant === "minimal" && "gap-1.5 whitespace-nowrap py-0.5",
    variant === "card" && "gap-2 py-1",
    variant === "story" && "gap-3 py-1.5",
    variant === "static" && "gap-2 py-1.5 border-b border-border/30 last:border-0",
  );

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          containerClass,
          "hover:text-foreground transition-colors",
        )}
      >
        {rowInner(item, variant)}
      </a>
    );
  }

  return <span className={containerClass}>{rowInner(item, variant)}</span>;
}

export function HeroOrbitMinimal({ activity, fallback, stats }: HeroOrbitPayload) {
  const items = activity.length
    ? activity.slice(0, 3)
    : [
        {
          kind: "rocket" as const,
          label: "Projects",
          value: `${stats.projects}+ shipped`,
          occurredAt: null,
          time: "ongoing",
          url: "/projects",
        },
        {
          kind: "stars:bs" as const,
          label: "Experience",
          value: `${stats.yearsExp}+ yrs`,
          occurredAt: null,
          time: "ongoing",
        },
      ];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
        Latest
      </span>
      {items.map((item, idx) => (
        <HeroOrbitRow key={`${item.kind}-${idx}`} item={item} variant="minimal" />
      ))}
      {fallback && (
        <span className="font-mono text-[10px] text-muted-foreground/40">cached</span>
      )}
    </div>
  );
}

export function HeroOrbitStatic({ activity, stats, fallback }: HeroOrbitPayload) {
  return (
    <div className="mt-4 w-full max-w-sm border border-border/40 rounded-lg overflow-hidden bg-card/40 backdrop-blur-sm">
      <div className="grid grid-cols-3 divide-x divide-border/40 border-b border-border/30">
        {[
          { label: "Projects", value: stats.projects },
          { label: "OSS", value: stats.ossRepos },
          { label: "Yrs", value: stats.yearsExp },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center py-2">
            <span className="text-sm font-bold tabular-nums">{s.value}+</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <div className="px-3 py-2">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-1.5">
          Recent activity {fallback && "· cached"}
        </p>
        <ul className="space-y-0">
          {activity.length === 0 && (
            <li className="text-xs text-muted-foreground/60 italic py-1">
              No recent activity to show.
            </li>
          )}
          {activity.slice(0, 3).map((item, idx) => (
            <li key={`${item.kind}-${idx}`}>
              <HeroOrbitRow item={item} variant="static" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function HeroOrbitStory({ activity, stats }: HeroOrbitPayload) {
  if (!activity.length && !stats.projects) return null;
  return (
    <div className="mt-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Recent activity
      </p>
      <ul className="mt-3 space-y-1 border-l border-border/30 pl-4">
        {activity.length === 0 && (
          <li className="text-xs text-muted-foreground/60 italic">No recent activity to show.</li>
        )}
        {activity.slice(0, 3).map((item, idx) => (
          <li key={`${item.kind}-${idx}`}>
            <HeroOrbitRow item={item} variant="story" />
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">
        {stats.projects}+ projects · {stats.ossRepos}+ OSS repos · {stats.yearsExp}+ yrs
      </p>
    </div>
  );
}
