import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { workExperiences } from "fumadocs-mdx:collections/server";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/work",
  source: workExperiences.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export type WorkExperienceType = InferPageType<typeof source>["data"];

export function getWorkExperienceList(): WorkExperienceType[] {
  return source.getPages().map((page) => page.data);
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
}
