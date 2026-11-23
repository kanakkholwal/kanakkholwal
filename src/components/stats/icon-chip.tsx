import { Icon, type IconType } from "@/components/icons";
import { cn } from "@/lib/cn";

/** The small tinted tile that fronts a stat, a table or a section heading. */
export function IconChip({ name, className }: { name: IconType; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.05] text-foreground [&_svg]:size-4",
        className,
      )}
    >
      <Icon name={name} />
    </span>
  );
}
