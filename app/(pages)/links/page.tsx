import { appConfig } from "root/project.config";
import { generateMetadata } from "~/utils/seo";
import LinksPageClient from "./client";

export const metadata = generateMetadata({
  title: `Links | ${appConfig.displayName}`,
  description: `Connect with ${appConfig.displayName}. Socials, portfolio, and contact info.`,
  path: "/links",
});

export default function LinksPage() {
  return (
    <LinksPageClient
      displayName={appConfig.displayName}
      avatar={appConfig.avatar}
      email={appConfig.emails[0]}
      url={appConfig.url}
    />
  );
}
