import { iconZodSchema } from "@/components/icons";
import {
  remarkImage,
  remarkMdxMermaid,
  remarkNpm,
  remarkStructure,
} from "fumadocs-core/mdx-plugins";
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import z from "zod";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: "content",
  docs: {
    schema: frontmatterSchema.extend({
      tags: z.array(z.string()).optional(),
      author: z.string().optional(),
      category: z.string().default("General"),
      featured: z.boolean().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const workExperiences = defineDocs({
  dir: "src/resume/work",
  docs: {
    schema: frontmatterSchema.extend({
      company: z.string(),
      href: z.url(),
      position: z.string(),
      badges: z.array(z.string()).optional(),
      location: z.string(),
      locationType: z.enum(["Remote", "On-site"]),
      logoUrl: z.url(),
      startDate: z.string(),
      endDate: z.string().optional(),
      isCurrentEmployer: z.boolean().default(false).optional(),
      isOngoing: z.boolean().default(false).optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});
export const projects = defineDocs({
  dir: "src/resume/projects",
  docs: {
    schema: frontmatterSchema.extend({
      id: z.string(),
      title: z.string(),
      href: z.url(),
      dates: z.string(),
      active: z.boolean(),
      status: z.union([
        z.enum(["Active", "Completed", "Archived"]),
        z.string(),
      ]),
      description: z.string(),
      technologies: z.array(z.string()),
      links: z
        .array(
          z.object({
            label: z.string(),
            url: z.url(),
            icon: iconZodSchema.optional(),
          }),
        )
        .optional(),
      image: z.url().optional(),
      video: z.url().optional(),
      tags: z.array(z.string()).optional(),
      metrics: z
        .array(
          z.object({
            label: z.string(),
            value: z.number(),
          }),
        )
        .optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
    remarkPlugins: [remarkImage, remarkStructure, remarkNpm, remarkMdxMermaid],
    remarkNpmOptions: {
      persist: {
        id: "package-manager",
      },
    },
    rehypeCodeOptions: {
      lazy: true,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      langs: [
        "js",
        "json",
        "sql",
        "bash",
        "shell",
        "html",
        "css",
        "ts",
        "tsx",
        "jsx",
        "py",
        "python",
        "go",
        "rust",
        "yaml",
        "cmd",
      ],
      tab: true,
    },
  },
  plugins: [lastModified()],
});
