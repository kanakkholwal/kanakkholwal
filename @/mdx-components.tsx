import { Mermaid } from "@/components/mdx/mermaid";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { GithubInfo } from "fumadocs-ui/components/github-info";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock keepBackground {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    Mermaid,
    GithubInfo,
    ...TabsComponents,
    ...components,
  };
}
