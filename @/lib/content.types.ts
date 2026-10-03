import type { InferPageType } from "fumadocs-core/source";
import type { source as projectSource } from "./project.source";
import type { source as docsSource } from "./source";
import type { source as workSource } from "./work.source";

// Fields that hold MDX components, ASTs or methods; they cannot cross the server/client boundary.
type NonSerializable =
  | "body"
  | "toc"
  | "structuredData"
  | "_exports"
  | "getText"
  | "getMDAST"
  | "info"
  | "extractedReferences";

/** Frontmatter plus `path`, the key into `fumadocs-mdx:collections/browser`. */
export type ContentMeta<T> = Omit<T, NonSerializable> & { path: string };

export type ProjectType = ContentMeta<InferPageType<typeof projectSource>["data"]>;
export type WorkExperienceType = ContentMeta<InferPageType<typeof workSource>["data"]>;
export type DocMeta = ContentMeta<InferPageType<typeof docsSource>["data"]> & {
  slugs: string[];
  url: string;
};

export function toMeta<T extends object>(page: { data: T; path: string }): ContentMeta<T> {
  const {
    body: _body,
    toc: _toc,
    structuredData: _structuredData,
    _exports,
    getText: _getText,
    getMDAST: _getMDAST,
    info: _info,
    extractedReferences: _extractedReferences,
    ...rest
  } = page.data as Record<string, unknown>;
  return { ...rest, path: page.path } as ContentMeta<T>;
}
