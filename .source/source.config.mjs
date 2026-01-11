// source.config.ts
import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import z from "zod";
var docs = defineDocs({
  dir: "content",
  docs: {
    schema: frontmatterSchema.extend({
      tags: z.array(z.string()).optional(),
      author: z.string().optional(),
      category: z.string().default("General"),
      featured: z.boolean().optional()
    }),
    postprocess: {
      includeProcessedMarkdown: true
    }
  },
  meta: {
    schema: metaSchema
  }
});
var source_config_default = defineConfig({
  mdxOptions: {
    // MDX options
  },
  plugins: [lastModified()]
});
export {
  source_config_default as default,
  docs
};
