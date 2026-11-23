import type { CSSProperties } from "react";
import { appConfig } from "root/project.config";
import type { IconType } from "@/components/icons";
import { IconChip } from "@/components/stats/icon-chip";
import { TechList, TechTile } from "@/components/site/tech-chip";
import { cn } from "@/lib/cn";

type Group = keyof typeof appConfig.skills;

const GROUPS: { key: Group; title: string; icon: IconType; span: string }[] = [
  { key: "frontend", title: "Frontend", icon: "layout-grid", span: "lg:col-span-4" },
  { key: "database", title: "Data", icon: "box", span: "lg:col-span-2" },
  { key: "backend", title: "Backend", icon: "code", span: "lg:col-span-3" },
  { key: "devops", title: "Ship and run", icon: "rocket", span: "lg:col-span-3" },
  { key: "ai", title: "AI and agents", icon: "sparkles", span: "lg:col-span-4" },
  { key: "tools", title: "Everyday tools", icon: "palette", span: "lg:col-span-2" },
];

/** A bento of tool groups: each tool is a coloured logo chip that rises in with a stagger. */
export function Stack() {
  let n = 0;
  return (
    <div className="grid gap-3 lg:grid-cols-6">
      {GROUPS.map(({ key, title, icon, span }) => {
        const tools = appConfig.skills[key];
        return (
          <div key={key} className={cn("rounded-2xl bg-card p-1", span)}>
            <div className="flex h-full flex-col gap-4 rounded-xl bg-background p-4 shadow-(--surface-shadow) dark:bg-popover">
              <div className="flex items-center gap-2.5">
                <IconChip name={icon} />
                <p className="font-medium text-sm">{title}</p>
                <span className="font-mono text-muted-foreground text-xs tabular-nums">{tools.length}</span>
              </div>
              <TechList>
                {tools.map((slug) => (
                  <li key={slug} className="rise" style={{ "--i": n++ } as CSSProperties}>
                    <TechTile name={slug} />
                  </li>
                ))}
              </TechList>
            </div>
          </div>
        );
      })}
    </div>
  );
}
