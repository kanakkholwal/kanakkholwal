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
  plugins: [
    mdx(),
    tailwindcss(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    viteReact(),
  ],
});
