import { cn } from "../../lib/cn";
import { type OgSoftFocusMode, ogSoftFocus } from "./og-soft-focus.variants";

export type { OgSoftFocusMode };

export interface OgSoftFocusProps {
  /** Brand name, set as the wordmark; one line. */
  name: string;
  /** Logo image URL beside the name. */
  logo?: string;
  tagline?: string;
  mode?: OgSoftFocusMode;
  className?: string;
}

/** A 1200x630 brand card: the wordmark on a soft dark form with ripple rings. */
export function OgSoftFocus({ name, logo, tagline, mode = "light", className }: OgSoftFocusProps) {
  const s = ogSoftFocus({ mode });
  return (
    <div data-slot="og-soft-focus" className={cn(s.root(), className)}>
      <div className={s.form()} />
      <div className={s.ripplesA()} />
      <div className={s.ripplesB()} />
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
