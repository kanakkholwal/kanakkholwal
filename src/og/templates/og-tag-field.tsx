import { cn } from "../../lib/cn";
import {
  OG_TAG_FIELD_SLOTS,
  type OgTagFieldMode,
  type OgTagFieldTone,
  ogTagField,
  ogTagFieldTag,
} from "./og-tag-field.variants";

export type { OgTagFieldMode, OgTagFieldTone };

export interface OgTagFieldProps {
  /** Headline, bottom left; the accent phrase follows it. */
  title: string;
  /** Tags shown as pills in the tilted field; they repeat to fill it. */
  tags: string[];
  /** Closing phrase of the headline, set in the tone colour. */
  accent?: string;
  /** Mark image URL, top left. */
  logo?: string;
  /** Extra classes for the mark, e.g. a filter to keep a dark logo visible. */
  logoClassName?: string;
  mode?: OgTagFieldMode;
  tone?: OgTagFieldTone;
  className?: string;
}

/** A 1200x630 card: a headline bottom left under a tilted, fading field of tag pills. */
export function OgTagField({
  title,
  tags,
  accent,
  logo,
  logoClassName,
  mode = "dark",
  tone = "chart",
  className,
}: OgTagFieldProps) {
  const s = ogTagField({ mode, tone });
  return (
    <div data-slot="og-tag-field" className={cn(s.root(), className)}>
      {tags.length > 0 ? (
        <div className={s.field()}>
          {Array.from({ length: OG_TAG_FIELD_SLOTS }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: tags repeat to fill fixed slots
            <span key={i} className={ogTagFieldTag({ lit: i % 4 === 1 })}>
              {tags[i % tags.length]}
            </span>
          ))}
        </div>
      ) : null}
      {logo ? <img src={logo} alt="" className={cn(s.logo(), logoClassName)} /> : <span />}
      <p className={s.title()}>
        {title}
        {accent ? <span className={s.accent()}> {accent}</span> : null}
      </p>
    </div>
  );
}
