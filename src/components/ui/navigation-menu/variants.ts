import { tv, type VariantProps } from "tailwind-variants";
import { popover } from "@/components/ui/popover/variants";

/** Trigger and top-level link look; shadcn's name, so shadcn blocks can import it. */
export const navigationMenuTriggerStyle = tv({
  base: [
    "group/navigation-menu-trigger inline-flex w-max items-center justify-center rounded-lg font-medium outline-none",
    // bg-muted matches card and popover surfaces, so the fill is a foreground tint like ghost buttons.
    "transition-[color,background-color,scale] [transition-duration:var(--duration-instant),var(--duration-instant),var(--duration-slow)] ease-[var(--ease-out-quart)]",
    "hover:bg-foreground/[0.06] focus-visible:ring-2 focus-visible:ring-ring active:scale-[var(--press-scale-sm)]",
    "data-[state=open]:bg-foreground/[0.06] data-[popup-open]:bg-foreground/[0.06]",
    "disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
  ],
  variants: {
    size: {
      sm: "h-8 px-2 text-xs",
      md: "h-9 px-2.5 text-sm",
    },
  },
  defaultVariants: { size: "md" },
});

export type NavigationMenuSize = NonNullable<VariantProps<typeof navigationMenuTriggerStyle>["size"]>;

/** The visual contract both ports share; motion is per primitive, as in shadcn's two ports. */
export const navigationMenu = tv({
  slots: {
    // h-fit: a stretched root (grid or flex parent) hung the panel far below the trigger.
    root: "group/navigation-menu relative flex h-fit min-w-0 max-w-max items-center justify-center",
    list: "group flex flex-1 list-none items-center justify-center gap-0",
    item: "relative",
    chevron: [
      "relative top-px ml-1 size-3 shrink-0 transition-transform duration-[var(--duration-overlay)] ease-[var(--ease-out)]",
      "group-data-[state=open]/navigation-menu-trigger:rotate-180",
      "group-data-[popup-open]/navigation-menu-trigger:rotate-180 motion-reduce:transition-none",
    ],
    content: "p-2 **:data-[slot=navigation-menu-link]:focus:ring-0",
    // Popover's own surface, so the panel and every popover look the same.
    viewport: [popover().surface(), "overflow-hidden"],
    // The panel's rows follow the menu row contract: tint on hover and focus, squish on press.
    link: [
      "flex flex-col gap-0.5 rounded-md p-2 text-sm outline-none",
      "transition-[background-color,scale] [transition-duration:var(--duration-instant),var(--duration-slow)] ease-[var(--ease-out-quart)]",
      "hover:bg-foreground/[0.06] focus:bg-foreground/[0.06] active:scale-[var(--press-scale-row)]",
      "data-[active]:bg-foreground/[0.06] aria-[current=page]:bg-foreground/[0.06] motion-reduce:transition-none",
    ],
    indicator: "top-full z-10 flex h-1.5 items-end justify-center overflow-hidden",
    indicatorArrow: "relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-border shadow-md",
  },
});
