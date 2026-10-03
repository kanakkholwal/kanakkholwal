"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Command as CommandPrimitive, defaultFilter, useCommandState } from "cmdk";
import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { dialogFrame } from "@/components/ui/dialog/variants";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip/tooltip";
import { cn } from "@/lib/cn";
import { offsetBox, type PillBox, pillStyle, pressedBox } from "@/lib/pill";
import { rankCommandMatch } from "./score";
import { type CommandVariant, commandFrame } from "./variants";

export type { CommandVariant };

type CommandHeaderContent = { children?: ReactNode; className?: string } | null;

/** CommandHeader hoists here so CommandDialog can render it in the rim above the card. */
const CommandHeaderCtx = createContext<((header: CommandHeaderContent) => void) | null>(null);

/** Set by CommandDialog; a bare Command reads its own prop instead. */
const DialogVariantCtx = createContext<CommandVariant | null>(null);

/** The resolved variant every part styles itself from. */
const CommandVariantCtx = createContext<CommandVariant>("default");

function useStyles() {
  const variant = useContext(CommandVariantCtx);
  return { variant, styles: commandFrame({ variant }) };
}

/** The `KeyboardEvent.key` behind each glyph a hint may show. */
const KEY_NAME: Record<string, string> = {
  "↑": "ArrowUp",
  "↓": "ArrowDown",
  "←": "ArrowLeft",
  "→": "ArrowRight",
  "↵": "Enter",
  Esc: "Escape",
  Tab: "Tab",
};

const rankedFilter = (value: string, search: string, keywords?: string[]) =>
  rankCommandMatch(defaultFilter(value, search, keywords), value, search);

export function Command({
  className,
  variant: variantProp,
  filter = rankedFilter,
  ...props
}: ComponentProps<typeof CommandPrimitive> & { variant?: CommandVariant }) {
  const dialogVariant = useContext(DialogVariantCtx);
  const variant = variantProp ?? dialogVariant ?? "default";

  return (
    <CommandVariantCtx.Provider value={variant}>
      <CommandPrimitive
        data-slot="command"
        data-variant={variant}
        filter={filter}
        className={cn(commandFrame({ variant }).body(), className)}
        {...props}
      />
    </CommandVariantCtx.Provider>
  );
}

export function CommandDialog({
  className,
  open,
  label = "Command palette",
  description = "Search for a command to run…",
  variant = "default",
  children,
  onOpenChange,
}: {
  className?: string;
  open: boolean;
  label?: string;
  description?: string;
  variant?: CommandVariant;
  children?: ReactNode;
  onOpenChange: (open: boolean) => void;
}) {
  const [header, setHeader] = useState<CommandHeaderContent>(null);
  const styles = commandFrame({ variant });

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => onOpenChange(next)}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          data-slot="command-dialog-backdrop"
          className={cn(dialogFrame().backdrop(), "backdrop-blur-md backdrop-saturate-150")}
        />
        <DialogPrimitive.Popup
          data-slot="command-dialog"
          data-variant={variant}
          className={cn(styles.popup(), styles.panel(), className)}
        >
          {/* Matches shadcn's own CommandDialog: a real Title/Description carries the
					accessible name/description, sr-only since the search input is the visible label. */}
          <DialogPrimitive.Title className="sr-only">{label}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">{description}</DialogPrimitive.Description>
          {variant === "framed" && header ? (
            <div data-slot="command-header" className={cn(styles.header(), header.className)}>
              <p className="font-medium text-foreground text-sm">{header.children}</p>
              <span className="flex shrink-0 items-center gap-1.5 text-muted-foreground text-xs">
                <kbd className={styles.kbd()}>esc</kbd>
                close
              </span>
            </div>
          ) : null}
          <DialogVariantCtx.Provider value={variant}>
            <CommandHeaderCtx.Provider value={setHeader}>{children}</CommandHeaderCtx.Provider>
          </DialogVariantCtx.Provider>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** A row for the input and its filters, as the launcher lays them side by side. */
export function CommandBar({ className, ...props }: ComponentProps<"div">) {
  const { styles } = useStyles();
  return <div data-slot="command-bar" className={cn(styles.bar(), className)} {...props} />;
}

export function CommandInput({
  className,
  placeholder = "Type a command or search…",
  hint,
  ...props
}: ComponentProps<typeof CommandPrimitive.Input> & {
  /** A key cap at the end of the field, e.g. `⌘K` or `Esc`. */
  hint?: ReactNode;
}) {
  const { styles } = useStyles();
  const resultCount = useCommandState((state) => state.filtered.count);
  const [spoken, setSpoken] = useState("");

  // Debounced so a live region does not narrate every keystroke, only where it settles.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSpoken(
        resultCount === 0
          ? "No commands match."
          : `${resultCount} ${resultCount === 1 ? "command" : "commands"} available.`,
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [resultCount]);

  return (
    <div data-slot="command-input-wrapper" className={styles.inputWrap()}>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className={styles.inputIcon()}>
        <circle cx="7.2" cy="7.2" r="4.2" stroke="currentColor" strokeWidth="1.4" />
        <path d="m10.4 10.4 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <CommandPrimitive.Input
        autoFocus
        data-slot="command-input"
        placeholder={placeholder}
        className={cn(styles.input(), className)}
        {...props}
      />
      <span className={styles.count()} aria-hidden>
        {resultCount}
      </span>
      {hint ? (
        <kbd aria-hidden className={styles.kbd()}>
          {hint}
        </kbd>
      ) : null}
      <span role="status" aria-live="polite" className="sr-only">
        {spoken}
      </span>
    </div>
  );
}

/**
 * One choice of scope or category over the results. The palette never filters by it: pass
 * `value` and render only the groups it allows.
 */
export function CommandFilters({
  value,
  onValueChange,
  label = "Filter results",
  className,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  const { styles } = useStyles();
  const pill = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<PillBox | null>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    setBox(pressedBox(pill.current?.parentElement));
  }, [value, children]);

  // Placed before it may slide, so the first paint never sweeps in from the corner.
  useEffect(() => {
    if (!box || ready) return;
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, [box, ready]);

  return (
    <TooltipProvider>
      <ToggleGroup
        type="single"
        value={value}
        // A single-choice tray never empties: pressing the active filter keeps it.
        onValueChange={(next) => {
          const picked = Array.isArray(next) ? next[0] : next;
          if (picked) onValueChange(picked);
        }}
        aria-label={label}
        data-slot="command-filters"
        className={cn(styles.filters(), className)}
      >
        <span
          ref={pill}
          aria-hidden
          data-ready={ready ? "" : undefined}
          className={styles.pill()}
          style={pillStyle(box)}
        />
        {children}
      </ToggleGroup>
    </TooltipProvider>
  );
}

/** An icon filter in the launcher, named by a tooltip; a text chip in spotlight. */
export function CommandFilter({
  value,
  label,
  className,
  children,
}: {
  value: string;
  /** The tooltip and accessible name when the filter shows only an icon. */
  label: string;
  className?: string;
  children?: ReactNode;
}) {
  const { variant, styles } = useStyles();
  const item = (
    <ToggleGroupItem
      value={value}
      aria-label={variant === "launcher" ? label : undefined}
      data-slot="command-filter"
      className={cn(styles.filter(), className)}
    >
      {children}
    </ToggleGroupItem>
  );
  if (variant !== "launcher") return item;
  return (
    <Tooltip>
      <TooltipTrigger render={item} />
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

export function CommandList({ className, children, ...props }: ComponentProps<typeof CommandPrimitive.List>) {
  const { styles } = useStyles();
  const activeValue = useCommandState((state) => state.value);
  const el = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState<PillBox | null>(null);
  const [glide, setGlide] = useState(false);

  useEffect(() => {
    const row = el.current?.querySelector<HTMLElement>('[data-selected="true"]');
    setBox(row ? offsetBox(row) : null);
  }, [activeValue, children]);

  // Arrow keys repeat too fast for motion to help; a pointer moving between rows can glide.
  useEffect(() => {
    const snap = () => setGlide(false);
    window.addEventListener("keydown", snap, true);
    return () => window.removeEventListener("keydown", snap, true);
  }, []);

  return (
    <CommandPrimitive.List
      ref={el}
      data-slot="command-list"
      className={cn(styles.list(), className)}
      onPointerMove={() => setGlide(true)}
      {...props}
    >
      {box ? (
        <span aria-hidden data-glide={glide ? "" : undefined} className={styles.marker()} style={pillStyle(box)} />
      ) : null}
      {children}
    </CommandPrimitive.List>
  );
}

export function CommandEmpty({ className, ...props }: ComponentProps<typeof CommandPrimitive.Empty>) {
  const { styles } = useStyles();
  return <CommandPrimitive.Empty data-slot="command-empty" className={cn(styles.empty(), className)} {...props} />;
}

export function CommandGroup({ className, ...props }: ComponentProps<typeof CommandPrimitive.Group>) {
  const { styles } = useStyles();
  return <CommandPrimitive.Group data-slot="command-group" className={cn(styles.group(), className)} {...props} />;
}

export function CommandItem({
  className,
  value,
  keywords = "",
  onSelect,
  onClick,
  children,
  ...props
}: Omit<ComponentProps<typeof CommandPrimitive.Item>, "onSelect" | "keywords" | "value"> & {
  value: string;
  keywords?: string;
  /** Fires on click or Enter, like cmdk. `onClick` is an alias. */
  onSelect?: () => void;
  onClick?: () => void;
}) {
  const { styles } = useStyles();
  return (
    <CommandPrimitive.Item
      value={value}
      keywords={keywords ? keywords.split(/\s+/) : undefined}
      onSelect={onSelect ?? onClick}
      data-slot="command-item"
      className={cn(styles.item(), className)}
      {...props}
    >
      {children}
    </CommandPrimitive.Item>
  );
}

export function CommandShortcut({ className, ...props }: ComponentProps<"span">) {
  const { styles } = useStyles();
  return <span data-slot="command-shortcut" className={cn(styles.shortcut(), className)} {...props} />;
}

export function CommandSeparator({ className, ...props }: ComponentProps<typeof CommandPrimitive.Separator>) {
  const { styles } = useStyles();
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn(styles.separator(), className)}
      {...props}
    />
  );
}

/** Key hints along the bottom, e.g. move, open and close. */
export function CommandFooter({ className, ...props }: ComponentProps<"div">) {
  const { styles } = useStyles();
  return <div data-slot="command-footer" className={cn(styles.footer(), className)} {...props} />;
}

export function CommandHint({
  keys,
  className,
  children,
}: {
  /** One key cap each, e.g. `["↑", "↓"]`. */
  keys: string[];
  className?: string;
  children?: ReactNode;
}) {
  const { styles } = useStyles();
  const [held, setHeld] = useState<string[]>([]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => setHeld((list) => (list.includes(event.key) ? list : [...list, event.key]));
    const up = (event: KeyboardEvent) => setHeld((list) => list.filter((key) => key !== event.key));
    const clear = () => setHeld([]);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, []);

  return (
    <span data-slot="command-hint" className={cn(styles.hint(), className)}>
      {keys.map((key) => (
        <kbd key={key} data-pressed={held.includes(KEY_NAME[key] ?? key) ? "" : undefined} className={styles.kbd()}>
          {key}
        </kbd>
      ))}
      {children}
    </span>
  );
}

export function CommandHeader({ className, children, ...props }: ComponentProps<"div">) {
  const setHeader = useContext(CommandHeaderCtx);

  // Rendered by CommandDialog in the rim above the card, so nothing is emitted here.
  useEffect(() => {
    if (!setHeader) return;
    setHeader({ children, className });
    return () => setHeader(null);
  }, [setHeader, children, className]);

  if (setHeader) return null;

  return (
    <div
      data-slot="command-header"
      className={cn("flex items-center justify-between gap-3 px-3.5 pt-2.5 pb-1.5", className)}
      {...props}
    >
      <p className="font-medium text-foreground text-sm">{children}</p>
    </div>
  );
}
