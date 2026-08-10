#!/usr/bin/env node
// Reads the real token values out of app/global.css and asserts every contrast
// gate the design system claims to meet. Exits non-zero on the first failure so
// it can gate CI. Run: `node scripts/audit-design-tokens.mjs`
//
// Retuning a token means re-running this. A pair passes or it does not; there
// is no "looks fine to me" branch.

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

// Comments name the patterns that were removed, so they trip the "absent"
// checks unless stripped first.
const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

const CSS = read("app/global.css");
const BUTTON = stripComments(read("@/components/ui/button.tsx"));
const TOOLTIP = stripComments(read("@/components/ui/tooltip.tsx"));
const POPOVER = stripComments(read("@/components/ui/popover.tsx"));

// --- colour ---
const srgbToLinear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

const luminance = (rgb) => {
  const [r, g, b] = rgb.map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const cbrt = Math.cbrt;
function oklab(rgb) {
  const [R, G, B] = rgb.map(srgbToLinear);
  const l = cbrt(0.4122 * R + 0.5364 * G + 0.0514 * B);
  const m = cbrt(0.2119 * R + 0.6807 * G + 0.1074 * B);
  const s = cbrt(0.0883 * R + 0.2817 * G + 0.63 * B);
  return [
    0.2105 * l + 0.7936 * m - 0.0041 * s,
    1.978 * l - 2.4286 * m + 0.4506 * s,
    0.0259 * l + 0.7828 * m - 0.8087 * s,
  ];
}
const deltaE = (a, b) => {
  const A = oklab(a);
  const B = oklab(b);
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
};

// Linear CVD approximations. Enough to catch collisions, not a clinical model.
const CVD = {
  protan: [[0.152, 1.053, -0.205], [0.115, 0.786, 0.099], [-0.004, -0.048, 1.052]],
  deutan: [[0.367, 0.861, -0.228], [0.28, 0.673, 0.047], [-0.012, 0.043, 0.969]],
  tritan: [[1.256, -0.077, -0.179], [-0.078, 0.931, 0.148], [0.005, 0.691, 0.304]],
};
const simulate = (rgb, kind) => CVD[kind].map((row) => row.reduce((sum, k, i) => sum + k * rgb[i], 0));

// --- parse ---
/** Pulls one theme block's `--token: hsl(...)` declarations out of the stylesheet. */
function readTheme(selector) {
  // Whitespace-agnostic so CRLF checkouts and reformatting don't break the gate.
  const anchor = new RegExp(selector.source ?? selector, "m");
  const match = anchor.exec(CSS);
  if (!match) throw new Error(`Theme block not found: ${anchor}`);
  const start = match.index;
  const open = CSS.indexOf("{", start);
  let depth = 0;
  let end = open;
  for (let i = open; i < CSS.length; i++) {
    if (CSS[i] === "{") depth++;
    else if (CSS[i] === "}" && --depth === 0) {
      end = i;
      break;
    }
  }
  const block = CSS.slice(open, end);
  const tokens = {};
  const re = /--([\w-]+):\s*hsl\(\s*([\d.]+)(?:deg)?\s*,?\s*([\d.]+)%\s*,?\s*([\d.]+)%\s*\)/g;
  let m;
  while ((m = re.exec(block))) {
    tokens[m[1]] = hslToRgb(Number(m[2]), Number(m[3]), Number(m[4]));
  }
  return tokens;
}

const light = readTheme(/:root\s*,\s*\[data-theme="light"\]/);
const dark = readTheme(/\.dark\s*,\s*\[data-theme="dark"\]/);

// --- gates ---
// [foreground, background, minimum ratio, why]
const TEXT = 4.5; // WCAG 1.4.3 body text
const NON_TEXT = 3; // WCAG 1.4.11 control boundary / focus indicator

const PAIRS = (t) => [
  ["primary-foreground", "primary", TEXT, "button label"],
  ["primary", "card", TEXT, "link text on a card"],
  ["primary", "background", NON_TEXT, "focus ring on the page"],
  ["primary", "card", NON_TEXT, "focus ring on a card"],
  ["input", "card", NON_TEXT, "control boundary on a card"],
  ["input", "background", NON_TEXT, "control boundary on the page"],
  ["input", "popover", NON_TEXT, "control boundary in a popover"],
  ["foreground", "background", TEXT, "body text"],
  ["foreground", "card", TEXT, "body text on a card"],
  ["muted-foreground", "background", TEXT, "secondary text"],
  ["muted-foreground", "card", TEXT, "secondary text on a card"],
  ["muted-foreground", "muted", TEXT, "secondary text on a muted surface"],
  ["subtle-foreground", "background", TEXT, "tertiary text"],
  ["subtle-foreground", "card", TEXT, "tertiary text on a card"],
  ["accent-foreground", "accent", TEXT, "text on a hover surface"],
  ["secondary-foreground", "secondary", TEXT, "secondary button label"],
  ["destructive-foreground", "destructive", TEXT, "destructive label"],
  ["success-foreground", "success", TEXT, "success label"],
  ["warning-foreground", "warning", TEXT, "warning label"],
  ["info-foreground", "info", TEXT, "info label"],
  ["tertiary-foreground", "tertiary", TEXT, "tertiary button label"],
  ["popover-foreground", "popover", TEXT, "popover text"],
  ["card-foreground", "card", TEXT, "card text"],
].filter(([fg, bg]) => t[fg] && t[bg]);

const CHART_KEYS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6", "chart-7", "chart-8"];

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`  FAIL  ${msg}`);
};

for (const [name, t] of [["LIGHT", light], ["DARK", dark]]) {
  console.log(`\n${name}`);

  for (const [fg, bg, min, why] of PAIRS(t)) {
    const r = contrast(t[fg], t[bg]);
    const line = `${why} — ${fg} on ${bg}`.padEnd(56);
    if (r < min) fail(`${line} ${r.toFixed(2)}:1  (need ${min})`);
    else console.log(`  ok    ${line} ${r.toFixed(2)}:1`);
  }

  // Every series must be visible on the canvas it is drawn on.
  const canvas = t.card;
  for (const k of CHART_KEYS) {
    if (!t[k]) continue;
    const r = contrast(t[k], canvas);
    if (r < NON_TEXT) fail(`${k} on card`.padEnd(56) + ` ${r.toFixed(2)}:1  (need ${NON_TEXT})`);
  }

  // Adjacent series must stay separable: 3:1 luminance, or >0.10 dE in every
  // CVD row. Hue distance alone is not colour-blind distance.
  for (let i = 0; i < CHART_KEYS.length - 1; i++) {
    const a = t[CHART_KEYS[i]];
    const b = t[CHART_KEYS[i + 1]];
    if (!a || !b) continue;
    if (contrast(a, b) >= NON_TEXT) continue;
    const rows = { normal: deltaE(a, b) };
    for (const kind of Object.keys(CVD)) rows[kind] = deltaE(simulate(a, kind), simulate(b, kind));
    const worst = Object.entries(rows).sort((x, y) => x[1] - y[1])[0];
    if (worst[1] < 0.1) {
      fail(`${CHART_KEYS[i]} vs ${CHART_KEYS[i + 1]}`.padEnd(56) + ` dE ${worst[1].toFixed(3)} under ${worst[0]}`);
    }
  }

  console.log(`  ok    ${CHART_KEYS.filter((k) => t[k]).length} chart series, all adjacent pairs separable`);
}

// --- structural gates ---
const CODE = stripComments(CSS);

console.log("\nSTRUCTURE");
const structural = [
  [!/ring-ring\/50/.test(CODE), "focus ring is not run at half opacity"],
  [/scrollbar-gutter:\s*stable/.test(CODE), "scrollbar gutter is reserved"],
  [/body\[data-scroll-locked\]/.test(CODE), "scroll-lock padding compensation is neutralised"],
  [/prefers-reduced-motion:\s*reduce/.test(CODE), "reduced-motion block exists"],
  [/@custom-variant hoverable/.test(CODE), "hoverable variant is defined"],
  [!/var\(--gray-100\)/.test(CODE), "no reference to the undefined --gray-100"],
  [!/--animate-rainbow/.test(CODE), "no animation pointing at a missing keyframe"],
  [/origin-\(--radix-tooltip/.test(TOOLTIP), "tooltip scales from its trigger (v4 var syntax)"],
  [/origin-\(--radix-popover/.test(POPOVER), "popover scales from its trigger (v4 var syntax)"],
  [!/\bcapitalize\b/.test(BUTTON), "button does not force-capitalise its label"],
  [!/transition-all/.test(BUTTON), "button does not use transition-all"],
  ...sourceGates(),
];

/** Whole-tree checks for classes and tokens that silently resolve to nothing. */
function sourceGates() {
  const files = [];
  const walk = (dir) => {
    for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) {
        if (e.name !== "node_modules") walk(rel);
      } else if (/\.tsx?$/.test(e.name)) files.push(rel);
    }
  };
  for (const d of ["@", "app", "src"]) walk(d);

  const src = files.map((f) => [f, stripComments(read(f))]);
  const offenders = (re, skip = () => false) =>
    src.filter(([f, s]) => re.test(s) && !skip(f, s)).map(([f]) => f);

  // `font-instrument-serif` is not a generated utility — the theme exposes the
  // family as `font-serif`. 29 uses across 23 files rendered in the sans face.
  const serif = offenders(/font-instrument-serif/, (_f, s) => /variable:\s*"--font-instrument-serif"/.test(s));

  // A component setting `--accent` inline overrides the design token that
  // `bg-accent` / `hover:bg-accent` resolve to, for every descendant.
  const shadow = offenders(/"--accent"\s*:/);

  // Tokens that no longer exist resolve to nothing, silently.
  const deadChart = offenders(/var\(--chart-(9|1[0-5])\)/);

  return [
    [serif.length === 0, `no dead font-instrument-serif class${serif.length ? ` (${serif[0]}…)` : ""}`],
    [shadow.length === 0, `nothing shadows the --accent design token${shadow.length ? ` (${shadow[0]}…)` : ""}`],
    [deadChart.length === 0, `no references to deleted chart tokens${deadChart.length ? ` (${deadChart[0]}…)` : ""}`],
  ];
}
for (const [passed, label] of structural) {
  if (passed) console.log(`  ok    ${label}`);
  else fail(label);
}

console.log(
  failures === 0
    ? "\nAll design-token gates pass.\n"
    : `\n${failures} gate(s) failing.\n`,
);
process.exit(failures === 0 ? 0 : 1);
