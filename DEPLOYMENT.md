# Running and deploying

TanStack Start on Cloudflare Workers, built with Vite.

## Local

```bash
bun install
bun dev          # http://portfolio.localhost via portless
bun run dev:app  # plain `vite dev` on a port, no portless
bun run preview  # production build running in workerd
```

Secrets for local dev go in `.dev.vars` (dotenv format, git-ignored). Names are in `.env.example`; `cp .env.development .dev.vars` works if you still have the Vercel-pulled file. Without them, GitHub and GA sections degrade to fallbacks.

## Deploy

```bash
bunx wrangler login
bunx wrangler secret put GITHUB_TOKEN
bunx wrangler secret put PROJECTS_CE_TOKEN
bunx wrangler secret put GA_SERVICE_ACCOUNT_KEY
bunx wrangler secret put GA_SITE_PROPERTY_ID   # optional, overrides project.config.ts
bun run deploy
```

CI (`.github/workflows/cd-deploy.yml`) needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets. PRs upload a preview version; `workflow_dispatch` on `main` deploys.

Point the custom domain (`kanakkholwal.eu.org`) at the Worker under Workers & Pages → Settings → Domains & Routes.

## Notes

- Worker upload is ~3.0 MB gzipped (recharts SSR and the takumi OG-image wasm are the bulk). Fits Workers Paid (10 MB); right at the Free plan's 3 MB cap.
- Data caching is per-isolate memory (`src/lib/cache.ts`), replacing Next's `unstable_cache`. There is no ISR; pages render on request.
- `next/image` is now a plain `<img>` (`@/components/image`); there is no image optimizer.
