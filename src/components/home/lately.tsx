import { Icon, type IconType } from "@/components/icons";
import { Meta } from "@/components/site/page";
import { cn } from "@/lib/cn";
import type { HeroOrbitActivityItem } from "~/api/github";

const KIND_ICON: Record<HeroOrbitActivityItem["kind"], IconType> = {
  rocket: "rocket",
  package: "package",
  code: "code",
  "stars:bs": "sparkles",
  "git-commit": "git-commit",
  "git-pull-request": "git-pull-request",
  "message-circle": "info",
  star: "star",
};

/** The last few things that happened on GitHub, newest first. */
export function Lately({ items }: { items: HeroOrbitActivityItem[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => {
        const row = (
          <>
            <Icon name={KIND_ICON[item.kind]} className="size-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate text-sm">
              <span className="text-muted-foreground">{item.label}</span>{" "}
              <span className="text-foreground">{item.value}</span>
            </span>
            <Meta className="shrink-0">{item.time}</Meta>
          </>
        );
        const cls = "flex items-center gap-3 border-border border-b border-dashed py-2.5 last:border-b-0";
        return (
          <li key={`${item.kind}-${item.value}-${item.occurredAt}`}>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(cls, "group transition-colors [&_.text-foreground]:hoverable:underline")}
              >
                {row}
              </a>
            ) : (
              <div className={cls}>{row}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
