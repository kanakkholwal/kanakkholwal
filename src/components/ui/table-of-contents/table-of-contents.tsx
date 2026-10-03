"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  activeRange,
  buildTrack,
  idsInRange,
  itemPad,
  itemRail,
  movedUp,
  rangeFromIds,
  type TocItem,
  type TocRange,
  type TocRow,
  type TocTrack,
  thumbStyle,
} from "./toc-core";
import { type TableOfContentsVariant, tableOfContents } from "./variants";

export type { TocItem };

export interface TableOfContentsProps {
  items: TocItem[];
  /** Height of any sticky header: a heading above this line counts as scrolled past. */
  scrollOffset?: number;
  /** Accessible name of the navigation landmark. */
  label?: string;
  /** Ids of the headings shown as in view; when set, it overrides the scroll spy. */
  activeIds?: string[];
  onActiveChange?: (ids: string[]) => void;
  /** Scroll container holding the headings; the window when omitted. */
  root?: HTMLElement | null;
  variant?: TableOfContentsVariant;
  /** A dot that rides the rail to the edge of the headings in view. */
  indicator?: boolean;
  className?: string;
}

/** Turns `--a:1px;--b:2px` into a style object React accepts. */
function cssVars(css: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const part of css.split(";")) {
    const [key, value] = part.split(":");
    if (key && value) out[key] = value;
  }
  return out as CSSProperties;
}

export function TableOfContents({
  items,
  scrollOffset = 56,
  label = "On this page",
  activeIds,
  onActiveChange,
  root,
  variant = "curve",
  indicator = true,
  className,
}: TableOfContentsProps) {
  const styles = tableOfContents({ variant, indicator });
  const curve = variant === "curve";
  const listRef = useRef<HTMLElement>(null);
  const [track, setTrack] = useState<TocTrack | null>(null);
  const [spied, setSpied] = useState<{ range: TocRange; up: boolean } | null>(null);
  const onChangeRef = useRef(onActiveChange);
  onChangeRef.current = onActiveChange;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      if (list.clientHeight === 0) return setTrack(null);
      const rows: TocRow[] = [];
      for (const item of items) {
        const link = list.querySelector<HTMLElement>(`a[href="#${CSS.escape(item.id)}"]`);
        if (!link) continue;
        const pad = getComputedStyle(link);
        rows.push({
          depth: item.depth,
          top: link.offsetTop + Number.parseFloat(pad.paddingTop),
          bottom: link.offsetTop + link.clientHeight - Number.parseFloat(pad.paddingBottom),
        });
      }
      setTrack(buildTrack(rows, curve));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    measure();
    return () => observer.disconnect();
  }, [items, curve]);

  useEffect(() => {
    const els = items.map((item) => document.getElementById(item.id));
    const container = root ?? null;
    let frame = 0;
    let last: { range: TocRange; up: boolean } | null = null;
    const update = () => {
      frame = 0;
      const base = container ? container.getBoundingClientRect().top : 0;
      const viewport = container ? container.clientHeight : innerHeight;
      const tops = els.map((el) => (el ? el.getBoundingClientRect().top - base : null));
      const next = activeRange(tops, scrollOffset, viewport);
      if (last && next[0] === last.range[0] && next[1] === last.range[1]) return;
      last = { range: next, up: movedUp(last?.range ?? null, next, last?.up ?? false) };
      setSpied(last);
      onChangeRef.current?.(idsInRange(items, next));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const target: HTMLElement | Window = container ?? window;
    update();
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items, root, scrollOffset]);

  const range = (activeIds && rangeFromIds(items, activeIds)) ?? spied?.range ?? null;
  const thumb = track && range ? cssVars(thumbStyle(track, range, spied?.up ?? false)) : {};

  return (
    <nav ref={listRef} aria-label={label} className={cn(styles.root(), className)}>
      {track ? (
        <div
          aria-hidden="true"
          className={styles.accent()}
          style={{ width: track.width, height: track.height, ...thumb }}
        >
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${track.width} ${track.height}`}
            className={styles.accentRail()}
            style={{
              width: track.width,
              height: track.height,
              clipPath:
                "polygon(0 var(--track-top,0), 100% var(--track-top,0), 100% var(--track-bottom,0), 0 var(--track-bottom,0))",
            }}
          >
            <path d={track.d} className="stroke-primary" strokeWidth={1} fill="none" />
          </svg>
          <div className={styles.dot()} style={{ offsetPath: `path('${track.d}')` }} />
        </div>
      ) : null}
      {items.map((item, i) => {
        const r = itemRail(items, i, curve);
        const current = range !== null && i >= range[0] && i <= range[1];
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={current ? "location" : undefined}
            className={cn(styles.link(), i === 0 && "pt-0", i === items.length - 1 && "pb-0")}
            style={{ paddingInlineStart: itemPad(item.depth) }}
          >
            <svg
              aria-hidden="true"
              className={cn(styles.rail(), r.l1 !== r.l2 && "bottom-1.5 h-full")}
              style={{ width: Math.max(r.l0, r.l1) + 9 }}
            >
              {r.bend ? <path d={r.bend} strokeWidth={1} fill="none" className={styles.railLine()} /> : null}
              <line
                x1={r.l1 + 0.5}
                y1={r.l0 === r.l1 ? 6 : 12}
                x2={r.l1 + 0.5}
                y2="100%"
                strokeWidth={1}
                className={styles.railLine()}
              />
            </svg>
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
