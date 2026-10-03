"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  iconOnly?: boolean;
  className?: string;
}

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  iconOnly = false,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFailed(false);
    } catch {
      // Clipboard access is denied outside a secure context; say so rather than lying.
      setFailed(true);
    }
    timer.current = setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={iconOnly ? (copied ? copiedLabel : label) : undefined}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card font-medium text-muted-foreground text-xs transition-[color,transform,scale,translate] duration-[var(--duration-press)] ease-[var(--ease-out)] hover:text-foreground active:scale-[var(--press-scale)]",
        iconOnly ? "w-8 justify-center" : "px-2.5",
        className,
      )}
    >
      {copied ? (
        <svg viewBox="0 0 14 14" fill="none" aria-hidden className="size-3.5">
          <path
            d="M3 7.4 5.6 10 11 4.2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 14 14" fill="none" aria-hidden className="size-3.5">
          <rect x="4.5" y="4.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M9.5 2.5H3.1A1.6 1.6 0 0 0 1.5 4.1v6.4"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      )}
      {!iconOnly ? (failed ? "Press Ctrl+C" : copied ? copiedLabel : label) : null}
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  );
}
