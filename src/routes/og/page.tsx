import { createFileRoute } from "@tanstack/react-router";
import { generateOgImage } from "~/og/generator";
import { PageOgTemplate } from "~/og/og-templates";

const clip = (value: string | null, max: number) => (value ?? "").slice(0, max);

export const Route = createFileRoute("/og/page")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const params = new URL(request.url).searchParams;
        const path = clip(params.get("path"), 80) || "/";
        return generateOgImage(
          <PageOgTemplate
            title={clip(params.get("title"), 60) || "Kanak Kholwal"}
            description={clip(params.get("description"), 140) || undefined}
            path={path.startsWith("/") ? path : `/${path}`}
          />,
        );
      },
    },
  },
});
