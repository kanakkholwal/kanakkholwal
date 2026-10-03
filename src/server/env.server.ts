import { env } from "cloudflare:workers";
import { z } from "zod";

// Every secret is optional: features without one degrade to fallbacks instead of failing the request.
const serverEnvSchema = z.object({
  GITHUB_TOKEN: z.string().min(1).optional(),
  PROJECTS_CE_TOKEN: z.string().min(1).optional(),
  GA_SERVICE_ACCOUNT_KEY: z.string().min(1).optional(),
  GA_SITE_PROPERTY_ID: z.string().min(1).optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/** Validated Worker secrets from the `cloudflare:workers` binding. Call inside handlers, not at module scope. */
export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse({
    GITHUB_TOKEN: env.GITHUB_TOKEN || undefined,
    PROJECTS_CE_TOKEN: env.PROJECTS_CE_TOKEN || undefined,
    GA_SERVICE_ACCOUNT_KEY: env.GA_SERVICE_ACCOUNT_KEY || undefined,
    GA_SITE_PROPERTY_ID: env.GA_SITE_PROPERTY_ID || undefined,
  });
}
