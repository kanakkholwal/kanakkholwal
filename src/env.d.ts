/// <reference types="vite/client" />

// Public, inlined into the client bundle at build time. Only VITE_-prefixed vars reach import.meta.env.
interface ImportMetaEnv {
  /** Cloudflare zone with Image Transformations enabled, e.g. `kanakkholwal.eu.org`. Unset: images load as-is. */
  readonly VITE_CF_IMAGE_DOMAIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Worker secrets: `wrangler secret put` in production, `.dev.vars` locally. Read via getServerEnv().
declare namespace Cloudflare {
  interface Env {
    GITHUB_TOKEN?: string;
    PROJECTS_CE_TOKEN?: string;
    GA_SERVICE_ACCOUNT_KEY?: string;
    GA_SITE_PROPERTY_ID?: string;
  }
}

// Only `env` is used. `wrangler types` runtime types would also retype browser globals for client code.
declare module "cloudflare:workers" {
  export const env: Cloudflare.Env;
}
