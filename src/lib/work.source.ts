import "@tanstack/react-start/server-only";
import { workExperiences } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { toMeta, type WorkExperienceType } from "./content.types";

export type { WorkExperienceType };

export const source = loader({
  baseUrl: "/work",
  source: workExperiences.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// Frontmatter dates read "Mar 2024"; Date parses that as the first of the month.
const started = (w: WorkExperienceType) => new Date(`1 ${w.startDate}`).getTime() || 0;

/** Newest role first, so a current job leads the list. */
export function getWorkExperienceList(): WorkExperienceType[] {
  return source
    .getPages()
    .map(toMeta)
    .toSorted((a, b) => started(b) - started(a));
}
