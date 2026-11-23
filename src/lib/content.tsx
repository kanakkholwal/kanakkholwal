import browserCollections from "fumadocs-mdx:collections/browser";
import { getRouteApi } from "@tanstack/react-router";
import type { TOCItemType } from "fumadocs-core/toc";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { cn } from "./cn";
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

// Decision (code): fumadocs' table lets the first column wrap and crowds the cells, so tables get
// our own frame; the first column stays on one line and the text columns keep a readable width.
function MdxTable({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="not-prose my-6 rounded-2xl bg-card p-1">
      <div className="overflow-x-auto rounded-xl bg-background shadow-(--surface-shadow) dark:bg-popover">
        <table
          className={cn(
            "w-full border-collapse text-left text-sm",
            "[&_th]:whitespace-nowrap [&_th]:px-4 [&_th]:py-3 [&_th]:font-medium [&_th]:text-foreground [&_th]:text-xs",
            "[&_th]:border-border [&_th]:border-b",
            "[&_td]:min-w-40 [&_td]:px-4 [&_td]:py-3.5 [&_td]:align-top [&_td]:text-muted-foreground [&_td]:leading-6",
            "[&_td:first-child]:min-w-0 [&_td:first-child]:whitespace-nowrap [&_td:first-child]:font-medium [&_td:first-child]:text-foreground",
            "[&_tbody_tr:not(:last-child)_td]:border-border [&_tbody_tr:not(:last-child)_td]:border-b",
            className,
          )}
          {...props}
        />
      </div>
    </div>
  );
}

const caseStudyComponents = { ...defaultMdxComponents, a: ProseLink, table: MdxTable };
const docComponents = { ...defaultMdxComponents, table: MdxTable };

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
  component: ({ default: MDX, toc }, { children }) => children({ body: <MDX components={docComponents} />, toc }),
});

/** A work entry's MDX body, lazy-loaded behind its own Suspense boundary. */
export function WorkBody({ path }: { path: string }) {
  return <Suspense fallback={null}>{workBody.useContent(path)}</Suspense>;
}
