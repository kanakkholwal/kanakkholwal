"use client";

import {
  type ComponentProps,
  type ComponentType,
  type CSSProperties,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
import { Toggle } from "@/components/ui/toggle/toggle";
import { cn } from "@/lib/cn";
import { chartStyleCss, createFormatters, type Formatters, seriesColor } from "./core";
import { type ChartAspect, type ChartLegendAlign, chart, chartLegend } from "./variants";

export type ChartConfig = Record<
  string,
  { label?: ReactNode; icon?: ComponentType } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<"light" | "dark", string> }
  )
>;

interface ChartContextValue {
  id: string;
  config: ChartConfig;
  format: Formatters;
  title: string;
  description?: string;
  hidden: ReadonlySet<string>;
  toggleSeries: (key: string) => void;
  highlighted: string | null;
  setHighlighted: (key: string | null) => void;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export function useChart(): ChartContextValue {
  const context = useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a <ChartContainer />");
  return context;
}

export interface ChartContainerProps extends Omit<ComponentProps<"div">, "title"> {
  config: ChartConfig;
  /** Accessible name for the chart; also the data table caption. */
  title?: string;
  /** Replaces the generated screen-reader summary. */
  description?: string;
  /** BCP 47 locale for dates and numbers. Defaults to the reader's own. */
  locale?: string;
  aspect?: ChartAspect;
  hiddenSeries?: string[];
  defaultHiddenSeries?: string[];
  onHiddenSeriesChange?: (hidden: string[]) => void;
}

export function ChartContainer({
  id,
  config,
  title = "Chart",
  description,
  locale,
  aspect = "video",
  hiddenSeries,
  defaultHiddenSeries = [],
  onHiddenSeriesChange,
  className,
  children,
  ...props
}: ChartContainerProps) {
  const uniqueId = useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;
  const [internalHidden, setInternalHidden] = useState(defaultHiddenSeries);
  const hiddenList = hiddenSeries ?? internalHidden;
  const hidden = useMemo(() => new Set(hiddenList), [hiddenList]);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const format = useMemo(() => createFormatters(locale), [locale]);

  const toggleSeries = useCallback(
    (key: string) => {
      const next = hidden.has(key) ? hiddenList.filter((k) => k !== key) : [...hiddenList, key];
      if (hiddenSeries === undefined) setInternalHidden(next);
      onHiddenSeriesChange?.(next);
    },
    [hidden, hiddenList, hiddenSeries, onHiddenSeriesChange],
  );

  const value = useMemo(
    () => ({
      id: chartId,
      config,
      format,
      title,
      description,
      hidden,
      toggleSeries,
      highlighted,
      setHighlighted,
    }),
    [chartId, config, format, title, description, hidden, toggleSeries, highlighted],
  );

  return (
    <ChartContext.Provider value={value}>
      <div data-slot="chart" data-chart={chartId} className={cn(chart({ aspect }).root(), className)} {...props}>
        <ChartStyle id={chartId} config={config} />
        {children}
      </div>
    </ChartContext.Provider>
  );
}

export function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const css = chartStyleCss(id, config);
  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export interface ChartLegendContentProps {
  align?: ChartLegendAlign;
  hideIcon?: boolean;
  /** False renders a static key: for charts whose entries are not series that can hide. */
  interactive?: boolean;
  className?: string;
}

/** Each entry is a real toggle: pressed means the series is shown. */
export function ChartLegendContent({
  align = "center",
  hideIcon = false,
  interactive = true,
  className,
}: ChartLegendContentProps) {
  const { config, hidden, toggleSeries, setHighlighted } = useChart();
  if (!interactive) {
    const styles = chartLegend();
    return (
      <ul data-slot="chart-legend" aria-label="Legend" className={cn(chartLegend({ align }).root(), className)}>
        {Object.entries(config).map(([key, entry]) => {
          const Icon = entry.icon;
          return (
            <li key={key} className={styles.label()}>
              {Icon && !hideIcon ? (
                <Icon />
              ) : (
                <span
                  aria-hidden="true"
                  className={styles.swatch()}
                  style={{ "--swatch": seriesColor(key) } as CSSProperties}
                />
              )}
              {entry.label ?? key}
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <div data-slot="chart-legend" className={cn(chartLegend({ align }).root(), className)}>
      {Object.entries(config).map(([key, entry]) => {
        const isHidden = hidden.has(key);
        const styles = chartLegend({ hidden: isHidden });
        const Icon = entry.icon;
        return (
          // biome-ignore lint/a11y/noStaticElementInteractions: hover and focus only preview the series; the toggle inside is the control
          <span
            key={key}
            className={styles.item()}
            onPointerEnter={() => setHighlighted(key)}
            onPointerLeave={() => setHighlighted(null)}
            onFocus={() => setHighlighted(key)}
            onBlur={() => setHighlighted(null)}
          >
            <Toggle size="sm" pressed={!isHidden} onPressedChange={() => toggleSeries(key)}>
              {Icon && !hideIcon ? (
                <Icon />
              ) : (
                <span
                  aria-hidden="true"
                  className={styles.swatch()}
                  style={{ "--swatch": seriesColor(key) } as CSSProperties}
                />
              )}
              {entry.label ?? key}
            </Toggle>
          </span>
        );
      })}
    </div>
  );
}

export function ChartLegend({
  content,
  interactive = true,
}: {
  content?: ReactNode;
  /** False renders a static key instead of series toggles. */
  interactive?: boolean;
}) {
  return <>{content ?? <ChartLegendContent interactive={interactive} />}</>;
}
