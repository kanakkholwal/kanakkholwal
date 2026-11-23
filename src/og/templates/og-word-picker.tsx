import { cn } from "../../lib/cn";
import {
  OG_WORD_PICKER_AXIS,
  OG_WORD_PICKER_HANDLES,
  OG_WORD_PICKER_ROW,
  OG_WORD_PICKER_STEPS,
  type OgWordPickerMode,
  type OgWordPickerTone,
  ogWordPicker,
  ogWordPickerRow,
} from "./og-word-picker.variants";

export type { OgWordPickerMode, OgWordPickerTone };

export interface OgWordPickerProps {
  /** The lead word, left; one line. */
  title: string;
  /** The vertical list beside it; rows fade with distance from the selected one. */
  words: string[];
  /** Index of the selected word; defaults to the middle one. */
  active?: number;
  /** Product name above the lead word. */
  site?: string;
  logo?: string;
  /** Button label under the lead word. */
  cta?: string;
  mode?: OgWordPickerMode;
  tone?: OgWordPickerTone;
  className?: string;
}

/** A 1200x630 product card: a lead word and a word list with one selected, like an editor. */
export function OgWordPicker({
  title,
  words,
  active,
  site,
  logo,
  cta,
  mode = "dark",
  tone = "primary",
  className,
}: OgWordPickerProps) {
  const s = ogWordPicker({ mode, tone });
  const list = words.filter(Boolean);
  const picked = Math.min(Math.max(active ?? Math.floor(list.length / 2), 0), list.length - 1);
  return (
    <div data-slot="og-word-picker" className={cn(s.root(), className)}>
      <div className={s.wash()} />
      {list.length ? (
        <div
          className={s.words()}
          style={{
            top: OG_WORD_PICKER_AXIS - picked * OG_WORD_PICKER_ROW - OG_WORD_PICKER_ROW / 2,
          }}
        >
          {list.map((word, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: duplicate words need a positional key
              key={`${i}-${word}`}
              className={ogWordPickerRow({
                step: OG_WORD_PICKER_STEPS[Math.min(Math.abs(i - picked), 3)],
              })}
            >
              {i === picked ? (
                <>
                  <div className={s.box()}>
                    {OG_WORD_PICKER_HANDLES.map(([x, y]) => (
                      <div key={`${x}-${y}`} className={s.handle()} style={{ left: `${x}%`, top: `${y}%` }} />
                    ))}
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    className={s.cursor()}
                    aria-hidden="true"
                  >
                    <path d="M4 3l16 7.5-7 1.8-2.2 7.2z" />
                  </svg>
                </>
              ) : null}
              <span className="relative">{word}</span>
            </div>
          ))}
        </div>
      ) : null}
      {logo || site ? (
        <div className={s.brand()}>
          {logo ? <img src={logo} alt="" className={s.logo()} /> : null}
          {site ? <span className={s.site()}>{site}</span> : null}
        </div>
      ) : null}
      <h1 className={s.title()}>{title}</h1>
      {cta ? <span className={s.cta()}>{cta}</span> : null}
    </div>
  );
}
