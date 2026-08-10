"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // h-10 matches Button size="default" so a field and its submit align.
          "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2",
          // 16px on touch keeps iOS from zooming the viewport on focus.
          "text-base md:text-sm",
          "placeholder:text-subtle-foreground",
          "transition-[border-color,outline-color] duration-150 ease-out",
          // 2px, full opacity. `ring-1` was invisible against every surface.
          "outline-none focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "aria-invalid:border-destructive aria-invalid:outline-destructive",
          "disabled:cursor-not-allowed disabled:opacity-55",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
