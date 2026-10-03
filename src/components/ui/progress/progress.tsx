import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { useId } from "react";
import { cn } from "@/lib/cn";
import {
  PROGRESS_RING,
  type ProgressSize,
  type ProgressTone,
  type ProgressVariant,
  progress,
  progressPercent,
} from "./variants";

export type { ProgressSize, ProgressTone, ProgressVariant };

export interface ProgressProps {
  value?: number;
  min?: number;
  max?: number;
  /** Unknown duration: the bar sweeps instead of filling. */
  indeterminate?: boolean;
  size?: ProgressSize;
  tone?: ProgressTone;
  variant?: ProgressVariant;
  /** Accessible name; shown under a ring, and as a bar's title with `showValue` or `helper`. */
  label?: string;
  helper?: string;
  /** Header value on a bar, centre value on a ring. */
  showValue?: boolean;
  formatValue?: (value: number, percent: number) => string;
  /** Shown in place of the value while indeterminate. */
  indeterminateLabel?: string;
  className?: string;
}

export function Progress({
  value = 0,
  min = 0,
  max = 100,
  indeterminate = false,
  size = "md",
  tone = "default",
  variant = "linear",
  label,
  helper,
  showValue = false,
  formatValue = (_, percent) => `${Math.round(percent)}%`,
  indeterminateLabel = "Loading",
  className,
}: ProgressProps) {
  const id = useId();
  const clamped = Math.min(max, Math.max(min, value));
  const percent = progressPercent(clamped, min, max);
  const styles = progress({ size, tone, variant });
  const display = indeterminate ? indeterminateLabel : formatValue(clamped, percent);
  const header = variant === "linear" && (showValue || !!helper);
  const caption = variant === "circular" && (!!label || !!helper);
  const labelled = (header || caption) && !!label;
  const { radius, stroke, gap } = PROGRESS_RING;
  const circumference = 2 * Math.PI * radius;
  const arc = (share: number) => `${(Math.max(0, share) / 100) * circumference} ${circumference}`;
  // A zero-length dash still paints its round caps as a dot.
  const cap = (share: number) => (share > 0 ? "round" : "butt");
  const trackShare = 100 - percent - 2 * gap;
  const fillShare = indeterminate ? 28 : percent;

  return (
    <ProgressPrimitive.Root
      value={indeterminate ? null : clamped}
      min={min}
      max={max}
      aria-label={labelled ? undefined : label}
      aria-labelledby={labelled ? `${id}-label` : undefined}
      aria-valuetext={display}
      data-slot="progress"
      data-variant={variant}
      className={cn(styles.root(), className)}
    >
      {header ? (
        <div className={styles.header()}>
          <div className={styles.titles()}>
            {label ? (
              <span id={`${id}-label`} className={styles.title()}>
                {label}
              </span>
            ) : null}
            {helper ? <p className={styles.helper()}>{helper}</p> : null}
          </div>
          {showValue ? <span className={styles.value()}>{display}</span> : null}
        </div>
      ) : null}
      {variant === "circular" ? (
        <>
          <div className={styles.ring()}>
            <svg
              viewBox="0 0 100 100"
              aria-hidden="true"
              className={cn(styles.ringSvg(), indeterminate && "progress-spin")}
            >
              {indeterminate ? (
                <circle cx="50" cy="50" r={radius} strokeWidth={stroke} className={styles.ringTrack()} />
              ) : (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  strokeWidth={stroke}
                  strokeLinecap={cap(trackShare)}
                  strokeDasharray={arc(trackShare)}
                  className={cn(styles.ringTrack(), "progress-ring")}
                  style={{
                    transform: `rotate(${(percent + gap) * 3.6}deg)`,
                    transformOrigin: "50px 50px",
                  }}
                />
              )}
              <circle
                cx="50"
                cy="50"
                r={radius}
                strokeWidth={stroke}
                strokeLinecap={cap(fillShare)}
                strokeDasharray={arc(fillShare)}
                className={styles.ringFill()}
              />
            </svg>
            {showValue ? <span className={styles.ringLabel()}>{display}</span> : null}
          </div>
          {caption ? (
            <div className={styles.caption()}>
              {label ? (
                <span id={`${id}-label`} className={styles.title()}>
                  {label}
                </span>
              ) : null}
              {helper ? <p className={styles.helper()}>{helper}</p> : null}
            </div>
          ) : null}
        </>
      ) : (
        <ProgressPrimitive.Track className={styles.track()}>
          {indeterminate ? (
            <div aria-hidden="true" className={styles.sweep()} />
          ) : (
            <ProgressPrimitive.Indicator
              render={(props) => (
                <div
                  {...props}
                  className={styles.fill()}
                  style={{
                    ...props.style,
                    width: "100%",
                    transform: `scaleX(${percent / 100})`,
                  }}
                />
              )}
            />
          )}
        </ProgressPrimitive.Track>
      )}
    </ProgressPrimitive.Root>
  );
}
