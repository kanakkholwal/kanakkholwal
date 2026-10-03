"use client";

import { type ScaleBand, type ScaleLinear, scaleBand, scaleLinear } from "d3-scale";
import {
  createContext,
  type PointerEvent,
  type ReactNode,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useChart } from "@/components/charts/chart/chart";
import type { ChartPhase, ChartStatus, Datum, Margin, SeriesConfig, TooltipRow } from "@/components/charts/chart/core";
import { announceRows, hoverThrottle } from "@/components/charts/chart/core";
import {
  ActivePointProvider,
  type CartesianContextValue,
  CartesianProvider,
  ChartFrame,
  type TickScale,
} from "@/components/charts/chart/frame";
import { CHART_EASE, type Playback, prefersReducedMotion, tween } from "@/components/charts/chart/motion";
import {
  useActiveIndex,
  useAnimatedDomain,
  useChartPhase,
  useSeriesRegistry,
} from "@/components/charts/chart/time-series";
import {
  type BarRect,
  barDomain,
  barLayout,
  categoryOf,
  collapsed,
  ENTER_MS,
  enterSpan,
  lerpRect,
  nearestBand,
  type Rect,
  SWEEP_MS,
  SWEEP_STOPS,
  skeletonHeights,
  staggerDelay,
  summarizeBars,
  UPDATE_MS,
} from "./bar-core";
import { type BarEntrance, type BarOrientationVariant, type BarVariant, barChart } from "./variants";

const BAR_MARGIN: Margin = { top: 16, right: 16, bottom: 32, left: 44 };
const SKELETON_BARS = 12;
const NO_HIDDEN: ReadonlySet<string> = new Set();

export interface DisplayedBar {
  target: BarRect;
  rect: Rect;
  /** Entrance progress 0 to 1; drives opacity and blur for the fade entrance. */
  progress: number;
  /** Milliseconds into this bar's own entrance, or null outside enter and exit. */
  elapsed: number | null;
}

export interface BarContextValue {
  data: Datum[];
  xKey: string;
  orientation: BarOrientationVariant;
  variant: BarVariant;
  entrance: BarEntrance;
  stacked: boolean;
  band: ScaleBand<string>;
  value: ScaleLinear<number, number>;
  categories: string[];
  displayed: Map<string, DisplayedBar>;
  series: SeriesConfig[];
  register: (series: SeriesConfig) => () => void;
  phase: ChartPhase;
  activeIndex: number | null;
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
  plotEl: HTMLDivElement | null;
  width: number;
  height: number;
  uid: string;
}

const BarContext = createContext<BarContextValue | null>(null);

export function useBarChart(): BarContextValue {
  const context = useContext(BarContext);
  if (!context) throw new Error("Bar parts must be rendered inside a <BarChart />");
  return context;
}

export interface BarChartProps {
  data: Datum[];
  /** Key holding each row's category label. */
  xKey?: string;
  /** Header of the category column in the screen-reader table. */
  xLabel?: string;
  orientation?: BarOrientationVariant;
  /** Flat bars, stacked square cells, or glass blocks with perspective depth. */
  variant?: BarVariant;
  entrance?: BarEntrance;
  stacked?: boolean;
  /** Gap between categories as a fraction of the band. */
  barGap?: number;
  /** Pixels between grouped bars in one category. */
  groupGap?: number;
  /** Pixels between stacked segments. */
  stackGap?: number;
  margin?: Partial<Margin>;
  status?: ChartStatus;
  animate?: boolean;
  activeIndex?: number | null;
  defaultActiveIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  /** Announced after the chart's name, e.g. "bar chart". */
  roleDescription?: string;
  className?: string;
  children?: ReactNode;
}

export function BarChart({
  data,
  xKey = "name",
  xLabel = "Category",
  orientation = "vertical",
  variant = "bar",
  entrance = "grow",
  stacked = false,
  barGap = 0.2,
  groupGap = 4,
  stackGap = 0,
  margin,
  status = "ready",
  animate = true,
  activeIndex: activeIndexProp,
  defaultActiveIndex = null,
  onActiveIndexChange,
  roleDescription = "bar chart",
  className,
  children,
}: BarChartProps) {
  const chartContext = useChart();
  const { format, hidden, config } = chartContext;
  const { series, register } = useSeriesRegistry(NO_HIDDEN);
  const visible = series.filter((s) => !hidden.has(s.key));
  const visibleKeys = visible.map((s) => s.key).join("|");
  const target = useMemo(
    () => barDomain(data, visibleKeys ? visibleKeys.split("|") : [], stacked),
    [data, visibleKeys, stacked],
  );
  const { phase, advance } = useChartPhase(status, animate);
  const domain = useAnimatedDomain(target, phase, status, animate, advance);
  const { activeIndex, instant, setActive } = useActiveIndex(activeIndexProp, defaultActiveIndex, onActiveIndexChange);
  const interactive = phase === "ready" && data.length > 0;
  const seriesLabel = (key: string) => {
    const label = config[key]?.label;
    return typeof label === "string" ? label : key;
  };
  const title = (datum: Datum) => categoryOf(datum, xKey);
  const rows = (datum: Datum): TooltipRow[] =>
    visible.map((s) => {
      const value = datum[s.key];
      return {
        key: s.key,
        label: seriesLabel(s.key),
        color: s.color,
        value: typeof value === "number" ? value : null,
      };
    });
  const activeDatum = activeIndex !== null && interactive ? data[activeIndex] : undefined;
  const announcement = activeDatum && instant ? announceRows(title(activeDatum), rows(activeDatum), format.number) : "";
  const uid = useId().replace(/:/g, "");

  return (
    <ChartFrame
      roleDescription={roleDescription}
      summary={
        chartContext.description ??
        summarizeBars({
          data,
          xKey,
          series: visible.map((s) => ({ key: s.key, label: seriesLabel(s.key) })),
          format,
        })
      }
      table={{
        columns: [xLabel, ...visible.map((s) => seriesLabel(s.key))],
        rows: data.map((datum) => ({
          header: title(datum),
          cells: visible.map((s) => {
            const value = datum[s.key];
            return typeof value === "number" ? format.number(value) : "";
          }),
        })),
      }}
      count={data.length}
      activeIndex={activeIndex}
      onActiveChange={setActive}
      interactive={interactive}
      announcement={announcement}
      phase={phase}
      className={className}
    >
      {(frame) => (
        <BarPlot
          frame={frame}
          data={data}
          xKey={xKey}
          orientation={orientation}
          variant={variant}
          entrance={entrance}
          stacked={stacked}
          barGap={barGap}
          groupGap={groupGap}
          stackGap={stackGap}
          marginProp={margin}
          domain={domain}
          series={series}
          register={register}
          hidden={hidden}
          phase={phase}
          animate={animate}
          advance={advance}
          activeIndex={interactive ? activeIndex : null}
          instant={instant}
          interactive={interactive}
          setActive={setActive}
          title={title}
          rows={rows}
          uid={uid}
        >
          {children}
        </BarPlot>
      )}
    </ChartFrame>
  );
}

interface BarPlotProps {
  frame: { width: number; height: number; el: HTMLDivElement | null };
  data: Datum[];
  xKey: string;
  orientation: BarOrientationVariant;
  variant: BarVariant;
  entrance: BarEntrance;
  stacked: boolean;
  barGap: number;
  groupGap: number;
  stackGap: number;
  marginProp?: Partial<Margin>;
  domain: [number, number];
  series: SeriesConfig[];
  register: (series: SeriesConfig) => () => void;
  hidden: ReadonlySet<string>;
  phase: ChartPhase;
  animate: boolean;
  advance: (event: "done") => void;
  activeIndex: number | null;
  instant: boolean;
  interactive: boolean;
  setActive: (index: number | null, fromKeyboard: boolean) => void;
  title: (datum: Datum) => string;
  rows: (datum: Datum) => TooltipRow[];
  uid: string;
  children?: ReactNode;
}

function BarPlot({
  frame,
  data,
  xKey,
  orientation,
  variant,
  entrance,
  stacked,
  barGap,
  groupGap,
  stackGap,
  marginProp,
  domain,
  series,
  register,
  hidden,
  phase,
  animate,
  advance,
  activeIndex,
  instant,
  interactive,
  setActive,
  title,
  rows,
  uid,
  children,
}: BarPlotProps) {
  const margin = useMemo(() => ({ ...BAR_MARGIN, ...marginProp }), [marginProp]);
  const innerWidth = Math.max(0, frame.width - margin.left - margin.right);
  const innerHeight = Math.max(0, frame.height - margin.top - margin.bottom);
  const vertical = orientation === "vertical";
  const categories = useMemo(() => data.map((d) => categoryOf(d, xKey)), [data, xKey]);
  const band = useMemo(
    () =>
      scaleBand<string>()
        .domain(categories)
        .range([0, vertical ? innerWidth : innerHeight])
        .padding(barGap),
    [categories, vertical, innerWidth, innerHeight, barGap],
  );
  const value = useMemo(
    () =>
      scaleLinear()
        .domain(domain)
        .range(vertical ? [innerHeight, 0] : [0, innerWidth]),
    [domain, vertical, innerWidth, innerHeight],
  );
  const keys = useMemo(() => series.map((s) => s.key), [series]);
  const targets = useMemo(
    () =>
      barLayout({
        data,
        xKey,
        keys,
        hidden,
        orientation,
        stacked,
        band,
        value,
        groupGap,
        stackGap,
      }),
    [data, xKey, keys, hidden, orientation, stacked, band, value, groupGap, stackGap],
  );
  const base = value(0);

  const [clock, setClock] = useState(0);
  const span = enterSpan(data.length, variant === "squares");
  const spanRef = useRef(span);
  spanRef.current = span;
  useLayoutEffect(() => {
    if (phase !== "revealing" && phase !== "concealing") return;
    const reveal = phase === "revealing";
    const total = spanRef.current;
    setClock(reveal ? 0 : total);
    const playback = tween({
      duration: animate ? total : 0,
      ease: (t) => t,
      onUpdate: (p) => setClock(reveal ? p * total : (1 - p) * total),
      onComplete: () => advance("done"),
    });
    return () => playback.stop();
  }, [phase, animate, advance]);

  // Data, layout and visibility changes morph; the value domain already tweens on its own.
  const signature = `${orientation}|${stacked}|${variant}|${innerWidth}x${innerHeight}|${keys.join(",")}|${[
    ...hidden,
  ].join(",")}|${data.map((d) => keys.map((k) => String(d[k])).join(",")).join(";")}`;
  const [morph, setMorph] = useState(1);
  const from = useRef(new Map<string, Rect>());
  const shown = useRef(new Map<string, Rect>());
  const shownTargets = useRef(new Map<string, BarRect>());
  const fromTargets = useRef(new Map<string, BarRect>());
  const prevSignature = useRef(signature);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  useLayoutEffect(() => {
    if (prevSignature.current === signature) return;
    prevSignature.current = signature;
    if (phaseRef.current !== "ready" || !animate) {
      setMorph(1);
      return;
    }
    from.current = new Map(shown.current);
    fromTargets.current = new Map(shownTargets.current);
    setMorph(0);
    const playback: Playback = tween({ duration: UPDATE_MS, onUpdate: setMorph });
    return () => playback.stop();
  }, [signature, animate]);

  const displayed = useMemo(() => {
    const map = new Map<string, DisplayedBar>();
    for (const target of targets) {
      const start = collapsed(target, orientation, base);
      if (phase === "revealing" || phase === "concealing") {
        const elapsed = clock - staggerDelay(target.index, data.length);
        const progress = CHART_EASE(Math.min(1, Math.max(0, elapsed / ENTER_MS)));
        const rect = entrance === "fade" ? target : lerpRect(start, target, variant === "squares" ? 1 : progress);
        map.set(target.key, { target, rect, progress, elapsed });
      } else if (phase === "ready") {
        const origin = from.current.get(target.key) ?? start;
        map.set(target.key, {
          target,
          rect: morph >= 1 ? target : lerpRect(origin, target, morph),
          progress: 1,
          elapsed: null,
        });
      }
    }
    // Bars whose category left the data shrink back to the baseline, mirroring the grow.
    if (phase === "ready" && morph < 1) {
      for (const [key, origin] of from.current) {
        const target = fromTargets.current.get(key);
        if (map.has(key) || !target) continue;
        const rect = lerpRect(origin, collapsed(origin, orientation, base), morph);
        map.set(key, { target, rect, progress: 1, elapsed: null });
      }
    }
    return map;
  }, [targets, orientation, base, phase, clock, data.length, entrance, variant, morph]);
  // Snapshot after commit, so a morph starts from what was on screen, not the new targets.
  useLayoutEffect(() => {
    shown.current = new Map([...displayed].map(([key, d]) => [key, d.rect]));
    shownTargets.current = new Map([...displayed].map(([key, d]) => [key, d.target]));
  });

  const hover = useMemo(() => hoverThrottle(), []);
  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!interactive) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const pos = vertical ? event.clientX - bounds.left - margin.left : event.clientY - bounds.top - margin.top;
    const index = nearestBand(band, categories, pos);
    hover.move(index, (next) => {
      if (next !== activeIndex) setActive(next, false);
    });
  };
  const onPointerLeave = () => {
    hover.cancel();
    if (activeIndex !== null) setActive(null, false);
  };

  const cartesian = useMemo<CartesianContextValue>(
    () => ({
      width: frame.width,
      height: frame.height,
      innerWidth,
      innerHeight,
      margin,
      rowScale: vertical ? (value as unknown as TickScale) : undefined,
      columnScale: vertical ? undefined : (value as unknown as TickScale),
      phase,
      animate,
      clipId: `${uid}-clip`,
      plotEl: frame.el,
    }),
    [frame, innerWidth, innerHeight, margin, vertical, value, phase, animate, uid],
  );
  const visibleSeries = useMemo(() => series.filter((s) => !hidden.has(s.key)), [series, hidden]);
  const active = useMemo(() => {
    if (activeIndex === null) return null;
    const datum = data[activeIndex];
    if (!datum) return null;
    const center = (band(categories[activeIndex] ?? "") ?? 0) + band.bandwidth() / 2;
    return { index: activeIndex, datum, x: center, y: {} };
  }, [activeIndex, data, band, categories]);
  const activeValue = useMemo(() => ({ active, instant, title, rows }), [active, instant, title, rows]);
  const context = useMemo<BarContextValue>(
    () => ({
      data,
      xKey,
      orientation,
      variant,
      entrance,
      stacked,
      band,
      value,
      categories,
      displayed,
      series: visibleSeries,
      register,
      phase,
      activeIndex,
      innerWidth,
      innerHeight,
      margin,
      plotEl: frame.el,
      width: frame.width,
      height: frame.height,
      uid,
    }),
    [
      data,
      xKey,
      orientation,
      variant,
      entrance,
      stacked,
      band,
      value,
      categories,
      displayed,
      visibleSeries,
      register,
      phase,
      activeIndex,
      innerWidth,
      innerHeight,
      margin,
      frame,
      uid,
    ],
  );

  return (
    <BarContext.Provider value={context}>
      <CartesianProvider value={cartesian}>
        <ActivePointProvider value={activeValue}>
          <svg
            aria-hidden="true"
            width={frame.width}
            height={frame.height}
            className="absolute inset-0 block overflow-visible"
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          >
            <g transform={`translate(${margin.left},${margin.top})`}>
              <rect width={innerWidth} height={innerHeight} fill="transparent" />
              <BarSkeleton />
              {children}
            </g>
          </svg>
        </ActivePointProvider>
      </CartesianProvider>
    </BarContext.Provider>
  );
}

/** Loading bars: seeded heights under a diagonal shimmer that re-rolls each pass. */
function BarSkeleton() {
  const { phase, band, categories, innerWidth, innerHeight, orientation, uid } = useBarChart();
  const [tick, setTick] = useState(0);
  const sweepRef = useRef<SVGRectElement>(null);
  const loading = phase === "loading";
  const reduced = typeof window !== "undefined" && prefersReducedMotion();

  useLayoutEffect(() => {
    if (!loading || reduced) return;
    let playback: Playback | null = null;
    let rolled = false;
    const cycle = () => {
      rolled = false;
      playback = tween({
        duration: SWEEP_MS,
        ease: (t) => t,
        onUpdate: (p) => {
          const x = -1 + 3 * p;
          sweepRef.current?.setAttribute("x", String(x));
          if (!rolled && x >= 1) {
            rolled = true;
            setTick((t) => t + 1);
          }
        },
        onComplete: cycle,
      });
    };
    cycle();
    return () => playback?.stop();
  }, [loading, reduced]);

  const count = categories.length || SKELETON_BARS;
  const heights = skeletonHeights(count, tick);
  const step = (orientation === "vertical" ? innerWidth : innerHeight) / count;
  const width = categories.length ? band.bandwidth() : step * 0.7;
  const styles = barChart();
  return (
    <g
      data-slot="bar-skeleton"
      style={{
        opacity: loading ? 1 : 0,
        transition: "opacity 450ms cubic-bezier(0.85,0,0.15,1)",
      }}
    >
      {loading && !reduced ? (
        <defs>
          <linearGradient id={`${uid}-sweep`}>
            {SWEEP_STOPS.map((stop) => (
              <stop key={stop.offset} offset={stop.offset} stopColor="white" stopOpacity={stop.opacity} />
            ))}
          </linearGradient>
          <pattern
            id={`${uid}-sweep-p`}
            width={3}
            height={1}
            patternUnits="objectBoundingBox"
            patternContentUnits="objectBoundingBox"
            patternTransform="rotate(25)"
          >
            <rect ref={sweepRef} x={-1} width={1} height={1} fill={`url(#${uid}-sweep)`} />
          </pattern>
          <mask id={`${uid}-sweep-m`}>
            <rect width={innerWidth} height={innerHeight} fill={`url(#${uid}-sweep-p)`} />
          </mask>
        </defs>
      ) : null}
      {loading ? (
        <g mask={reduced ? undefined : `url(#${uid}-sweep-m)`} opacity={0.45}>
          {heights.map((h, i) => {
            const start = categories.length
              ? (band(categories[i] ?? "") ?? 0) + (band.bandwidth() - width) / 2
              : i * step + (step - width) / 2;
            return orientation === "vertical" ? (
              <rect
                key={i}
                className={styles.skeleton()}
                x={start}
                y={innerHeight * (1 - h)}
                width={width}
                height={innerHeight * h}
                rx={2}
              />
            ) : (
              <rect
                key={i}
                className={styles.skeleton()}
                x={0}
                y={start}
                width={innerWidth * h}
                height={width}
                rx={2}
              />
            );
          })}
        </g>
      ) : null}
    </g>
  );
}

export function useBarRegistration(key: string, color: string) {
  const { register } = useBarChart();
  useLayoutEffect(() => register({ key, color }), [register, key, color]);
}
