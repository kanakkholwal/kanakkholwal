import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { Icon } from "@/components/icons";
import { button } from "@/components/ui/button/variants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip/tooltip";
import { cn } from "@/lib/cn";
import { IconRoll } from "./icon-roll";

export const ACCENTS = [
  { id: "neutral", name: "Neutral", swatch: "oklch(35% 0 0)" },
  { id: "blue", name: "Blue", swatch: "oklch(55% 0.18 255)" },
  { id: "violet", name: "Violet", swatch: "oklch(55% 0.2 290)" },
  { id: "green", name: "Green", swatch: "oklch(53% 0.14 150)" },
  { id: "amber", name: "Amber", swatch: "oklch(74% 0.15 70)" },
  { id: "rose", name: "Rose", swatch: "oklch(57% 0.2 12)" },
  { id: "teal", name: "Teal", swatch: "oklch(53% 0.092 185)" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];

const STORAGE_KEY = "accent";
const EVENT = "accentchange";
export const DEFAULT_ACCENT: AccentId = "neutral";

/** Runs in <head> before paint, so a saved accent never flashes the default first. */
export const ACCENT_BOOT_SCRIPT = `try{var a=localStorage.getItem("${STORAGE_KEY}");if(a)document.documentElement.dataset.accent=a}catch(e){}`;

const read = (): AccentId => (document.documentElement.dataset.accent as AccentId | undefined) ?? DEFAULT_ACCENT;

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

export function useAccent() {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_ACCENT);
}

/** Crossfades the page into the new accent; reduced motion and old browsers just switch. */
export function setAccent(id: AccentId) {
  const root = document.documentElement;
  const apply = () => {
    root.dataset.accent = id;
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {}
    flushSync(() => window.dispatchEvent(new Event(EVENT)));
  };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("startViewTransition" in document)) return apply();
  root.dataset.themeReveal = "accent";
  const t = document.startViewTransition(apply);
  t.finished.finally(() => delete root.dataset.themeReveal);
}

/** Swatches as a radio group; the picked one wears a ring that grows in. */
export function AccentSwatches({ className }: { className?: string }) {
  const accent = useAccent();
  return (
    <div role="radiogroup" aria-label="Accent colour" className={cn("grid grid-cols-7 gap-1.5", className)}>
      {ACCENTS.map((a) => {
        const on = a.id === accent;
        return (
          <Tooltip key={a.id}>
            <TooltipTrigger
              render={
                // biome-ignore lint/a11y/useSemanticElements: a swatch row is a radiogroup of buttons, not form inputs.
                <button
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={a.name}
                  onClick={() => setAccent(a.id)}
                />
              }
              className={cn(
                "size-7 items-center justify-center rounded-full outline-none",
                "transition-[scale,box-shadow] duration-(--duration-fast) ease-(--ease-out) active:scale-(--press-scale-icon)",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover",
                on ? "shadow-[0_0_0_2px_var(--popover),0_0_0_3.5px_currentColor]" : "hoverable:scale-110",
              )}
              style={{ backgroundColor: a.swatch, color: a.swatch }}
            >
              <Icon
                name="check"
                className={cn(
                  "size-3.5 text-white transition-[opacity,scale] duration-(--duration-fast) ease-(--ease-out)",
                  on ? "scale-100 opacity-100" : "scale-50 opacity-0",
                  a.id === "amber" && "text-black/80",
                )}
              />
            </TooltipTrigger>
            <TooltipContent>{a.name}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

const ICON_BUTTON = cn(button({ variant: "ghost", size: "icon-sm" }), "text-foreground");

export function AccentPicker() {
  const accent = useAccent();
  const current = ACCENTS.find((a) => a.id === accent) ?? ACCENTS[0];
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger className={cn(ICON_BUTTON, "group/roll")} aria-label={`Accent colour, ${current.name}`} />
          }
        >
          <IconRoll name="palette" className="size-4" />
        </TooltipTrigger>
        <TooltipContent>Accent</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-auto p-3">
        <p className="mb-2.5 flex items-baseline justify-between gap-6 text-xs">
          <span className="font-medium text-foreground">Accent</span>
          <span className="text-muted-foreground">{current.name}</span>
        </p>
        <AccentSwatches />
      </PopoverContent>
    </Popover>
  );
}
