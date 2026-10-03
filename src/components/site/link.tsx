import type { ComponentProps, ReactNode } from "react";
import { Icon } from "@/components/icons";
import Link from "@/components/link";
import { Marker } from "@/components/text/marker";
import { type ButtonSize, type ButtonVariant, button } from "@/components/ui/button/variants";
import { cn } from "@/lib/cn";

const EXTERNAL = /^(https?:|mailto:|tel:|\/\/)/;

export const isExternal = (href: string) => EXTERNAL.test(href);

/** Router-aware link styled as a baby-ui button; external targets open in a new tab. */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  const external = isExternal(href) && !href.startsWith("mailto:");
  return (
    <Link
      href={href}
      data-slot="button"
      className={cn(button({ variant, size }), className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}

/** Inline text link whose arrow leans toward where it goes. */
export function ArrowLink({
  href,
  children,
  className,
  ...props
}: Omit<ComponentProps<typeof Link>, "href" | "children"> & { href: string; children: ReactNode }) {
  const external = isExternal(href);
  return (
    <Link
      href={href}
      className={cn(
        "group/arrow inline-flex items-center gap-0.5 text-muted-foreground transition-colors hoverable:text-foreground",
        className,
      )}
      {...(external && !href.startsWith("mailto:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
      <Icon
        name={external ? "arrow-up-right" : "arrow-right"}
        className={cn(
          "size-3.5 transition-transform duration-(--duration-fast) ease-(--ease-out)",
          external
            ? "group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5"
            : "group-hover/arrow:translate-x-0.5",
        )}
      />
    </Link>
  );
}

// Marker can't wrap across lines, so only short labels get the drawn underline.
const MARKER_MAX = 28;

/** Inline link for running text: short labels get a hand-drawn accent underline that draws in on view. */
export function TextLink({
  href,
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const external = isExternal(href) && !href.startsWith("mailto:");
  const drawn = typeof children === "string" && children.length <= MARKER_MAX;
  return (
    <Link
      href={href}
      className={cn(
        "font-medium text-foreground transition-colors hoverable:text-accent-ink",
        !drawn &&
          "underline decoration-border-strong underline-offset-[3px] transition-[color,text-decoration-color] hoverable:decoration-accent-ink",
        className,
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {drawn ? (
        <Marker variant="underline" tone="primary" durationMs={650}>
          {children}
        </Marker>
      ) : (
        children
      )}
    </Link>
  );
}
