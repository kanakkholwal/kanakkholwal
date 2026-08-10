"use client";

/**
 * Branded placeholder shown when a project has no image/video. Reads like an OG
 * card: a monogram + wordmark lockup with the project's tagline underneath.
 *
 * One brand colour, not a per-title hash. The old version picked from five
 * hard-coded hexes that were theme-blind and unmeasured — every new project
 * silently drew a colour nobody had checked against either background.
 */
export function ProjectFallback({
  title,
  description,
  meta,
}: {
  title: string;
  description?: string;
  /** Optional small line under the tagline (e.g. dates) — only pass it when the
   * surrounding card doesn't already show this info. */
  meta?: string;
}) {
  const initial = title.trim().charAt(0).toUpperCase() || "•";

  return (
    <div className="relative flex size-full flex-col items-center justify-center overflow-hidden bg-muted px-8 text-center">
      {/* Dotted grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--foreground) 18%, transparent) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Logo lockup: monogram + wordmark */}
      <div className="relative z-10 flex items-center justify-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/35 bg-primary/12 text-lg font-bold text-primary">
          {initial}
        </div>
        <span className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
          {title}
        </span>
      </div>

      {/* Tagline */}
      {description && (
        <p className="relative z-10 mt-4 line-clamp-2 max-w-[85%] font-mono text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}

      {/* Optional meta (e.g. dates) */}
      {meta && (
        <p className="relative z-10 mt-3 font-mono text-2xs uppercase tracking-widest text-subtle-foreground">
          {meta}
        </p>
      )}
    </div>
  );
}
