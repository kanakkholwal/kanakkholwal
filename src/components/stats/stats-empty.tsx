import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Icon, type IconType } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/** The shape of the visual that would have filled the slot, drawn faintly behind the message. */
export type EmptyGhost = "grid" | "chart" | "calendar" | "list";

const GHOST_HEIGHT: Record<EmptyGhost, string> = {
  grid: "min-h-44",
  chart: "min-h-72",
  calendar: "min-h-60",
  list: "min-h-56",
};

const BAR_HEIGHTS = [38, 54, 46, 70, 58, 82, 64, 90, 72, 60, 78, 50, 66, 44, 56, 40];
const TINT = "bg-foreground/[0.045]";

function Ghost({ kind }: { kind: EmptyGhost }) {
  if (kind === "chart") {
    return (
      <div className="flex h-full items-end gap-2 px-8 pt-16 pb-6">
        {BAR_HEIGHTS.map((h) => (
          <span key={h} className={cn("flex-1 rounded-t-md", TINT)} style={{ height: `${h}%` }} />
        ))}
      </div>
    );
  }
  if (kind === "calendar") {
    return (
      <div className="grid h-full grid-flow-col grid-rows-7 gap-1.5 p-6">
        {Array.from({ length: 7 * 34 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: a static decorative grid never reorders.
          <span key={i} className={cn("rounded-[3px]", TINT)} style={{ opacity: 0.4 + ((i * 7) % 10) / 16 }} />
        ))}
      </div>
    );
  }
  if (kind === "list") {
    return (
      <div className="flex flex-col gap-3 p-8">
        {[88, 72, 80, 64].map((w) => (
          <div key={w} className="flex items-center gap-3">
            <span className={cn("size-6 shrink-0 rounded-full", TINT)} />
            <span className={cn("h-3 rounded-full", TINT)} style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid h-full grid-cols-2 gap-px sm:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col justify-center gap-2 p-5">
          <span className={cn("h-2.5 w-16 rounded-full", TINT)} />
          <span className={cn("h-6 w-24 rounded-md", TINT)} />
        </div>
      ))}
    </div>
  );
}

function Retry({ onRetry }: { onRetry?: () => void }) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        onRetry?.();
        router.invalidate();
      }}
    >
      Try again
    </Button>
  );
}

/** A deliberate blank: a ghost of the missing visual, what is missing and why, and a way to retry. */
export function StatsEmpty({
  icon,
  title,
  description,
  children,
  ghost = "chart",
  retry = false,
  className,
}: {
  icon: IconType;
  title: string;
  description: ReactNode;
  children?: ReactNode;
  ghost?: EmptyGhost;
  /** Shows "Try again", which reloads the route data; a function also runs first (e.g. a boundary reset). */
  retry?: boolean | (() => void);
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "relative isolate flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-border border-dashed",
        GHOST_HEIGHT[ghost],
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,transparent_25%,black_100%)]"
      >
        <Ghost kind={ghost} />
      </div>
      <div className="flex max-w-sm flex-col items-center gap-2 p-8 text-center">
        <span className="mb-1 flex size-10 items-center justify-center rounded-xl bg-card shadow-surface [&_svg]:size-5">
          <Icon name={icon} />
        </span>
        <p className="font-medium text-base text-foreground tracking-tight">{title}</p>
        <p className="text-pretty text-muted-foreground text-sm/relaxed">{description}</p>
        {children || retry ? (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            {retry ? <Retry onRetry={typeof retry === "function" ? retry : undefined} /> : null}
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
