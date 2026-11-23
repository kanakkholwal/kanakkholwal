import { cn } from "../../lib/cn";
import { type OgTaglineMode, type OgTaglineTone, ogTagline } from "./og-tagline.variants";

export type { OgTaglineMode, OgTaglineTone };

export interface OgTaglineProps {
  /** Brand name beside the logo; one line. */
  name: string;
  /** First headline line. */
  title: string;
  /** Optional second headline line, set in the tone colour. */
  accent?: string;
  /** Logo image URL beside the name. */
  logo?: string;
  mode?: OgTaglineMode;
  tone?: OgTaglineTone;
  className?: string;
}

/** A 1200x630 card: the brand over a centred two-line headline, the second line in tone. */
export function OgTagline({ name, title, accent, logo, mode = "dark", tone = "success", className }: OgTaglineProps) {
  const s = ogTagline({ mode, tone });
  return (
    <div data-slot="og-tagline" className={cn(s.root(), className)}>
      <div className={s.brand()}>
        {logo ? <img src={logo} alt="" className={s.logo()} /> : null}
        <span className={s.name()}>{name}</span>
      </div>
      <div className={s.lines()}>
        <span className={s.line()}>{title}</span>
        {accent ? <span className={s.accent()}>{accent}</span> : null}
      </div>
    </div>
  );
}
