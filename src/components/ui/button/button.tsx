import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { type ButtonSize, type ButtonVariant, button, isIconSize } from "./variants";

type Base = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
  children?: ReactNode;
  className?: string;
};

export type ButtonProps = Base &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Base>)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Base>)
  );

// The hidden face leaves the flow, so the button is sized by what it shows, not by "Loading…".
const FACE =
  "col-start-1 row-start-1 flex items-center justify-center gap-2 whitespace-nowrap transition-[opacity,transform,scale,translate,filter] duration-(--duration-base) ease-[var(--ease-out)] motion-reduce:transition-none data-[on=false]:pointer-events-none data-[on=false]:absolute data-[on=false]:inset-0 data-[on=false]:translate-y-[3px] data-[on=false]:opacity-0 data-[on=false]:blur-[3px]";

function Faces({ loading, loadingLabel, size, children }: Required<Pick<Base, "loading">> & Base) {
  return (
    <span className="relative grid place-items-center">
      <span className={FACE} data-on={!loading} aria-hidden={loading}>
        {children}
      </span>
      <span className={FACE} data-on={loading} aria-hidden={!loading}>
        <Spinner spinning={loading} />
        {isIconSize(size) ? <span className="sr-only">{loadingLabel}</span> : loadingLabel}
      </span>
    </span>
  );
}

function Spinner({ spinning }: { spinning: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="size-3.5 [animation:spin_850ms_linear_infinite] motion-reduce:animate-none"
      style={{ animationPlayState: spinning ? "running" : "paused" }}
    >
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" opacity="0.22" />
      <path d="M10.5 6A4.5 4.5 0 0 0 6 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Button(props: ButtonProps) {
  const { variant, size, loading = false, loadingLabel = "Loading…", children, className, ...rest } = props;

  const classes = cn(button({ variant, size }), className);
  const face = (
    <Faces loading={loading} loadingLabel={loadingLabel} size={size}>
      {children}
    </Faces>
  );

  if (rest.href !== undefined) {
    const anchor = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        data-slot="button"
        {...anchor}
        href={loading ? undefined : anchor.href}
        role={loading ? "link" : undefined}
        tabIndex={loading ? 0 : anchor.tabIndex}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={loading || undefined}
        data-variant={variant}
        data-size={size}
        onClick={(e) => {
          if (loading) return e.preventDefault();
          anchor.onClick?.(e);
        }}
        onKeyDown={(e) => {
          // Anchors don't activate on Space natively; the spec requires that they do.
          if (e.key === " ") {
            e.preventDefault();
            e.currentTarget.click();
          }
          anchor.onKeyDown?.(e);
        }}
      >
        {face}
      </a>
    );
  }

  const btn = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      data-slot="button"
      {...btn}
      type={btn.type ?? "button"}
      className={classes}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      data-variant={variant}
      data-size={size}
      onClick={(e) => {
        if (loading) return e.preventDefault();
        btn.onClick?.(e);
      }}
    >
      {face}
    </button>
  );
}
