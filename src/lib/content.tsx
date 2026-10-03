import browserCollections from "fumadocs-mdx:collections/browser";
import { getRouteApi } from "@tanstack/react-router";
import type { TOCItemType } from "fumadocs-core/toc";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { type ComponentProps, type ReactNode, Suspense } from "react";
import { TextLink } from "@/components/site/link";

export type { DocMeta, ProjectType, WorkExperienceType } from "./content.types";

const rootRoute = getRouteApi("__root__");

/** Project frontmatter, sorted; loaded once by the root route. */
export function useProjects() {
  return rootRoute.useLoaderData({ select: (d) => d.projects });
}

export function useDocsCount() {
  return rootRoute.useLoaderData({ select: (d) => d.docsCount });
}

export function useWorkExperiences() {
  return rootRoute.useLoaderData({ select: (d) => d.work });
}

// Explicit ids: route code splitting can duplicate these loaders, and the id shares their cache.
/** MDX links in case studies use the site's drawn-underline link. */
function ProseLink({ href = "", children, ...props }: ComponentProps<"a">) {
  return (
    <TextLink href={href} {...props}>
      {children}
    </TextLink>
  );
}

const caseStudyComponents = { ...defaultMdxComponents, a: ProseLink };

export const workBody = browserCollections.workExperiences.createClientLoader({
  id: "workExperiences",
  component: ({ default: MDX }) => <MDX components={caseStudyComponents} />,
});

export const projectBody = browserCollections.projects.createClientLoader({
  id: "projects",
  component: ({ default: MDX }) => <MDX components={caseStudyComponents} />,
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
