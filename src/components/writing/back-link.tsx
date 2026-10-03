import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import Link from "@/components/link";
import { cn } from "@/lib/cn";

/** Quiet link back up a level; the arrow leans the way it goes. */
export function BackLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group/back inline-flex items-center gap-1 text-muted-foreground text-sm transition-colors hoverable:text-foreground",
        className,
      )}
    >
      <Icon
        name="arrow-left"
        className="size-3.5 transition-transform duration-(--duration-fast) ease-(--ease-out) group-hover/back:-translate-x-0.5"
      />
      {children}
    </Link>
  );
}
