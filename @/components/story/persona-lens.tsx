"use client";

import { cn } from "@/lib/utils";
import useStorage from "@/hooks/use-storage";
import { motion } from "framer-motion";

export type Lens = "developer" | "founder" | "recruiter";

// One persisted lens shared across every surface (the /journey page and the
// homepage), so switching it anywhere keeps them in sync. `useStorage` syncs
// live within a tab and persists across route changes.
export function useStoryLens() {
  return useStorage<Lens>("story.lens", "developer");
}

export const LENSES: { id: Lens; label: string; blurb: string }[] = [
  { id: "developer", label: "Developer", blurb: "the stack and how it was built" },
  { id: "founder", label: "Founder", blurb: "the impact and what I owned" },
  { id: "recruiter", label: "Recruiter", blurb: "roles, dates, and skills at a glance" },
];

export function PersonaLens({
  value,
  onChange,
}: {
  value: Lens;
  onChange: (lens: Lens) => void;
}) {
  const current = LENSES.find((l) => l.id === value);

  return (
    <div className="space-y-2">
      <div
        role="radiogroup"
        aria-label="View this story as"
        className="inline-flex rounded-full border border-border/60 bg-card/50 p-1"
      >
        {LENSES.map((lens) => {
          const active = lens.id === value;
          return (
            <button
              key={lens.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(lens.id)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors bg-transparent",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="lens-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 -z-10 rounded-full bg-primary"
                />
              )}
              {lens.label}
            </button>
          );
        })}
      </div>
      <p className="px-1 text-xs text-muted-foreground">
        Reading for {current?.blurb}.
      </p>
    </div>
  );
}
