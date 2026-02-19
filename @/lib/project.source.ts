import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { projects } from "fumadocs-mdx:collections/server";
import { appConfig } from "root/project.config";
import { getEnvironmentDev } from "~/utils/env";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/projects",
  source: projects.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export type ProjectType = InferPageType<typeof source>["data"];

export function getProjectList(): ProjectType[] {
  return source.getPages().map((page) => page.data);
}
export function getOtherProjects(currentProjectId: string): ProjectType[] {
  return source
    .getPages()
    .filter((page) => page.data.id !== currentProjectId)
    .map((page) => page.data);
}

export function getPageImage(page: InferPageType<typeof source>) {
  if (getEnvironmentDev()) {
    return `http://localhost:${process.env.PORT || 3000}/api/og?gen_type=project&slug=${page.data.id}`;
  }
  return appConfig.url + `/api/og?gen_type=project&slug=${page.data.id}`;
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
}
