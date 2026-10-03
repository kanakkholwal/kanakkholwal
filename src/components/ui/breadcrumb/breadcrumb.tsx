import { type ComponentProps, createContext, useContext } from "react";
import { cn } from "@/lib/cn";
import { type BreadcrumbSize, type BreadcrumbVariant, breadcrumb } from "./variants";

export type { BreadcrumbSize, BreadcrumbVariant };

const StyleCtx = createContext<{ variant: BreadcrumbVariant; size: BreadcrumbSize }>({
  variant: "default",
  size: "md",
});

const useStyles = () => breadcrumb(useContext(StyleCtx));

/** Part names and data-slot values follow shadcn/ui, so this drops into an existing project. */
export function Breadcrumb({
  className,
  variant = "default",
  size = "md",
  ...props
}: ComponentProps<"nav"> & { variant?: BreadcrumbVariant; size?: BreadcrumbSize }) {
  return (
    <StyleCtx.Provider value={{ variant, size }}>
      <nav
        aria-label="Breadcrumb"
        data-slot="breadcrumb"
        data-variant={variant}
        className={cn(breadcrumb({ variant, size }).root(), className)}
        {...props}
      />
    </StyleCtx.Provider>
  );
}

export function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return <ol data-slot="breadcrumb-list" className={cn(useStyles().list(), className)} {...props} />;
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn(useStyles().item(), className)} {...props} />;
}

export function BreadcrumbLink({ className, ...props }: ComponentProps<"a">) {
  return <a data-slot="breadcrumb-link" className={cn(useStyles().link(), className)} {...props} />;
}

export function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return (
    <span aria-current="page" data-slot="breadcrumb-page" className={cn(useStyles().page(), className)} {...props} />
  );
}

export function BreadcrumbSeparator({ className, children, ...props }: ComponentProps<"li">) {
  return (
    <li
      role="presentation"
      aria-hidden
      data-slot="breadcrumb-separator"
      className={cn(useStyles().separator(), className)}
      {...props}
    >
      {children ?? (
        <svg viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M5.5 3.5 9 7l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </li>
  );
}

/** Put it inside a DropdownMenuTrigger to open the hidden levels, as shadcn/ui does. */
export function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      role="presentation"
      aria-hidden
      data-slot="breadcrumb-ellipsis"
      className={cn(useStyles().ellipsis(), className)}
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <circle cx="5" cy="12" r="1.75" />
        <circle cx="12" cy="12" r="1.75" />
        <circle cx="19" cy="12" r="1.75" />
      </svg>
      <span className="sr-only">More</span>
    </span>
  );
}
