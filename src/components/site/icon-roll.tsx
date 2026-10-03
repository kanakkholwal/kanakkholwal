import { Icon, type IconType } from "@/components/icons";
import { cn } from "@/lib/cn";

/** RollText's motion for a glyph: on `group/roll` hover the icon slides up and a copy rises in. */
export function IconRoll({ name, className }: { name: IconType; className?: string }) {
  return (
    <span aria-hidden className={cn("relative inline-flex shrink-0 overflow-hidden", className)}>
      <span
        className={cn(
          "flex size-full flex-col transition-[translate] duration-(--duration-slow) ease-(--ease-out) motion-reduce:transition-none",
          "pointer-fine:group-hover/roll:-translate-y-1/2 group-focus-visible/roll:-translate-y-1/2",
        )}
        style={{ height: "200%" }}
      >
        {/* `!` beats button recipes that size every svg inside them with `[&_svg]:size-*`. */}
        <Icon name={name} className="h-1/2! w-full! shrink-0" />
        <Icon name={name} className="h-1/2! w-full! shrink-0" />
      </span>
    </span>
  );
}
