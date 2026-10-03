import { createCsrfMiddleware, createMiddleware, createStart } from "@tanstack/react-start";

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

// Static assets get the same set from public/_headers.
const securityHeaders = createMiddleware().server(async ({ next }) => {
  const result = await next();
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    result.response.headers.set(name, value);
  }
  return result;
});

export const startInstance = createStart(() => ({
  requestMiddleware: [
    createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" }),
    securityHeaders,
  ],
}));
