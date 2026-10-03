# Running and deploying

TanStack Start on Cloudflare Workers, built with Vite.

## Local

```bash
bun install
bun dev          # http://portfolio.localhost via portless
bun run dev:app  # plain `vite dev` on a port, no portless
bun run preview  # production build running in workerd
```

Env loads like the Next.js build did: TanStack Start reads `.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local` into `process.env` (`.env.development` for dev, `.env.production` for build/preview). Server keys must be declared in `wrangler.jsonc` (`secrets`/`vars`) to reach the Worker; after changing them run `bun run cf-typegen`. Names are in `.env.example`.

## Deploy

```bash
bunx wrangler login
bun run build
bunx wrangler deploy --secrets-file .env.production   # first deploy: uploads the required secrets
bun run deploy                                       # later deploys; rotate with `wrangler secret put <NAME>`
```

Required Worker secrets: `GITHUB_TOKEN`, `PROJECTS_CE_TOKEN`, `GA_SERVICE_ACCOUNT_KEY`, `POSTHOG_PERSONAL_API_KEY` (see `wrangler.jsonc`).

CI (`.github/workflows/cd-deploy.yml`) needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets. PRs upload a preview version; `workflow_dispatch` on `main` deploys.

Point the custom domain (`kanakkholwal.eu.org`) at the Worker under Workers & Pages → Settings → Domains & Routes.

## Notes

- Worker upload is about 2.7 MB gzipped (`wrangler deploy --dry-run`), mostly the takumi OG-image wasm and fumadocs. That fits Workers Paid (10 MB) and sits just under the Free plan's 3 MB cap.
- Data is cached in two layers (`src/lib/cache.ts`): `memo` per isolate, and `edgeMemo` on the Cache API so every isolate in a data centre shares one result. The Cache API is a no-op on `*.workers.dev`, so the shared layer only works on the custom domain. Failed or partial results are never shared and retry after a minute.
- Server functions send `Cache-Control` so browsers reuse responses (`src/server/http-cache.ts`); page HTML is never cached.
- Upstream calls stay under the subrequest limit by batching: one bulk npm request for unscoped packages, one GraphQL query for every repo's stars, GA `batchRunReports`, and four HogQL queries per PostHog project.
- PostHog needs `POSTHOG_PERSONAL_API_KEY` (scope Query: Read) as a Worker secret; project ids are public and live in `project.config.ts`.
- OG images are cached for a day under their URL. After changing a card template, bump `OG_VERSION` in `src/og/version.ts` so browsers and social platforms fetch the new one.
- Images use Unpic (`src/components/image.tsx`). Set `VITE_CF_IMAGE_DOMAIN` at build time once Image Transformations are enabled on the zone to get resized `srcset`s.
