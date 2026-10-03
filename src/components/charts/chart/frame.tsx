"use client";

import {
  createContext,
  type KeyboardEvent,
  type ReactNode,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";
import { useChart } from "./chart";
import { type ActivePoint, type ChartPhase, type Datum, isLoadingPhase, type Margin, type TooltipRow } from "./core";
import { chart } from "./variants";

export type TickScale = ((value: unknown) => number) & {
  ticks: (count?: number) => unknown[];
};

/** Plot geometry every cartesian part reads: grid, reference area, background. */
export interface CartesianContextValue {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
  /** Scale behind horizontal grid lines; absent when rows make no sense (horizontal bars). */
  rowScale?: TickScale;
  columnScale?: TickScale;
  phase: ChartPhase;
  animate: boolean;
  clipId: string;
  plotEl: HTMLDivElement | null;
}

export interface ActiveContextValue {
  active: ActivePoint | null;
  /** True when the last move came from the keyboard, so followers jump instead of springing. */
  instant: boolean;
  title: (datum: Datum) => string;
  rows: (datum: Datum) => TooltipRow[];
}

const CartesianContext = createContext<CartesianContextValue | null>(null);
const ActiveContext = createContext<ActiveContextValue>({
  active: null,
  instant: false,
  title: () => "",
  rows: () => [],
});

export const CartesianProvider = CartesianContext.Provider;
export const ActivePointProvider = ActiveContext.Provider;
export const useActivePoint = () => useContext(ActiveContext);

export function useCartesian(): CartesianContextValue {
  const context = useContext(CartesianContext);
  if (!context) throw new Error("Cartesian chart parts must be rendered inside a cartesian chart");
  return context;
}

export interface ChartFrameTable {
  columns: string[];
  rows: { header: string; cells: string[] }[];
}

export interface ChartFrameProps {
  /** Announced after the chart's name, e.g. "line chart". */
  roleDescription: string;
  summary: string;
  table: ChartFrameTable;
  /** Items the keyboard walks through: points, slices, cells. */
  count: number;
  activeIndex: number | null;
  onActiveChange: (index: number | null, fromKeyboard: boolean) => void;
  interactive: boolean;
  /** Read out after keyboard moves only; pointer moves stay quiet. */
  announcement: string;
  phase?: ChartPhase;
  /** Runs before the default keys; return true when it handled the event. */
  onKey?: (event: KeyboardEvent<HTMLDivElement>) => boolean;
  className?: string;
  children: (frame: { width: number; height: number; el: HTMLDivElement | null }) => ReactNode;
}

/** The focusable plot every chart root renders into: sizing, keyboard model and screen-reader copy. */
export function ChartFrame({
  roleDescription,
  summary,
  table,
  count,
  activeIndex,
  onActiveChange,
  interactive,
  announcement,
  phase,
  onKey,
  className,
  children,
}: ChartFrameProps) {
  const { title } = useChart();
  const ref = useRef<HTMLDivElement>(null);
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const uid = useId().replace(/:/g, "");
  const [fromKeyboard, setFromKeyboard] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    setEl(node);
    const measure = () =>
      setSize({
        width: Math.floor(node.clientWidth),
        height: Math.floor(node.clientHeight),
      });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || count === 0) return;
    if (onKey?.(event)) {
      event.preventDefault();
      setFromKeyboard(true);
      return;
    }
    const last = count - 1;
    const step = Math.max(1, Math.ceil(count / 10));
    const current = activeIndex;
    let next: number | null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = current === null ? 0 : Math.min(last, current + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = current === null ? last : Math.max(0, current - 1);
        break;
      case "PageDown":
        next = Math.min(last, (current ?? -1) + step);
        break;
      case "PageUp":
        next = Math.max(0, (current ?? last + 1) - step);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      case "Escape":
        if (current === null) return;
        next = null;
        break;
      default:
        return;
    }
    event.preventDefault();
    setFromKeyboard(true);
    onActiveChange(next, true);
  };

  const styles = chart();
  return (
    // biome-ignore lint/a11y/useSemanticElements: <figure> would retype plotEl repo-wide
    <div
      ref={ref}
      data-slot="chart-plot"
      data-phase={phase}
      aria-busy={phase && isLoadingPhase(phase) ? true : undefined}
      role="figure"
      aria-roledescription={roleDescription}
      aria-labelledby={`${uid}-title`}
      aria-describedby={`${uid}-summary`}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: the plot is a keyboard-navigable widget
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={() => setFromKeyboard(false)}
      onBlur={() => {
        if (fromKeyboard && activeIndex !== null) onActiveChange(null, true);
      }}
      className={cn(styles.plot(), className)}
    >
      <span id={`${uid}-title`} className={styles.srOnly()}>
        {title}
      </span>
      {size.width > 0 && size.height > 0 ? children({ ...size, el }) : null}
      <p id={`${uid}-summary`} className={styles.srOnly()}>
        {summary}
      </p>
      <table className={styles.srOnly()}>
        <caption>{title}</caption>
        <thead>
          <tr>
            {table.columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, index) => (
            <tr key={index}>
              <th scope="row">{row.header}</th>
              {row.cells.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div aria-live="polite" className={styles.srOnly()}>
        {announcement}
      </div>
    </div>
  );
}
