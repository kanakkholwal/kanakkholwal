// source.config.ts
import { remarkImage, remarkNpm, remarkStructure } from "fumadocs-core/mdx-plugins";
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
    remarkPlugins: [remarkImage, remarkStructure, remarkNpm],
    remarkNpmOptions: {
      persist: {
        id: "package-manager"
      }
    },
    rehypeCodeOptions: {
      lazy: true,
      themes: {
        light: "github-light",
        dark: "github-dark"
      },
      langs: ["js", "json", "sql", "bash", "shell", "html", "css", "ts", "tsx", "jsx", "py", "python", "go", "rust", "yaml", "cmd"],
      tab: true
    }
  },
  plugins: [lastModified()]
});
export {
  source_config_default as default,
  docs
};
