import { fileURLToPath } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { defineConfig } from "vite";

const root = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    // Explicit too: tsconfigPaths only covers files tsconfig includes, and .mdx imports `@/` components.
    alias: [
      { find: /^@\//, replacement: root("./@/") },
      { find: /^~\//, replacement: root("./src/") },
      { find: /^root\//, replacement: root("./") },
    ],
  },
  // These are only imported from .mdx content, which Vite's dep scanner can't read. Left undeclared, dev finds
  // them mid-session, re-bundles and reloads, and any in-flight lazy import() fails.
  optimizeDeps: { include: ["mermaid"] },
  environments: {
    ssr: {
      optimizeDeps: {
        include: ["fumadocs-ui/components/github-info", "fumadocs-ui/components/tabs"],
        // Client-only (see components/mdx/mermaid.tsx); never loaded in the Worker.
        exclude: ["mermaid"],
      },
    },
  },
  plugins: [
    mdx(),
    tailwindcss(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    viteReact(),
  ],
});
