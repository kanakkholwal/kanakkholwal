const TONES = {
  blue: ["#bcd4f7", "#86aee8"],
  orange: ["#f9cdb8", "#f0a483"],
  sand: ["#eceef3", "#cfd3dc"],
} as const;
type Tone = keyof typeof TONES;

const INK = "#18181b";
const EYES = `<ellipse cx="46" cy="58" rx="4.5" ry="8" fill="${INK}"/><ellipse cx="74" cy="58" rx="4.5" ry="8" fill="${INK}"/>`;
const SMILE = `<path d="M52 76 q8 7 16 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;

const SHAPES: Record<string, (fill: string, deep: string) => string> = {
  block: (f, d) =>
    `<rect x="19" y="21" width="92" height="76" rx="16" fill="${d}"/><rect x="14" y="16" width="92" height="76" rx="16" fill="${f}"/>${EYES}`,
  round: (f, d) =>
    `<circle cx="65" cy="59" r="40" fill="${d}"/><circle cx="60" cy="54" r="40" fill="${f}"/>${EYES}${SMILE}`,
  pill: (f, d) =>
    `<rect x="39" y="13" width="52" height="94" rx="26" fill="${d}"/><rect x="34" y="8" width="52" height="94" rx="26" fill="${f}"/><path d="M46 46 q5 -8 10 0 M64 46 q5 -8 10 0" fill="none" stroke="${INK}" stroke-width="3.8" stroke-linecap="round"/>`,
  cloud: (f, d) =>
    `<path d="M32 86 C12 86 8 60 28 56 C26 34 50 24 60 40 C68 24 96 30 96 52 C114 54 114 86 92 86 Z" fill="${f}" stroke="${d}" stroke-width="3"/>${EYES}${SMILE}`,
  drop: (f, d) =>
    `<path d="M60 8 C80 38 102 54 102 76 C102 96 84 102 60 102 C36 102 18 96 18 76 C18 54 40 38 60 8 Z" fill="${f}" stroke="${d}" stroke-width="3"/>${EYES}${SMILE}`,
  triangle: (f, d) =>
    `<polygon points="60,20 100,88 20,88" fill="${f}" stroke="${d}" stroke-width="14" stroke-linejoin="round"/>${EYES}`,
  blob: (f, d) =>
    `<path d="M18 62 C12 38 32 16 62 18 C94 20 110 44 102 68 C96 88 68 96 44 92 C28 90 20 78 18 62 Z" fill="${f}" stroke="${d}" stroke-width="3"/>${EYES}${SMILE}`,
  star: (f, d) => `<circle cx="60" cy="54" r="38" fill="${f}" stroke="${d}" stroke-width="3"/>${EYES}${SMILE}`,
};

const ORDER: [keyof typeof SHAPES, Tone][] = [
  ["block", "blue"],
  ["round", "orange"],
  ["pill", "sand"],
  ["cloud", "blue"],
  ["drop", "orange"],
  ["triangle", "blue"],
  ["blob", "sand"],
  ["star", "orange"],
];

/** Airlock's characters as eight portrait-sized data-URI tiles, for the spotlight card. */
export const MASCOT_TILES = ORDER.map(([kind, tone]) => {
  const [fill, deep] = TONES[tone];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 138" width="240" height="276"><rect width="120" height="138" fill="${fill}" fill-opacity=".35"/><g transform="translate(0 14)">${SHAPES[kind](fill, deep)}</g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
});
