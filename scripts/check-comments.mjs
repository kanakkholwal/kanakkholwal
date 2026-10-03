import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

// Port of baby-ui's gate: comments max 2 prose lines, no blank comment lines, banners or file headers.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ROOTS = ["src", "scripts"].map((dir) => join(ROOT, dir));
const TOP_LEVEL = ["vite.config.ts", "source.config.ts", "project.config.ts"].map((f) => join(ROOT, f));
const SKIP = new Set(["node_modules", "dist", ".wrangler", ".tanstack", "public"]);
const GENERATED = /(routeTree\.gen\.ts|icons[\\/]generated\.ts)$/;
const EXT = /\.(ts|tsx|js|jsx|mjs)$/;

const DIRECTIVE = /^\s*(\/\/|\/\*)\s*(biome-ignore|eslint-|@ts-|prettier-ignore|oxlint-|#!|\/\s*<reference)/;
const LICENSE = /^\s*(\/\/|\/\*|\*)\s*(Copyright|SPDX-|Licensed under|MIT License)/i;
const ALLOWED_DIVIDER = /^\s*\/\/ --- .+ --- ?$/;
const BANNER = /([^\p{L}\p{N}\s])\1{5,}/u;
const MAX_LINES = 2;

const repoPath = (file) => relative(ROOT, file).replaceAll(sep, "/");
const gated = (file) =>
  EXT.test(file) &&
  !file.endsWith(".d.ts") &&
  !GENERATED.test(file) &&
  !relative(ROOT, file)
    .split(sep)
    .some((part) => SKIP.has(part));

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

async function sourceFiles(args) {
  const paths = args.filter((arg) => !arg.startsWith("--"));
  if (paths.length && !args.includes("--all")) {
    return paths.map((p) => resolve(p)).filter((f) => existsSync(f) && gated(f));
  }
  const files = TOP_LEVEL.filter((f) => existsSync(f));
  for (const root of ROOTS) for await (const file of walk(root)) if (gated(file)) files.push(file);
  return files;
}

// Whole-line comments only; a trailing comment is one line by definition.
function collectBlocks(lines) {
  const blocks = [];
  let current = null;
  let inStar = false;
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (inStar) {
      current.lines.push(line);
      if (trimmed.includes("*/")) {
        blocks.push(current);
        current = null;
        inStar = false;
      }
      return;
    }
    if (trimmed.startsWith("/*") || trimmed.startsWith("{/*")) {
      current = { start: index + 1, lines: [line], star: true };
      if (trimmed.includes("*/")) {
        blocks.push(current);
        current = null;
      } else inStar = true;
      return;
    }
    if (trimmed.startsWith("//")) {
      if (current && !current.star) current.lines.push(line);
      else current = { start: index + 1, lines: [line], star: false };
      return;
    }
    if (current && !current.star) {
      blocks.push(current);
      current = null;
    }
  });
  if (current) blocks.push(current);
  return blocks;
}

function proseLineCount(block) {
  if (!block.star) return block.lines.length;
  return block.lines.filter((l) => {
    const t = l
      .trim()
      .replace(/^\{?\/\*+/, "")
      .replace(/\*+\/\}?$/, "")
      .replace(/^\*/, "")
      .trim();
    return t.length > 0;
  }).length;
}

const problems = [];
for (const file of await sourceFiles(process.argv.slice(2))) {
  const lines = (await readFile(file, "utf8")).split(/\r?\n/);
  const rel = repoPath(file);
  const firstCode = lines.findIndex((l) => {
    const t = l.trim();
    return t && !t.startsWith("//") && !t.startsWith("/*") && !t.startsWith("*");
  });
  for (const block of collectBlocks(lines)) {
    const text = block.lines.join("\n");
    if (DIRECTIVE.test(text) || LICENSE.test(text)) continue;
    const count = proseLineCount(block);
    if (count > MAX_LINES) problems.push(`${rel}:${block.start}: comment is ${count} lines (max ${MAX_LINES})`);
    if (block.lines.some((l) => l.trim() === "//" || l.trim() === "*")) {
      problems.push(`${rel}:${block.start}: blank comment line`);
    }
    for (const line of block.lines) {
      const body = line.trim().replace(/^(\/\/|\/\*+|\*)/, "");
      if (BANNER.test(body) && !ALLOWED_DIVIDER.test(line)) {
        problems.push(`${rel}:${block.start}: banner or divider comment`);
        break;
      }
    }
    const endsAt = block.start + block.lines.length - 1;
    if (block.start === 1 && firstCode > endsAt && count > 1) problems.push(`${rel}:1: file-header comment block`);
  }
}

if (problems.length) {
  console.error(`Comment gate: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log("Comment gate: clean");
