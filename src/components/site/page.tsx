import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** The one content column every page shares. */
export function Page({ className, ...props }: ComponentProps<"main">) {
  return (
    <main
      id="main"
      className={cn(
        "relative mx-auto w-full max-w-page px-5 pt-28 pb-24 sm:px-6 sm:pt-32 lg:mx-0 lg:max-w-none lg:px-10 lg:pt-12",
        className,
      )}
      {...props}
    />
  );
}

/** Pixel-face title; hovering morphs the pixel shape. Lowercase with a full stop, like a sentence. */
export function PixelHeading({
  as: Tag = "h2",
  className,
  children,
  ...props
}: ComponentProps<"h2"> & { as?: "h1" | "h2" | "h3" }) {
  return (
    <Tag className={cn("pixel cursor-default hoverable:[--elsh:60]", className)} {...props}>
      {children}
    </Tag>
  );
}

export function PageHeader({
  title,
  eyebrow,
  description,
  children,
  className,
}: {
  title: string;
  eyebrow?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("rise mb-14 flex flex-col gap-3", className)}>
      {eyebrow ? <p className="font-mono text-muted-foreground text-xs">{eyebrow}</p> : null}
      <PixelHeading as="h1" className="text-4xl">
        {title}
      </PixelHeading>
      {description ? <p className="max-w-prose text-base text-muted-foreground text-pretty">{description}</p> : null}
      {children}
    </header>
  );
}

/** A titled block; on desktop it opens with a dashed rule across the pane and a mono number. */
export function Section({
  id,
  title,
  number,
  description,
  meta,
  action,
  index = 0,
  className,
  children,
}: {
  id?: string;
  title: string;
  number?: number;
  description?: string;
  meta?: ReactNode;
  action?: ReactNode;
  index?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={cn(
        "rise scroll-mt-24 lg:-mx-10 lg:border-border lg:border-t lg:border-dashed lg:px-10 lg:pt-10",
        className,
      )}
      style={{ "--i": index } as CSSProperties}
    >
      <div className="mb-5 flex min-h-8 items-center justify-between gap-4">
        <div className="flex min-w-0 items-baseline gap-2.5">
          {number !== undefined ? (
            <span className="font-mono text-accent-ink text-xs tabular-nums">{String(number).padStart(2, "0")}</span>
          ) : null}
          <PixelHeading id={id ? `${id}-title` : undefined} className="shrink-0 text-2xl">
            {title}
          </PixelHeading>
          {meta ? <span className="font-mono text-muted-foreground text-xs tabular-nums">{meta}</span> : null}
          {description ? (
            <span className="hidden truncate text-muted-foreground text-sm md:inline">{description}</span>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

/** Mono, muted label for dates, counts and other metadata. */
export function Meta({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("font-mono text-muted-foreground text-xs tabular-nums", className)} {...props} />;
}

/** The framed well from the reference: a card rim around a raised body. */
export function Well({ className, children, footer }: { className?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className={cn("rounded-2xl bg-card p-1", className)}>
      <div className="rounded-xl bg-background p-4 shadow-(--surface-shadow) dark:bg-popover">{children}</div>
      {footer ? <div className="px-3 pt-3 pb-2">{footer}</div> : null}
    </div>
  );
}
