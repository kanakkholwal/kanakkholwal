import { z } from "zod";

// Missing secrets degrade to fallbacks instead of failing the request.
const serverEnvSchema = z.object({
  GITHUB_TOKEN: z.string().min(1).optional(),
  PROJECTS_CE_TOKEN: z.string().min(1).optional(),
  GA_SERVICE_ACCOUNT_KEY: z.string().min(1).optional(),
  GA_SITE_PROPERTY_ID: z.string().min(1).optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

const blankToUndefined = (value: string | undefined) => value || undefined;

/**
 * Validated server env, read per request as the TanStack Start guide requires on Workers
 * (process.env is bound at request time there, so never read it at module scope).
 */
export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse({
    GITHUB_TOKEN: blankToUndefined(process.env.GITHUB_TOKEN),
    PROJECTS_CE_TOKEN: blankToUndefined(process.env.PROJECTS_CE_TOKEN),
    GA_SERVICE_ACCOUNT_KEY: blankToUndefined(process.env.GA_SERVICE_ACCOUNT_KEY),
    GA_SITE_PROPERTY_ID: blankToUndefined(process.env.GA_SITE_PROPERTY_ID),
  });
}
