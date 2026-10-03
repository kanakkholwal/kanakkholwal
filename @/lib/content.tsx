import { getRouteApi } from "@tanstack/react-router";
import browserCollections from "fumadocs-mdx:collections/browser";
import type { TOCItemType } from "fumadocs-core/toc";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { type ReactNode, Suspense } from "react";

export type { DocMeta, ProjectType, WorkExperienceType } from "./content.types";

const rootRoute = getRouteApi("__root__");

/** Project frontmatter, sorted; loaded once by the root route. */
export function useProjects() {
  return rootRoute.useLoaderData({ select: (d) => d.projects });
}

export function useWorkExperiences() {
  return rootRoute.useLoaderData({ select: (d) => d.work });
}

// Explicit ids: route code splitting can duplicate these loaders, and the id shares their cache.
export const workBody = browserCollections.workExperiences.createClientLoader({
  id: "workExperiences",
  component: ({ default: MDX }) => <MDX components={defaultMdxComponents} />,
});

export const projectBody = browserCollections.projects.createClientLoader({
  id: "projects",
  component: ({ default: MDX }) => <MDX components={defaultMdxComponents} />,
});

export const docBody = browserCollections.docs.createClientLoader<{
  children: (content: { body: ReactNode; toc: TOCItemType[] }) => ReactNode;
}>({
  id: "docs",
  component: ({ default: MDX, toc }, { children }) =>
    children({ body: <MDX components={defaultMdxComponents} />, toc }),
});

/** A work entry's MDX body, lazy-loaded behind its own Suspense boundary. */
export function WorkBody({ path }: { path: string }) {
  return <Suspense fallback={null}>{workBody.useContent(path)}</Suspense>;
}
