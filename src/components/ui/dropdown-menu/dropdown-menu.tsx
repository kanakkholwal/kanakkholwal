"use client";

import { Menu } from "@base-ui/react/menu";
import type { ComponentProps } from "react";
import { ANCHORED } from "@/lib/anchor";
import { cn } from "@/lib/cn";
import { type MenuItemVariant, menu } from "@/lib/menu";

export const DropdownMenu = Menu.Root;
export const DropdownMenuSub = Menu.SubmenuRoot;

export function DropdownMenuTrigger({ className, ...props }: ComponentProps<typeof Menu.Trigger>) {
  return (
    <Menu.Trigger
      data-slot="dropdown-menu-trigger"
      className={cn("inline-flex rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      {...props}
    />
  );
}

export function DropdownMenuContent({
  className,
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof Menu.Popup> &
  Pick<ComponentProps<typeof Menu.Positioner>, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50 outline-none"
      >
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={cn(ANCHORED, "static", menu().surface(), className)}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export function DropdownMenuItem({
  className,
  destructive = false,
  inset = false,
  ...props
}: ComponentProps<typeof Menu.Item> & {
  destructive?: boolean;
  inset?: boolean;
}) {
  const variant: MenuItemVariant = destructive ? "destructive" : "default";

  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      data-inset={inset || undefined}
      className={cn(menu({ variant }).item(), className)}
      {...props}
    />
  );
}

export function DropdownMenuCheckboxItem({ className, children, ...props }: ComponentProps<typeof Menu.CheckboxItem>) {
  const styles = menu();
  return (
    <Menu.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset=""
      className={cn(styles.item(), className)}
      {...props}
    >
      {/* Kept mounted so the tick can draw in and back out with the row's data-checked. */}
      <Menu.CheckboxItemIndicator keepMounted className={styles.indicator()}>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className={styles.check()}>
          <path
            d="m3.5 8.5 3 3 6-7"
            pathLength={1}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Menu.CheckboxItemIndicator>
      {children}
    </Menu.CheckboxItem>
  );
}

export function DropdownMenuShortcut({ className, ...props }: ComponentProps<"kbd">) {
  return <kbd data-slot="dropdown-menu-shortcut" className={cn(menu().shortcut(), className)} {...props} />;
}

export function DropdownMenuLabel({ className, inset = false, ...props }: ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-label"
      data-inset={inset || undefined}
      className={cn("px-2.5 py-1.5 font-medium text-muted-foreground text-xs data-[inset]:pl-8", className)}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof Menu.Separator>) {
  return (
    <Menu.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 border-border", className)}
      {...props}
    />
  );
}

export function DropdownMenuSubTrigger({
  className,
  inset = false,
  children,
  closeDelay = 200,
  ...props
}: ComponentProps<typeof Menu.SubmenuTrigger> & { inset?: boolean }) {
  return (
    <Menu.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset || undefined}
      closeDelay={closeDelay}
      className={cn(menu().item(), className)}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="ml-2 size-3.5 shrink-0 text-muted-foreground">
        <path
          d="m6 3.5 4.5 4.5L6 12.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Menu.SubmenuTrigger>
  );
}

export function DropdownMenuSubContent({
  className,
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  ...props
}: ComponentProps<typeof Menu.Popup> &
  Pick<ComponentProps<typeof Menu.Positioner>, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50 outline-none"
      >
        <Menu.Popup
          data-slot="dropdown-menu-sub-content"
          className={cn(ANCHORED, "static", menu().surface(), "min-w-40", className)}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}
