import { motion } from "framer-motion";
import { type ComponentType, lazy, Suspense } from "react";
import { cn } from "@/lib/utils";
import useStorage from "@/hooks/use-storage";
import type { StoryChapter } from "~/data/story/story.types";
import { useStoryChapters } from "~/data/story";

type VariantId = "cinematic" | "terminal" | "keynote";
type VariantProps = { chapters: StoryChapter[] };

const VARIANTS: { id: VariantId; label: string }[] = [
  { id: "cinematic", label: "Cinematic" },
  { id: "terminal", label: "Terminal" },
  { id: "keynote", label: "Keynote" },
];

// Loaders kept separate so the switcher can warm a chunk on hover before the
// user commits to it (bundle-preload).
const load: Record<VariantId, () => Promise<unknown>> = {
  cinematic: () => import("./variants/cinematic"),
  terminal: () => import("./variants/terminal"),
  keynote: () => import("./variants/keynote"),
};

// Only the active variant's chunk is ever downloaded (bundle-dynamic-imports,
// bundle-conditional).
const Variants: Record<VariantId, ComponentType<VariantProps>> = {
  cinematic: lazy(() => import("./variants/cinematic").then((m) => ({ default: m.StoryCinematic }))),
  terminal: lazy(() => import("./variants/terminal").then((m) => ({ default: m.StoryTerminal }))),
  keynote: lazy(() => import("./variants/keynote").then((m) => ({ default: m.StoryKeynote }))),
};

export function StoryExperience() {
  const chapters = useStoryChapters();
  const [variant, setVariant] = useStorage<VariantId>("story.variant.v1", "cinematic");

  const Active = Variants[variant];

  return (
    <>
      <VariantSwitcher value={variant} onChange={setVariant} />
      <motion.div
        key={variant}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <Suspense fallback={null}>
          <Active chapters={chapters} />
        </Suspense>
      </motion.div>
    </>
  );
}

function VariantSwitcher({
  value,
  onChange,
}: {
  value: VariantId;
  onChange: (id: VariantId) => void;
}) {
  return (
    <div className="fixed left-1/2 top-20 z-40 -translate-x-1/2">
      <div
        role="radiogroup"
        aria-label="Story format"
        className="flex rounded-full border border-border/60 bg-card/70 p-1 shadow-sm backdrop-blur-md"
      >
        {VARIANTS.map((item) => {
          const active = item.id === value;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(item.id)}
              onMouseEnter={() => load[item.id]()}
              onFocus={() => load[item.id]()}
              className={cn(
                "relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                active ? "text-primary-foreground" : "text-muted-foreground hoverable:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="variant-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-primary"
                />
              )}
              <span className="relative">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
