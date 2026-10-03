import "@tanstack/react-start/server-only";
import { loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { workExperiences } from "fumadocs-mdx:collections/server";
import { toMeta, type WorkExperienceType } from "./content.types";

export type { WorkExperienceType };

export const source = loader({
  baseUrl: "/work",
  source: workExperiences.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getWorkExperienceList(): WorkExperienceType[] {
  return source.getPages().map(toMeta);
}
