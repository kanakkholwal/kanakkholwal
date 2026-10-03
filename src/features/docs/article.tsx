import type { CSSProperties } from "react";
import Link from "@/components/link";
import { ArrowLink, TextLink } from "@/components/site/link";
import { Meta, PixelHeading, Section } from "@/components/site/page";
import { RevealText } from "@/components/text/reveal-text";
import { BackLink } from "@/components/writing/back-link";
import { PostList } from "@/components/writing/post-list";
import { ArticleToc } from "@/components/writing/toc";
import { docBody } from "@/lib/content";
import type { DocMeta } from "@/lib/content.types";
import { writingMeta, writingRows } from "./client";
import type { WritingPost } from "./server";

export type ArticlePageProps = { doc: DocMeta; readTime: number; others: WritingPost[] };

const rise = (i: number) => ({ "--i": i }) as CSSProperties;

/** Reading layout: a 42rem column, with the TOC as a sticky rail beside it on xl. */
export default function ArticlePage({ doc, readTime, others }: ArticlePageProps) {
  const category = doc.slugs[0];
  const date = doc.lastModified ? new Date(doc.lastModified).toISOString() : null;

  return docBody.useContent(doc.path, {
    children: ({ body, toc }) => (
      <>
        <div className="xl:flex xl:items-start xl:gap-8">
          <article className="flex min-w-0 max-w-[42rem] flex-1 flex-col">
            <header className="mb-12 flex flex-col gap-4">
              <BackLink href="/docs" className="rise mb-6 self-start">
                All writing
              </BackLink>
              <div className="rise flex flex-wrap items-center gap-x-2 gap-y-1" style={rise(1)}>
                {category ? (
                  <Link
                    href={`/docs/${category}`}
                    className="font-mono text-muted-foreground text-xs transition-colors hoverable:text-foreground"
                  >
                    {category}
                  </Link>
                ) : null}
                <Meta>
                  {category ? "· " : ""}
                  {writingMeta({ date, readTime })}
                </Meta>
              </div>
              <PixelHeading as="h1" className="text-4xl text-balance">
                <RevealText text={doc.title} staggerMs={45} delayMs={80} blur={6} />
              </PixelHeading>
              {doc.description ? (
                <p className="rise text-base text-muted-foreground text-pretty" style={rise(3)}>
                  {doc.description}
                </p>
              ) : null}
            </header>

            <div className="rise prose max-w-none [&_:is(h2,h3,h4)_a]:no-underline!" style={rise(4)}>
              {body}
            </div>

            {doc.tags?.length ? (
              <Meta className="mt-12 flex flex-wrap gap-x-3 gap-y-1">
                {doc.tags.map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </Meta>
            ) : null}
          </article>
          <ArticleToc toc={toc} />
        </div>

        <Section
          title="more writing."
          className="mt-20"
          action={
            <ArrowLink href="/docs" className="text-sm">
              All writing
            </ArrowLink>
          }
        >
          {others.length ? (
            <PostList posts={writingRows(others.slice(0, 5))} />
          ) : (
            <p className="text-muted-foreground text-sm">
              Nothing else here yet. Older pieces live on the <TextLink href="/blog">blog</TextLink>.
            </p>
          )}
        </Section>
      </>
    ),
  });
}
