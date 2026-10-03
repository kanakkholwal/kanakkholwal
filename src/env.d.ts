/// <reference types="vite/client" />

// Public, inlined into the client bundle at build time. Only VITE_-prefixed vars reach import.meta.env.
// Server vars (process.env) are typed by worker-configuration.d.ts: `bun run cf-typegen`.
interface ImportMetaEnv {
  /** Cloudflare zone with Image Transformations enabled, e.g. `kanakkholwal.eu.org`. Unset: images load as-is. */
  readonly VITE_CF_IMAGE_DOMAIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
