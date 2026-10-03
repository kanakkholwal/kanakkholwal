import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";
import LinksPageClient from "~/features/links/client";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_pages/links")({
  head: () =>
    seo({
      title: `Links | ${appConfig.displayName}`,
      description: `Everywhere ${appConfig.displayName} is online: email, resume, socials and a way to book a call.`,
      path: "/links",
    }),
  component: LinksPageClient,
});
