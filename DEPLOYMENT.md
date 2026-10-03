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

CI (`.github/workflows/cd-deploy.yml`) needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets. PRs upload a preview version; `workflow_dispatch` on `main` deploys.

Point the custom domain (`kanakkholwal.eu.org`) at the Worker under Workers & Pages → Settings → Domains & Routes.

## Notes

- Worker upload is ~3.0 MB gzipped (recharts SSR and the takumi OG-image wasm are the bulk). Fits Workers Paid (10 MB); right at the Free plan's 3 MB cap.
- Data caching is per-isolate memory (`src/lib/cache.ts`), replacing Next's `unstable_cache`. There is no ISR; pages render on request.
- Images use Unpic (`@/components/image`). Set `VITE_CF_IMAGE_DOMAIN` at build time once Image Transformations are enabled on the zone to get resized `srcset`s.
