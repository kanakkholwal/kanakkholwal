import { fileURLToPath } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { defineConfig } from "vite";

const root = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// Imported only by some routes, so the startup scan misses them. A late SSR re-bundle leaves the Worker with two
// React copies ("Invalid hook call ... reading 'useMemo'"), so pre-bundle them up front.
const LATE_DEPS = [
  "@base-ui/react/checkbox",
  "@base-ui/react/collapsible",
  "@base-ui/react/preview-card",
  "@base-ui/react/scroll-area",
  "@base-ui/react/separator",
  "@base-ui/react/switch",
  "@base-ui/react/tabs",
  "@unpic/react/base",
  "fumadocs-core/toc",
  "unpic",
];

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    // Explicit too: tsconfigPaths only covers files tsconfig includes, and .mdx imports `@/` components.
    alias: [
      { find: /^@\//, replacement: root("./src/") },
      { find: /^~\//, replacement: root("./src/") },
      { find: /^root\//, replacement: root("./") },
    ],
  },
  // These are only imported from .mdx content, which Vite's dep scanner can't read. Left undeclared, dev finds
  // them mid-session, re-bundles and reloads, and any in-flight lazy import() fails.
  optimizeDeps: { include: ["mermaid", ...LATE_DEPS] },
  environments: {
    ssr: {
      optimizeDeps: {
        include: ["fumadocs-ui/components/github-info", "fumadocs-ui/components/tabs", ...LATE_DEPS],
        // Client-only (see components/mdx/mermaid.tsx); never loaded in the Worker.
        exclude: ["mermaid"],
      },
    },
  },
  plugins: [mdx(), tailwindcss(), cloudflare({ viteEnvironment: { name: "ssr" } }), tanstackStart(), viteReact()],
});
