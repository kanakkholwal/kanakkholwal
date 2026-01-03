import { appConfig } from "root/project.config";
import { generateOgImage } from "~/og/generator";
import { PortfolioOgTemplate } from "~/og/og-templates";

// export const runtime = "edge";

export const alt = `${appConfig.name} - Full Stack Engineer`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
    return generateOgImage(
        <PortfolioOgTemplate
            // Defaults are handled in the component, but we can override:
            title={appConfig.name}
            role="Building Digital Ecosystems"
            techStack={appConfig.skills.slice(0, 5)}
            siteName={appConfig.url.replace("https://", "")}
            status="Open for Opportunities"
        />
    );
}