"use client";

import { extent } from "d3-array";
import { type ScaleLinear, type ScaleTime, scaleLinear, scaleTime } from "d3-scale";
import {
  createContext,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useChart } from "./chart";
import {
  type ActivePoint,
  announceRows,
  type ChartPhase,
  type ChartSelection,
  type ChartStatus,
  type Datum,
  DEFAULT_MARGIN,
  type Domain,
  hoverThrottle,
  LOADING_DOMAIN,
  lerpDomain,
  type Margin,
  nearestIndex,
  nextPhase,
  resolveDomain,
  type SeriesConfig,
  selectionBetween,
  shouldTweenDomain,
  summarize,
  type TooltipRow,
  toDate,
} from "./core";
import {
  ActivePointProvider,
  type CartesianContextValue,
  CartesianProvider,
  ChartFrame,
  type TickScale,
} from "./frame";
import { CHART_DURATION, type Playback, tween } from "./motion";

/** Room around the reveal clip so round caps and dots at the plot edge are not cut. */
const CLIP_PAD = 8;

export interface PlotContextValue extends CartesianContextValue {
  data: Datum[];
  xKey: string;
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  x: (datum: Datum) => number;
  labels: string[];
  series: SeriesConfig[];
  register: (series: SeriesConfig) => () => void;
  /** Only time-series roots support selection; other roots leave these unset. */
  selection?: ChartSelection | null;
  /** Plot-space x of the selection edges, when one exists. */
  selectionX?: [number, number] | null;
}

const PlotContext = createContext<PlotContextValue | null>(null);

export function usePlot(): PlotContextValue {
  const context = useContext(PlotContext);
  if (!context) throw new Error("Chart parts must be rendered inside a chart such as <LineChart />");
  return context;
}

export const PlotProvider = PlotContext.Provider;

/** Extra room a part needs beyond the data: x in epoch ms, y in value units. */
export interface ChartExtent {
  x?: [number, number];
  y?: [number, number];
}

const ExtentContext = createContext<(id: string, extent: ChartExtent) => () => void>(() => () => {});

/** Lets a part such as ProjectionLine widen the x and y domains; returns an unregister. */
export const useExtentRegistry = () => useContext(ExtentContext);

const EXTENT_KEY = "__extent";

export interface TimeSeriesChartProps {
  data: Datum[];
  /** Visible date window, e.g. from ChartBrush; y-domain and interaction follow it. */
  xDomain?: [Date, Date];
  /** Key holding each row's date. */
  xKey?: string;
  /** Header of the date column in the screen-reader table. */
  xLabel?: string;
  margin?: Partial<Margin>;
  status?: ChartStatus;
  animate?: boolean;
  activeIndex?: number | null;
  defaultActiveIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  /** Range picked by dragging across the plot or Shift+Arrow. */
  selection?: ChartSelection | null;
  defaultSelection?: ChartSelection | null;
  onSelectionChange?: (selection: ChartSelection | null) => void;
  className?: string;
  children?: ReactNode;
}

/** Series registry shared by every cartesian root; order follows first registration. */
export function useSeriesRegistry(hidden: ReadonlySet<string>) {
  const [registered, setRegistered] = useState<SeriesConfig[]>([]);
  const register = useCallback((next: SeriesConfig) => {
    setRegistered((prev) => {
      const index = prev.findIndex((s) => s.key === next.key);
      if (index === -1) return [...prev, next];
      if (prev[index]?.color === next.color) return prev;
      return prev.map((s, i) => (i === index ? next : s));
    });
    return () => setRegistered((prev) => prev.filter((s) => s.key !== next.key));
  }, []);
  const series = useMemo(() => registered.filter((s) => !hidden.has(s.key)), [registered, hidden]);
  return { registered, series, register };
}

/** Lifecycle: status flips conceal, retween the domain, then reveal on completion. */
export function useChartPhase(status: ChartStatus, animate: boolean) {
  const [phase, setPhase] = useState<ChartPhase>(() =>
    status === "loading" ? "loading" : animate ? "revealing" : "ready",
  );
  const advance = useCallback(
    (event: "status-ready" | "status-loading" | "done") => setPhase((current) => nextPhase(current, event) ?? current),
    [],
  );
  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current === status) return;
    prevStatus.current = status;
    advance(status === "ready" ? "status-ready" : "status-loading");
  }, [status, advance]);
  return { phase, advance };
}

/** Value domain that tweens through lifecycle phases and data changes. */
export function useAnimatedDomain(
  target: Domain,
  phase: ChartPhase,
  status: ChartStatus,
  animate: boolean,
  advance: (event: "done") => void,
) {
  const [domain, setDomain] = useState<Domain>(() => (status === "loading" ? LOADING_DOMAIN : target));
  const domainRef = useRef(domain);
  const playback = useRef<Playback | null>(null);
  const move = useCallback(
    (to: Domain, onDone?: () => void) => {
      playback.current?.stop();
      const from = domainRef.current;
      const apply = (next: Domain) => {
        domainRef.current = next;
        setDomain(next);
      };
      if (!animate || !shouldTweenDomain(from, to)) {
        apply(to);
        onDone?.();
        return;
      }
      playback.current = tween({
        duration: CHART_DURATION.update,
        onUpdate: (p) => apply(lerpDomain(from, to, p)),
        onComplete: onDone,
      });
    },
    [animate],
  );
  useEffect(() => () => playback.current?.stop(), []);
  useEffect(() => {
    if (phase === "gridTweenReady") move(target, () => advance("done"));
    else if (phase === "gridTweenLoading") move(LOADING_DOMAIN, () => advance("done"));
    // Only the phase change starts a lifecycle tween; target changes are handled below.
  }, [phase]);
  useEffect(() => {
    if (phase === "ready") move(target);
    else if (phase === "revealing") {
      playback.current?.stop();
      domainRef.current = target;
      setDomain(target);
    }
  }, [target]);
  return domain;
}

/** Left-to-right clip reveal and its mirrored conceal; the phase advances when the clip lands. */
export function useRevealClip(
  phase: ChartPhase,
  innerWidth: number,
  animate: boolean,
  advance: (event: "done") => void,
) {
  const ref = useRef<SVGRectElement>(null);
  const widthRef = useRef(innerWidth);
  widthRef.current = innerWidth;
  const hasSize = innerWidth > 0;
  useLayoutEffect(() => {
    if ((phase !== "revealing" && phase !== "concealing") || !hasSize) return;
    const rect = ref.current;
    if (!rect) return;
    const full = widthRef.current + CLIP_PAD * 2;
    const reveal = phase === "revealing";
    const draw = (p: number) => {
      const width = reveal ? full * p : full * (1 - p);
      rect.setAttribute("width", String(width));
      rect.setAttribute("x", String(reveal ? -CLIP_PAD : -CLIP_PAD + full - width));
    };
    draw(0);
    const playback = tween({
      duration: animate ? CHART_DURATION.enter : 0,
      onUpdate: draw,
      onComplete: () => advance("done"),
    });
    return () => playback.stop();
  }, [phase, hasSize, animate, advance]);
  const full = innerWidth + CLIP_PAD * 2;
  const width = phase === "ready" ? full : phase === "revealing" || phase === "concealing" ? undefined : 0;
  return { ref, width, pad: CLIP_PAD };
}

/** Controlled active index with the pointer/keyboard source tracked for jump-vs-spring. */
export function useActiveIndex(
  prop: number | null | undefined,
  defaultValue: number | null,
  onChange?: (index: number | null) => void,
) {
  const [internal, setInternal] = useState<number | null>(defaultValue);
  const activeIndex = prop !== undefined ? prop : internal;
  const [instant, setInstant] = useState(false);
  const setActive = useCallback(
    (index: number | null, fromKeyboard: boolean) => {
      setInstant(fromKeyboard);
      if (prop === undefined) setInternal(index);
      onChange?.(index);
    },
    [prop, onChange],
  );
  return { activeIndex, instant, setActive };
}

export function TimeSeriesChart({
  data: allData,
  xDomain,
  xKey = "date",
  xLabel = "Date",
  margin: marginProp,
  status = "ready",
  animate = true,
  activeIndex: activeIndexProp,
  defaultActiveIndex = null,
  onActiveIndexChange,
  selection: selectionProp,
  defaultSelection = null,
  onSelectionChange,
  roleDescription,
  className,
  children,
}: TimeSeriesChartProps & { roleDescription: string }) {
  const chartContext = useChart();
  const { format, hidden, config } = chartContext;
  const clipId = `${useId().replace(/:/g, "")}-reveal`;
  const { series, register } = useSeriesRegistry(hidden);
  const seriesKeys = series.map((s) => s.key).join("|");
  const windowStart = xDomain?.[0].getTime();
  const windowEnd = xDomain?.[1].getTime();
  const data = useMemo(() => {
    if (windowStart === undefined || windowEnd === undefined) return allData;
    return allData.filter((d) => {
      const time = toDate(d[xKey]).getTime();
      return time >= windowStart && time <= windowEnd;
    });
  }, [allData, xKey, windowStart, windowEnd]);
  const [extents, setExtents] = useState<Map<string, ChartExtent>>(() => new Map());
  const registerExtent = useCallback((id: string, extent: ChartExtent) => {
    setExtents((prev) => new Map(prev).set(id, extent));
    return () =>
      setExtents((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
  }, []);
  const target = useMemo(() => {
    const keys = seriesKeys ? seriesKeys.split("|") : [];
    const extra = [...extents.values()].flatMap((e) => (e.y ? e.y.map((value) => ({ [EXTENT_KEY]: value })) : []));
    if (!extra.length) return resolveDomain(data, keys);
    return resolveDomain([...data, ...extra], [...keys, EXTENT_KEY]);
  }, [data, seriesKeys, extents]);
  const extentMax = useMemo(() => {
    const ends = [...extents.values()].flatMap((e) => (e.x ? [e.x[1]] : []));
    return ends.length ? Math.max(...ends) : undefined;
  }, [extents]);
  const { phase, advance } = useChartPhase(status, animate);
  const domain = useAnimatedDomain(target, phase, status, animate, advance);
  const { activeIndex, instant, setActive } = useActiveIndex(activeIndexProp, defaultActiveIndex, onActiveIndexChange);
  const interactive = phase === "ready" && data.length > 0;
  const [internalSelection, setInternalSelection] = useState(defaultSelection);
  const selection = selectionProp !== undefined ? selectionProp : internalSelection;
  const [selectionSpoken, setSelectionSpoken] = useState(false);
  const setSelection = useCallback(
    (next: ChartSelection | null, fromKeyboard: boolean) => {
      setSelectionSpoken(fromKeyboard);
      if (selectionProp === undefined) setInternalSelection(next);
      onSelectionChange?.(next);
    },
    [selectionProp, onSelectionChange],
  );
  // The fixed end of a keyboard selection; the active index is the moving end.
  const anchor = useRef<number | null>(null);
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && selection) {
      anchor.current = null;
      setSelection(null, true);
      return true;
    }
    if (!event.shiftKey || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return false;
    const from = activeIndex ?? 0;
    if (anchor.current === null || !selection) anchor.current = from;
    const step = event.key === "ArrowRight" ? 1 : -1;
    const moving = Math.min(data.length - 1, Math.max(0, from + step));
    setActive(moving, true);
    setSelection(moving === anchor.current ? null : selectionBetween(anchor.current, moving), true);
    return true;
  };

  const seriesLabel = (key: string) => {
    const label = config[key]?.label;
    return typeof label === "string" ? label : key;
  };
  const title = (datum: Datum) => format.title(toDate(datum[xKey]));
  const rows = (datum: Datum) =>
    series.map((s) => {
      const value = datum[s.key];
      return {
        key: s.key,
        label: seriesLabel(s.key),
        color: s.color,
        value: typeof value === "number" ? value : null,
      };
    });
  const activeDatum = activeIndex !== null && interactive ? data[activeIndex] : undefined;
  const range = selection ? [data[selection.start], data[selection.end]] : null;
  const announcement =
    selectionSpoken && range?.[0] && range[1]
      ? `${title(range[0])} to ${title(range[1])}: ${rows(range[0])
          .map((r, i) => {
            const to = rows(range[1] as Datum)[i]?.value;
            return `${r.label} ${r.value === null ? "" : format.number(r.value)} to ${to == null ? "" : format.number(to)}`;
          })
          .join(", ")}`
      : activeDatum && instant
        ? announceRows(title(activeDatum), rows(activeDatum), format.number)
        : "";

  return (
    <ChartFrame
      roleDescription={roleDescription}
      summary={
        chartContext.description ??
        summarize({
          data,
          xKey,
          series: series.map((s) => ({ key: s.key, label: seriesLabel(s.key) })),
          format,
        })
      }
      table={{
        columns: [xLabel, ...series.map((s) => seriesLabel(s.key))],
        rows: data.map((datum) => ({
          header: title(datum),
          cells: series.map((s) => {
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
      onKey={onKey}
      className={className}
    >
      {(frame) => (
        <ExtentContext.Provider value={registerExtent}>
          <TimeSeriesPlot
            frame={frame}
            data={data}
            xExtent={windowStart !== undefined && windowEnd !== undefined ? [windowStart, windowEnd] : undefined}
            extentMax={extentMax}
            xKey={xKey}
            marginProp={marginProp}
            domain={domain}
            series={series}
            register={register}
            phase={phase}
            animate={animate}
            advance={advance}
            clipId={clipId}
            activeIndex={activeIndex}
            instant={instant}
            interactive={interactive}
            setActive={setActive}
            selection={selection}
            setSelection={setSelection}
            title={title}
            rows={rows}
          >
            {children}
          </TimeSeriesPlot>
        </ExtentContext.Provider>
      )}
    </ChartFrame>
  );
}

function TimeSeriesPlot({
  frame,
  data,
  xExtent,
  extentMax,
  xKey,
  marginProp,
  domain,
  series,
  register,
  phase,
  animate,
  advance,
  clipId,
  activeIndex,
  instant,
  interactive,
  setActive,
  selection,
  setSelection,
  title,
  rows,
  children,
}: {
  frame: { width: number; height: number; el: HTMLDivElement | null };
  data: Datum[];
  xExtent?: [number, number];
  extentMax?: number;
  xKey: string;
  marginProp?: Partial<Margin>;
  domain: Domain;
  series: SeriesConfig[];
  register: (series: SeriesConfig) => () => void;
  phase: ChartPhase;
  animate: boolean;
  advance: (event: "done") => void;
  clipId: string;
  activeIndex: number | null;
  instant: boolean;
  interactive: boolean;
  setActive: (index: number | null, fromKeyboard: boolean) => void;
  selection: ChartSelection | null;
  setSelection: (selection: ChartSelection | null, fromKeyboard: boolean) => void;
  title: (datum: Datum) => string;
  rows: (datum: Datum) => TooltipRow[];
  children?: ReactNode;
}) {
  const { format } = useChart();
  const { top = DEFAULT_MARGIN.top, right = DEFAULT_MARGIN.right } = marginProp ?? {};
  const { bottom = DEFAULT_MARGIN.bottom, left = DEFAULT_MARGIN.left } = marginProp ?? {};
  const margin = useMemo(() => ({ top, right, bottom, left }), [top, right, bottom, left]);
  const innerWidth = Math.max(0, frame.width - margin.left - margin.right);
  const innerHeight = Math.max(0, frame.height - margin.top - margin.bottom);
  const clip = useRevealClip(phase, innerWidth, animate, advance);

  const xScale = useMemo(() => {
    if (xExtent) return scaleTime().domain(xExtent).range([0, innerWidth]);
    const [min = 0, max = min] = extent(data, (d) => toDate(d[xKey]).getTime());
    return scaleTime()
      .domain([min, Math.max(max, extentMax ?? max)])
      .range([0, innerWidth]);
  }, [data, xKey, innerWidth, xExtent?.[0], xExtent?.[1], extentMax]);
  const yScale = useMemo(() => scaleLinear().domain(domain).range([innerHeight, 0]), [domain, innerHeight]);
  const x = useCallback((d: Datum) => xScale(toDate(d[xKey])), [xScale, xKey]);
  const labels = useMemo(() => data.map((d) => format.tick(toDate(d[xKey]))), [data, xKey, format]);

  const hover = useMemo(() => hoverThrottle(), []);
  const drag = useRef<number | null>(null);
  const indexAt = (event: PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const time = xScale.invert(event.clientX - bounds.left - margin.left).getTime();
    return nearestIndex(data, xKey, time);
  };
  // Touch keeps scrubbing; mouse and pen drag out a range.
  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (!interactive || event.pointerType === "touch" || event.button !== 0) return;
    drag.current = indexAt(event);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (drag.current === null) return;
    if (indexAt(event) === drag.current) setSelection(null, false);
    drag.current = null;
  };
  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!interactive) return;
    const index = indexAt(event);
    if (drag.current !== null && index !== drag.current) {
      setSelection(selectionBetween(drag.current, index), false);
      if (activeIndex !== null) setActive(null, false);
      return;
    }
    hover.move(index, (next) => {
      if (next !== activeIndex) setActive(next, false);
    });
  };
  const onPointerLeave = () => {
    if (drag.current !== null) return;
    hover.cancel();
    if (activeIndex !== null) setActive(null, false);
  };

  const active = useMemo<ActivePoint | null>(() => {
    if (activeIndex === null || !interactive) return null;
    const datum = data[activeIndex];
    if (!datum) return null;
    const y: Record<string, number> = {};
    for (const s of series) {
      const value = datum[s.key];
      if (typeof value === "number") y[s.key] = yScale(value);
    }
    return { index: activeIndex, datum, x: x(datum), y };
  }, [activeIndex, interactive, data, series, yScale, x]);

  const selectionX = useMemo<[number, number] | null>(() => {
    const a = selection ? data[selection.start] : undefined;
    const b = selection ? data[selection.end] : undefined;
    return a && b ? [x(a), x(b)] : null;
  }, [selection, data, x]);
  const plot = useMemo<PlotContextValue>(
    () => ({
      width: frame.width,
      height: frame.height,
      innerWidth,
      innerHeight,
      margin,
      rowScale: yScale as unknown as TickScale,
      columnScale: xScale as unknown as TickScale,
      phase,
      animate,
      clipId,
      plotEl: frame.el,
      data,
      xKey,
      xScale,
      yScale,
      x,
      labels,
      series,
      register,
      selection,
      selectionX,
    }),
    [
      selection,
      selectionX,
      frame,
      innerWidth,
      innerHeight,
      margin,
      yScale,
      xScale,
      phase,
      animate,
      clipId,
      data,
      xKey,
      x,
      labels,
      series,
      register,
    ],
  );
  const activeValue = useMemo(() => ({ active, instant, title, rows }), [active, instant, title, rows]);

  return (
    <PlotContext.Provider value={plot}>
      <CartesianProvider value={plot}>
        <ActivePointProvider value={activeValue}>
          <svg
            aria-hidden="true"
            width={frame.width}
            height={frame.height}
            className="absolute inset-0 block overflow-visible"
            style={{ cursor: interactive ? "crosshair" : undefined }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          >
            <defs>
              <clipPath id={clipId}>
                <rect
                  ref={clip.ref}
                  x={-clip.pad}
                  y={-clip.pad}
                  width={clip.width}
                  height={innerHeight + clip.pad * 2}
                />
              </clipPath>
            </defs>
            <g transform={`translate(${margin.left},${margin.top})`}>
              <rect width={innerWidth} height={innerHeight} fill="transparent" />
              {children}
            </g>
          </svg>
        </ActivePointProvider>
      </CartesianProvider>
    </PlotContext.Provider>
  );
}
