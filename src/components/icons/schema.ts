import z from "zod";
import { ICONS } from "./generated";

// Content frontmatter and appConfig.social keys predate the manifest names.
export const ICON_ALIASES = {
  github: "brand-github",
  linkedin: "brand-linkedin",
  twitter: "brand-x",
  x: "brand-x",
  medium: "brand-medium",
  "cal.com": "brand-cal",
  cal: "brand-cal",
  npm: "brand-npm",
  website: "globe",
  docs: "document",
} as const satisfies Record<string, keyof typeof ICONS>;

export type IconType = keyof typeof ICONS | keyof typeof ICON_ALIASES;

// Imported by source.config.ts, which loads outside Vite: relative imports only.
export const iconZodSchema = z.enum([
  ...(Object.keys(ICONS) as (keyof typeof ICONS)[]),
  ...(Object.keys(ICON_ALIASES) as (keyof typeof ICON_ALIASES)[]),
]);
