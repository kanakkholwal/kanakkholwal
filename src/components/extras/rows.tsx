import type { ComponentProps, ReactNode } from "react";
import { Icon, type IconType } from "@/components/icons";
import Link from "@/components/link";
import { isExternal } from "@/components/site/link";
import { Meta } from "@/components/site/page";
import { cn } from "@/lib/cn";

/** The PostList row recipe; siblings dim while one is hovered. Needs a `group/list` parent. */
export const rowClass = cn(
  "group/row flex items-center gap-3 rounded-xl px-3 py-2.5 outline-none",
  "transition-[opacity,background-color,scale] duration-(--duration-base) ease-(--ease-out)",
  "pointer-fine:group-hover/list:opacity-45 pointer-fine:hover:opacity-100! hover:bg-foreground/[0.03]",
  "group-has-focus-visible/list:opacity-45 focus-visible:opacity-100! focus-visible:ring-2 focus-visible:ring-ring",
  "active:scale-(--press-scale-surface)",
);

export function RowList({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("group/list -mx-3 flex flex-col", className)} {...props} />;
}

/** Arrow that leans toward where the row goes. */
export function RowArrow({ external }: { external: boolean }) {
  return (
    <Icon
      name={external ? "arrow-up-right" : "arrow-right"}
      className={cn(
        "size-3.5 shrink-0 text-muted-foreground transition-transform duration-(--duration-fast) ease-(--ease-out)",
        external
          ? "group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5"
          : "group-hover/row:translate-x-0.5",
      )}
    />
  );
}

export function RowLink({
  href,
  icon,
  meta,
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "href" | "children"> & {
  href: string;
  icon?: IconType;
  meta?: ReactNode;
  children: ReactNode;
}) {
  const external = isExternal(href);
  return (
    <li>
      <Link
        href={href}
        {...(external && !href.startsWith("mailto:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(rowClass, className)}
        {...props}
      >
        {icon ? (
          <Icon
            name={icon}
            className="size-4 shrink-0 text-muted-foreground transition-colors group-hover/row:text-foreground"
          />
        ) : null}
        <span className="min-w-0 flex-1 truncate text-sm">{children}</span>
        {meta ? <Meta className="shrink-0">{meta}</Meta> : null}
        <RowArrow external={external} />
      </Link>
    </li>
  );
}
