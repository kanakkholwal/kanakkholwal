import { appConfig } from "root/project.config";
import { generateOgImage } from "./generator";
import { PortfolioProfileTemplate } from "./og-templates";
import { getRemoteImageAsBase64 } from "./utils";

/** Site-wide social card served at /opengraph-image and /twitter-image. */
export async function profileImageResponse() {
  const authorImage = await getRemoteImageAsBase64(appConfig.avatar);
  const { frontend, devops, backend, tools } = appConfig.skills;
  return generateOgImage(
    <PortfolioProfileTemplate
      siteName={appConfig.siteUrl}
      title={appConfig.displayName}
      role={appConfig.role}
      status="AVAILABLE FOR OPPORTUNITIES"
      authorImage={authorImage ?? ""}
      techStack={[...frontend, ...devops, ...backend, ...tools].slice(0, 5)}
    />,
  );
}
