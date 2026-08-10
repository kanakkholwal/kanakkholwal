"use client";

/**
 * Stands in for a project screenshot. Reads as a poster: the project name set as
 * the artwork itself, anchored bottom-left over a dot field.
 *
 * One brand colour, not a per-title hash. The old version picked from five
 * hard-coded hexes that were theme-blind and unmeasured.
 */
export function ProjectFallback({
  title,
  meta,
}: {
  title: string;
  /** Small line under the name — dates, usually. Omit where the surrounding
   * card already shows it, or it prints twice. */
  meta?: string;
}) {
  return (
    <div className="relative flex size-full flex-col justify-end overflow-hidden bg-muted p-6">
      {/* 10%, matching the hero and the contribution section. It was 18% here —
          visible enough to read as texture behind the type rather than under it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--foreground) 10%, transparent) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* The same rule that opens the hero eyebrow, so the placeholder speaks the
          variant's language instead of inventing a badge. The monogram it
          replaces restated the first letter of the word sitting next to it, and
          measured 3.77:1 on its own primary/12 chip. */}
      <div aria-hidden="true" className="relative mb-4 h-0.5 w-8 bg-primary" />

      <p className="relative text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground line-clamp-3 md:text-3xl">
        {title}
      </p>

      {meta && (
        // muted, not subtle: subtle is tuned against `background` and reads
        // 4.25:1 on `muted`.
        <p className="relative mt-2 font-mono text-2xs uppercase tracking-widest text-muted-foreground">
          {meta}
        </p>
      )}
    </div>
  );
}
