import type { TOCItemType } from "fumadocs-core/toc";
import { isValidElement, type ReactNode } from "react";
import { TableOfContents, type TocItem } from "@/components/ui/table-of-contents";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

export function toTocItems(toc: TOCItemType[]): TocItem[] {
  return toc
    .filter((t) => t.depth === 2 || t.depth === 3)
    .map((t) => ({ id: t.url.replace(/^#/, ""), label: textOf(t.title), depth: t.depth as 2 | 3 }));
}

/** Sticky rail beside the reading column; xl only, where the pane has room for it. */
export function ArticleToc({ toc }: { toc: TOCItemType[] }) {
  const items = toTocItems(toc);
  if (items.length < 2) return null;
  return (
    <aside className="sticky top-24 hidden w-40 shrink-0 xl:block">
      <p className="mb-3 font-mono text-muted-foreground text-xs">on this page</p>
      {/* Accent is reserved for focus rings, so the active rail uses the foreground. */}
      <TableOfContents items={items} scrollOffset={80} className="[--primary:var(--foreground)]" />
    </aside>
  );
}
