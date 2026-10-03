"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/cn";
import { ensureRevealStyle, runThemeReveal, supportsViewTransition } from "./reveal";
import { type ThemeToggleStart, type ThemeToggleValue, type ThemeToggleVariant, themeToggle } from "./variants";

export type { ThemeToggleStart, ThemeToggleValue, ThemeToggleVariant };

export interface ThemeToggleProps {
  /** Controlled: which theme is active. Omit to let the component own it. */
  theme?: ThemeToggleValue;
  defaultTheme?: ThemeToggleValue;
  onThemeChange?: (theme: ThemeToggleValue) => void;
  /** Which page-wide reveal plays when the theme flips. */
  variant?: ThemeToggleVariant;
  /** Origin corner/edge the reveal grows from. */
  start?: ThemeToggleStart;
  className?: string;
  iconClassName?: string;
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 1v1.4M8 13.6V15M15 8h-1.4M2.4 8H1M12.6 3.4l-1 1M4.4 11.6l-1 1M12.6 12.6l-1-1M4.4 4.4l-1-1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M13.8 9.7A6 6 0 1 1 6.3 2.2a5 5 0 0 0 7.5 7.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThemeToggle({
  theme: themeProp,
  defaultTheme = "light",
  onThemeChange,
  variant = "rectangle",
  start = "bottom-up",
  className,
  iconClassName,
}: ThemeToggleProps) {
  const [internalTheme, setInternalTheme] = useState(defaultTheme);
  const theme = themeProp ?? internalTheme;
  const isDark = theme === "dark";

  useEffect(ensureRevealStyle, []);

  function setTheme(next: ThemeToggleValue) {
    if (themeProp === undefined) setInternalTheme(next);
    onThemeChange?.(next);
  }

  function toggle() {
    const next: ThemeToggleValue = isDark ? "light" : "dark";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !supportsViewTransition()) {
      setTheme(next);
      return;
    }

    // The new snapshot is taken when the callback returns, so the DOM must already be updated.
    runThemeReveal(variant, start, () => flushSync(() => setTheme(next)));
  }

  return (
    <button
      type="button"
      data-slot="theme-toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={cn(themeToggle({ variant, start }), className)}
    >
      <span key={theme} className="theme-toggle-icon">
        {isDark ? <SunIcon className={iconClassName} /> : <MoonIcon className={iconClassName} />}
      </span>
    </button>
  );
}
