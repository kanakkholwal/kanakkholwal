import { appConfig } from "root/project.config";
import { generateOgImage } from "~/og/generator";
import { PortfolioProfileTemplate } from "~/og/og-templates";
import { getRemoteImageAsBase64 } from "~/og/utils";

export const alt = `${appConfig.displayName} - ${appConfig.role}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const imageBase64 = await getRemoteImageAsBase64(appConfig.avatar);
  return generateOgImage(
    <PortfolioProfileTemplate
      siteName={appConfig.siteUrl}
      title={appConfig.displayName}
      role={appConfig.role}
      status="AVAILABLE FOR OPPORTUNITIES"
      authorImage={imageBase64!}
      techStack={appConfig.skill_icons.slice(0, 5)}
    />,
  );
}
