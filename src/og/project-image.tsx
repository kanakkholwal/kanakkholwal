import type { ReactElement } from "react";
import type { ProjectType } from "../lib/project.source";
import { generateOgImage } from "./generator";
import { MASCOT_TILES } from "./mascots";
import ogCss from "./og.css?inline";
import { OgLineField } from "./templates/og-line-field";
import { OgSoftFocus } from "./templates/og-soft-focus";
import { OgSpotlight } from "./templates/og-spotlight";
import { OgStatement } from "./templates/og-statement";
import { OgTagField } from "./templates/og-tag-field";
import { OgTagline } from "./templates/og-tagline";
import { OgWordPicker } from "./templates/og-word-picker";
import { monogram, resolveProjectLogo } from "./utils";

type Mode = "light" | "dark";
type Card = { project: ProjectType; logo: string; mode: Mode };

const sentence = (text: string, max: number) => {
  const first = text.split(/(?<=[.!?])\s/)[0];
  return first.length > max ? `${first.slice(0, max).replace(/\s+\S*$/, "")}…` : first;
};
const host = (href?: string) => (href ? new URL(href).hostname.replace(/^www\./, "") : undefined);

/** The live site when the project links one; `href` can be a repo, which has no icon. */
const siteUrl = (project: ProjectType) => project.links?.find((l) => l.icon === "globe")?.url ?? project.href;

const BABY_UI_TAGS = [
  "Dialog",
  "Tabs",
  "Combobox",
  "Date picker",
  "Data table",
  "Toast",
  "Sidebar",
  "Charts",
  "Forms",
  "Drawer",
  "Tooltip",
  "Accordion",
];

/** Decision (product): hand-picked layouts and copy (features, never the stack) for projects with a live site; the rest get the tagline card. */
const TEMPLATES: Record<string, { mode: Mode; render: (c: Card) => ReactElement }> = {
  recast: {
    mode: "dark",
    render: ({ project, logo, mode }) => (
      <OgWordPicker
        title={project.title}
        words={["Record", "Smooth cursor", "Auto zoom", "Edit", "Share"]}
        site={host(siteUrl(project))}
        logo={logo}
        cta="View project"
        mode={mode}
      />
    ),
  },
  glyphtex: {
    mode: "light",
    render: ({ project, logo, mode }) => (
      <OgLineField name={project.title} logo={logo} tagline={sentence(project.description, 70)} mode={mode} />
    ),
  },
  docvia: {
    mode: "light",
    render: ({ project, logo, mode }) => (
      <OgStatement name={project.title} title={sentence(project.description, 90)} logo={logo} mode={mode} />
    ),
  },
  orbit: {
    mode: "light",
    render: ({ project, logo, mode }) => (
      <OgSoftFocus name={project.title} logo={logo} tagline={sentence(project.description, 52)} mode={mode} />
    ),
  },
  "baby-ui": {
    mode: "dark",
    render: ({ project, logo, mode }) => (
      <OgTagField
        title={project.title}
        accent="for React and Svelte"
        tags={BABY_UI_TAGS}
        logo={logo}
        logoClassName={mode === "dark" ? "brightness-0 invert" : undefined}
        mode={mode}
      />
    ),
  },
  airlock: {
    mode: "light",
    render: ({ project, logo, mode }) => (
      <OgSpotlight
        title="Your models. Your machine."
        images={MASCOT_TILES}
        site={project.title}
        logo={logo}
        mode={mode}
      />
    ),
  },
};

const DEFAULT_TEMPLATE = {
  mode: "dark" as Mode,
  render: ({ project, logo, mode }: Card) => (
    <OgTagline name="Kanak Kholwal" title={project.title} logo={logo} mode={mode} />
  ),
};

/** Project card: the mapped template, else the default; logo from the project's site, else a monogram. */
export async function projectImageResponse(project: ProjectType, dark = false) {
  const template = TEMPLATES[project.id] ?? DEFAULT_TEMPLATE;
  const mode: Mode = dark ? "dark" : template.mode;
  const logo = (await resolveProjectLogo(project.logo, siteUrl(project))) ?? monogram(project.title, mode === "dark");
  return generateOgImage(template.render({ project, logo, mode }), { css: ogCss });
}
