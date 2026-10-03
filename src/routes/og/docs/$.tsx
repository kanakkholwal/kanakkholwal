import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";
import { getReadTime, source } from "@/lib/source";
import { generateOgImage } from "~/og/generator";
import { ArticleOgTemplate } from "~/og/og-templates";

export const Route = createFileRoute("/og/docs/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        // Page metadata links `/og/docs/<slugs>/image.png`; the trailing file name is cosmetic.
        const slugs = (params._splat ?? "").split("/").filter((s) => s && s !== "image.png");
        const page = source.getPage(slugs);
        if (!page) return new Response("Not found", { status: 404 });

        return generateOgImage(
          <ArticleOgTemplate
            title={page.data.title}
            meta={[`${await getReadTime(page)} min read`, ...(page.data.tags ?? []).slice(0, 2)].join(" · ")}
            url={`${appConfig.siteUrl}/docs`}
            dark={new URL(request.url).searchParams.get("dark") === "true"}
          />,
        );
      },
    },
  },
});
