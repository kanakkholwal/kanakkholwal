import type { CSSProperties } from "react";
import { Icon } from "@/components/icons";
import { TECH, techIcon, techSlug } from "@/components/icons/tech";
import { cn } from "@/lib/cn";

/**
 * Shared by every tool list: hovering one dims and blurs its neighbours (the logo-cloud move)
 * while it tilts up and washes in its own brand colour.
 */
const LIST =
  "group/tools flex flex-wrap gap-1.5 [&>li]:transition-[opacity,filter] [&>li]:duration-(--duration-slow) [&>li]:ease-(--ease-out) motion-reduce:[&>li]:transition-none pointer-fine:group-hover/tools:[&>li]:opacity-60 pointer-fine:group-hover/tools:[&>li]:blur-[0.75px] pointer-fine:[&>li:hover]:opacity-100! pointer-fine:[&>li:hover]:blur-none! pointer-fine:[&>li:focus-within]:opacity-100! pointer-fine:[&>li:focus-within]:blur-none!";

export function TechList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={cn(LIST, className)}>{children}</ul>;
}

/** A tool as its coloured logo over its name; `name` may be free text, unmapped names get a neutral mark. */
export function TechTile({ name, size = "md", className }: { name: string; size?: "md" | "sm"; className?: string }) {
  const slug = techSlug(name);
  const tech = slug ? TECH[slug] : undefined;
  return (
    <span
      style={{ "--brand": tech?.hex } as CSSProperties}
      className={cn(
        "group/chip flex flex-col items-center gap-2 rounded-2xl text-center outline-none",
        "transition-[background-color,transform] duration-(--duration-slow) ease-(--ease-out)",
        "hover:-translate-y-px focus-visible:-translate-y-px focus-visible:ring-2 focus-visible:ring-ring",
        tech
          ? "hover:bg-[color-mix(in_oklab,var(--brand)_8%,transparent)] focus-visible:bg-[color-mix(in_oklab,var(--brand)_8%,transparent)]"
          : "hover:bg-foreground/[0.05]",
        size === "md" ? "w-20 px-2 py-3.5" : "w-[4.5rem] px-1.5 py-3",
        className,
      )}
    >
      <Icon
        name={slug ? techIcon(slug) : "code"}
        className={cn(
          "transition-transform duration-(--duration-slow) ease-(--ease-out) motion-reduce:transition-none",
          "group-hover/chip:scale-110 group-focus-visible/chip:scale-110",
          size === "md" ? "size-8" : "size-6",
          tech?.adaptive ? "text-black dark:invert" : tech ? "text-(--brand)" : "text-muted-foreground",
        )}
      />
      <span className="line-clamp-2 text-balance text-muted-foreground text-xs leading-tight transition-colors duration-(--duration-slow) group-hover/chip:text-foreground">
        {tech?.label ?? name}
      </span>
    </span>
  );
}
