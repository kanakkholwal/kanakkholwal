import "@tanstack/react-start/server-only";
import { projects } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { type ProjectType, toMeta } from "./content.types";

export type { ProjectType };

export const source = loader({
  baseUrl: "/projects",
  source: projects.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

/** Sorted by `order`, then newest `lastModified`. */
export function getProjectList(): ProjectType[] {
  return source
    .getPages()
    .map(toMeta)
    .toSorted((a, b) => {
      if ((a.order ?? 99) !== (b.order ?? 99)) {
        return (a.order ?? 99) - (b.order ?? 99);
      }
      return new Date(b.lastModified ?? 0).getTime() - new Date(a.lastModified ?? 0).getTime();
    });
}

export function getPageImage(id: string) {
  return `/api/og?gen_type=project&slug=${id}`;
}
