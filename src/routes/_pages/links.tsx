import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";
import LinksPageClient from "~/features/links/client";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_pages/links")({
  head: () =>
    seo({
      title: `Links | ${appConfig.displayName}`,
      description: `Connect with ${appConfig.displayName}. Socials, portfolio, and contact info.`,
      path: "/links",
    }),
  component: LinksPage,
});

function LinksPage() {
  return (
    <LinksPageClient
      displayName={appConfig.displayName}
      avatar={appConfig.avatar}
      email={appConfig.emails[0]}
      url={appConfig.url}
    />
  );
}
