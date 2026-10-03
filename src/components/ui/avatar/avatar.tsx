"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { type AvatarShape, type AvatarSize, avatar } from "./variants";

export type { AvatarShape, AvatarSize };

export function Avatar({
  className,
  size = "md",
  shape = "circle",
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: AvatarSize;
  shape?: AvatarShape;
}) {
  return <AvatarPrimitive.Root data-slot="avatar" className={cn(avatar({ size, shape }), className)} {...props} />;
}

export function AvatarImage({ className, src, ...props }: ComponentProps<typeof AvatarPrimitive.Image>) {
  if (!src) return null;

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      src={src}
      // keepMounted keeps our own opacity fade (Base UI's default mode skips straight
      // to mounted-when-loaded, with no fade of its own to preserve).
      keepMounted
      className={cn(
        "absolute inset-0 size-full object-cover opacity-100 transition-opacity duration-(--duration-base) ease-[var(--ease-out)] data-[loading]:opacity-0 data-[error]:hidden motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarFallback({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("font-medium text-muted-foreground select-none", className)}
      {...props}
    />
  );
}
