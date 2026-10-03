import { createServerFn } from "@tanstack/react-start";
import { getReadTime, source } from "@/lib/source";

export type WritingPost = {
  url: string;
  title: string;
  description?: string;
  date: string | null;
  category: string;
  readTime: number;
};

/** Every doc, newest first, with read time; shaped here so list pages render it as is. */
export const getWriting = createServerFn({ method: "GET" }).handler(async (): Promise<WritingPost[]> => {
  const pages = source
    .getPages()
    .toSorted((a, b) => new Date(b.data.lastModified ?? 0).getTime() - new Date(a.data.lastModified ?? 0).getTime());
  return Promise.all(
    pages.map(async (p) => ({
      url: p.url,
      title: p.data.title,
      description: p.data.description,
      date: p.data.lastModified ? new Date(p.data.lastModified).toISOString() : null,
      category: p.slugs[0] ?? "notes",
      readTime: await getReadTime(p),
    })),
  );
});
