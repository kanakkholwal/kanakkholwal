import { cn } from "../../lib/cn";
import {
  OG_LINE_FIELD_PATHS,
  type OgLineFieldDensity,
  type OgLineFieldMode,
  ogLineField,
} from "./og-line-field.variants";

export type { OgLineFieldDensity, OgLineFieldMode };

export interface OgLineFieldProps {
  /** Brand name, set as the wordmark; one line. */
  name: string;
  /** Logo image URL beside the name. */
  logo?: string;
  tagline?: string;
  mode?: OgLineFieldMode;
  density?: OgLineFieldDensity;
  className?: string;
}

/** A 1200x630 brand card: the wordmark in the clear centre of a lens-warped line field. */
export function OgLineField({ name, logo, tagline, mode = "light", density = "fine", className }: OgLineFieldProps) {
  const s = ogLineField({ mode, density });
  return (
    <div data-slot="og-line-field" className={cn(s.root(), className)}>
      <svg
        viewBox="0 0 1200 630"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        className={s.field()}
        aria-hidden="true"
      >
        {OG_LINE_FIELD_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      <div className={s.hairX()} />
      <div className={s.hairY()} />
      <div className={s.mark()}>
        <div className={s.wordmark()}>
          {logo ? <img src={logo} alt="" className={s.logo()} /> : null}
          <span className={s.name()}>{name}</span>
        </div>
        {tagline ? <p className={s.tagline()}>{tagline}</p> : null}
      </div>
    </div>
  );
}
