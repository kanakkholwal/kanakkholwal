import { type CSSProperties, createElement, type ElementType, Fragment } from "react";
import { cn } from "@/lib/cn";
import { TEXT_TRANSITION_PRESETS, type TextTransitionPreset } from "./presets";
import { type TextTransitionVariant, textTransition } from "./variants";

export type { TextTransitionVariant };

export interface TextTransitionProps {
  /** Replaying the animation is driven by this value changing, not a timer. */
  text: string;
  variant?: TextTransitionVariant;
  /** Overrides the preset's own duration, in ms. */
  durationMs?: number;
  /** Overrides the preset's own per-unit stagger, in ms. */
  staggerMs?: number;
  as?: ElementType;
  className?: string;
}

function unitStyle(preset: TextTransitionPreset, index: number): CSSProperties {
  return {
    "--tt-duration": `${preset.durationMs}ms`,
    "--tt-delay": `${index * preset.staggerMs}ms`,
    "--tt-ease": preset.easing ?? "var(--ease-out)",
    "--tt-from-opacity": preset.from.opacity ?? 1,
    "--tt-from-x": preset.from.x ?? "0px",
    "--tt-from-y": preset.from.y ?? "0px",
    "--tt-from-scale": preset.from.scale ?? 1,
    "--tt-from-blur": preset.from.blur ?? "0px",
    "--tt-from-rotate": preset.from.rotate ?? "0deg",
  } as CSSProperties;
}

export function TextTransition({
  text,
  variant = "blur-out-up",
  durationMs,
  staggerMs,
  as = "span",
  className,
}: TextTransitionProps) {
  const basePreset = TEXT_TRANSITION_PRESETS[variant];
  const preset =
    durationMs === undefined && staggerMs === undefined
      ? basePreset
      : {
          ...basePreset,
          durationMs: durationMs ?? basePreset.durationMs,
          staggerMs: staggerMs ?? basePreset.staggerMs,
        };

  let nodes: React.ReactNode;
  if (preset.target === "whole") {
    nodes = (
      <span key={`${text}-${variant}`} className="text-transition-unit inline-block" style={unitStyle(preset, 0)}>
        {text}
      </span>
    );
  } else if (preset.target === "word") {
    const words = text.trim().split(/\s+/);
    nodes = words.map((word, index) => (
      <Fragment key={`${text}-${variant}-${index}-${word}`}>
        {index > 0 ? " " : null}
        <span className="text-transition-unit inline-block" style={unitStyle(preset, index)}>
          {word}
        </span>
      </Fragment>
    ));
  } else {
    nodes = [...text].map((char, index) =>
      char.trim() === "" ? (
        <Fragment key={`${text}-${variant}-${index}`}>{char}</Fragment>
      ) : (
        <span
          key={`${text}-${variant}-${index}`}
          className="text-transition-unit inline-block"
          style={unitStyle(preset, index)}
        >
          {char}
        </span>
      ),
    );
  }

  return createElement(
    as,
    {
      "data-slot": "text-transition",
      className: cn(textTransition({ variant }), className),
    },
    nodes,
  );
}
