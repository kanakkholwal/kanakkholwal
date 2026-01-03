import { appConfig } from "root/project.config";
import { generateOgImage } from "~/og/generator";
import { PortfolioProfileTemplate } from "~/og/og-templates";
import { getRemoteImageAsBase64 } from "~/og/utils";

// export const runtime = "edge";

export const alt = `${appConfig.name} - Full Stack Engineer`;
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default async function Image() {
    const imageBase64 = await getRemoteImageAsBase64(appConfig.logo);
    return generateOgImage(
        <PortfolioProfileTemplate
            siteName="KANAK.EU.ORG"
            title={appConfig.name}
            role="Full Stack Engineer"
            status="AVAILABLE FOR OPPORTUNITIES"
            authorImage={imageBase64!}
            techStack={appConfig.skills.slice(0,5)}
        />
    );
}