import { NextRequest } from "next/server";
import { appConfig } from "root/project.config";
import { projectsList } from "~/data/projects";
import { generateOgImage } from "~/og/generator";
import { ProjectOgTemplate } from "~/og/og-templates";


// Image metadata
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const project = projectsList.find((p) => p.id === searchParams.get("slug"));

    if (!project) {
        return generateOgImage(
            <ProjectOgTemplate
                siteName={appConfig.siteUrl}
                title="Project Not Found"
                description="The requested project could not be located."
                status="404"
                metrics={[]}
                dates="N/A"
            />
        );
    }

    // 4. GENERATE IMAGE
    return generateOgImage(
        <ProjectOgTemplate
            siteName={appConfig.siteUrl}
            title={project.title}
            description={project.description.slice(0, 100) + "..."} // Truncate for design safety
            dates={project.dates || new Date().getFullYear().toString()}
            status={project.status}
            metrics={project.metrics}
        />
    );
}