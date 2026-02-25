import { appConfig } from "root/project.config";
import { generateMetadata } from "~/utils/seo";
import AttributionPageClient from "./client";

export const metadata = generateMetadata({
  title: "Attribution | Credits",
  description:
    "Acknowledging the open-source giants and designers who inspired this portfolio.",
  path: "/attribution",
});

export default function AttributionPage() {
  return (
    <AttributionPageClient
      journey={appConfig.attribution.journey}
      credits={appConfig.attribution.list}
      displayName={appConfig.displayName}
      email={appConfig.emails[0]}
    />
  );
}
