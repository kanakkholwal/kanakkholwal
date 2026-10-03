import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getProjectList, source as projectSource } from "@/lib/project.source";
import { source as docsSource, getReadTime, toDocMeta } from "@/lib/source";
import { getWorkExperienceList } from "@/lib/work.source";
import { getProjectResult } from "~/lib/analytics/service";

const slugsValidator = (slugs: unknown) => {
  if (!Array.isArray(slugs) || !slugs.every((s) => typeof s === "string")) {
    throw new Error("Expected a slug array");
  }
  return slugs as string[];
};

/** Project and work frontmatter for the whole site; loaded once by the root route. */
export const getContentIndex = createServerFn({ method: "GET" }).handler(async () => ({
  projects: getProjectList(),
  work: getWorkExperienceList(),
  docsCount: docsSource.getPages().length,
}));

export const getProjectPage = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const page = projectSource.getPage([slug]);
    if (!page) throw notFound();
    const project = getProjectList().find((p) => p.path === page.path);
    if (!project) throw notFound();
    return { project, analytics: await getProjectResult(project.id) };
  });

function sortedDocs() {
  return docsSource
    .getPages()
    .toSorted((a, b) => new Date(b.data.lastModified ?? 0).getTime() - new Date(a.data.lastModified ?? 0).getTime());
}

export const getDocsIndex = createServerFn({ method: "GET" }).handler(async () => sortedDocs().map(toDocMeta));

export const getDocsCategory = createServerFn({ method: "GET" })
  .validator((category: string) => category)
  .handler(async ({ data: category }) => {
    const pages = sortedDocs().filter((p) => p.slugs[0] === category);
    if (!pages.length) throw notFound();
    return Promise.all(pages.map(async (p) => ({ ...toDocMeta(p), readTime: await getReadTime(p) })));
  });

export const getDocPage = createServerFn({ method: "GET" })
  .validator(slugsValidator)
  .handler(async ({ data: slugs }) => {
    const page = docsSource.getPage(slugs);
    if (!page) throw notFound();
    return {
      doc: toDocMeta(page),
      readTime: await getReadTime(page),
      others: sortedDocs()
        .filter((p) => p.url !== page.url)
        .map((p) => ({ title: p.data.title, description: p.data.description, url: p.url })),
    };
  });
