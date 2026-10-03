import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import {
  type EmptyLayout,
  type EmptyMediaTone,
  type EmptyMediaVariant,
  type EmptySize,
  type EmptyVariant,
  empty,
  emptyMedia,
} from "./variants";

export type { EmptyLayout, EmptyMediaTone, EmptyMediaVariant, EmptySize, EmptyVariant };

/** Part names and data-slot values follow shadcn/ui, so this drops into an existing project. */
export function Empty({
  className,
  variant = "default",
  layout = "vertical",
  size = "md",
  ...props
}: ComponentProps<"div"> & {
  variant?: EmptyVariant;
  layout?: EmptyLayout;
  size?: EmptySize;
}) {
  return (
    <div
      data-slot="empty"
      data-layout={layout}
      data-size={size}
      className={cn(empty({ variant, layout, size }).root(), className)}
      {...props}
    />
  );
}

export function EmptyHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="empty-header" className={cn(empty().header(), className)} {...props} />;
}

export function EmptyMedia({
  className,
  variant = "default",
  tone = "neutral",
  ...props
}: ComponentProps<"div"> & { variant?: EmptyMediaVariant; tone?: EmptyMediaTone }) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMedia({ variant, tone }), className)}
      {...props}
    />
  );
}

export function EmptyTitle({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="empty-title" className={cn(empty().title(), className)} {...props} />;
}

export function EmptyDescription({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="empty-description" className={cn(empty().description(), className)} {...props} />;
}

export function EmptyContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="empty-content" className={cn(empty().content(), className)} {...props} />;
}
