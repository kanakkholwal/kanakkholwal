"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { type GibberishTextSize, gibberishText } from "./variants";

export type { GibberishTextSize };

function randomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function Letter({ letter, speedMs, className }: { letter: string; speedMs: number; className?: string }) {
  const [display, setDisplay] = useState(letter);

  useEffect(() => {
    let count = Math.floor(Math.random() * 10) + 5;
    const interval = setInterval(() => {
      setDisplay(randomUpper());
      count--;
      if (count === 0) {
        setDisplay(letter);
        clearInterval(interval);
      }
    }, speedMs);
    return () => clearInterval(interval);
  }, [letter, speedMs]);

  return <span className={className}>{display === " " ? "\u00a0" : display}</span>;
}

export interface GibberishTextProps {
  /** Each character scrambles through random letters, then resolves to the real one. */
  text: string;
  /** Interval between scramble frames, in ms. */
  speedMs?: number;
  size?: GibberishTextSize;
  className?: string;
}

export function GibberishText({ text, speedMs = 24, size = "md", className }: GibberishTextProps) {
  const letterClass = cn(gibberishText({ size }), className);
  return (
    <span data-slot="gibberish-text">
      {text.split("").map((letter, index) => (
        <Letter key={index} letter={letter} speedMs={speedMs} className={letterClass} />
      ))}
    </span>
  );
}
