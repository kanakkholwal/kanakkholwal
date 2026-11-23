import { cn } from "../../lib/cn";
import { OG_SPOTLIGHT_TILES, type OgSpotlightMode, ogSpotlight } from "./og-spotlight.variants";

export type { OgSpotlightMode };

export interface OgSpotlightProps {
  /** Centred headline; clamps to two lines. */
  title: string;
  /** Portrait URLs for the eight tiles around the headline; they repeat to fill. */
  images: string[];
  /** Product name under the headline. */
  site?: string;
  logo?: string;
  mode?: OgSpotlightMode;
  className?: string;
}

/** A 1200x630 card: a centred headline and brand on a faint grid, ringed by portraits. */
export function OgSpotlight({ title, images, site, logo, mode = "light", className }: OgSpotlightProps) {
  const s = ogSpotlight({ mode });
  const pics = images.filter(Boolean);
  return (
    <div data-slot="og-spotlight" className={cn(s.root(), className)}>
      <div className={s.grid()} />
      {pics.length
        ? OG_SPOTLIGHT_TILES.map((tile, i) => (
            <img
              key={`${tile.left}-${tile.top}`}
              src={pics[i % pics.length]}
              alt=""
              className={s.face()}
              style={{
                left: tile.left,
                top: tile.top,
                width: tile.width,
                height: tile.height,
              }}
            />
          ))
        : null}
      <h1 className={s.title()}>{title}</h1>
      {logo || site ? (
        <div className={s.brand()}>
          {logo ? <img src={logo} alt="" className={s.logo()} /> : null}
          {site ? <span className={s.site()}>{site}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
