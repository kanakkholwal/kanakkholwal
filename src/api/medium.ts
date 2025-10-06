import { appConfig } from "root/project.config";
import { parseStringPromise } from "xml2js";
import { calculateReadingTime } from "~/utils/string";

export type PostType = {
  title: string;
  link: string;
  pubDate: Date;
  snippet: string;
  thumbnail: string | null;
  tags: string[];
  readingTime: string;
};

export async function getMediumPosts(): Promise<PostType[]> {
  const rssUrl = `https://medium.com/feed/@${appConfig.usernames.medium}`;
  const res = await fetch(rssUrl, { next: { revalidate: 3600 } });
  const xml = await res.text();
  const json = await parseStringPromise(xml);

  return json.rss.channel[0].item.map((item: any) => {
    const content = item["content:encoded"]?.[0] || item.description[0];

    // Strip HTML tags for snippet
    const snippet =
      content
        .replace(/<[^>]+>/g, "")
        .trim()
        .split(/\s+/)
        .slice(0, 50)
        .join(" ") + "...";

    // Extract first image if it matches cdn or common extensions
    const imgMatch = content.match(
      /<img[^>]+src="([^">]*(cdn-images|\.png|\.jpe?g|\.webp|\.gif))"[^>]*>/i,
    );
    const thumbnail = imgMatch ? imgMatch[1] : null;

    // Extract categories/tags
    const tags = (item.category || []).map((c: any) =>
      typeof c === "string" ? c : c._,
    );

    return {
      title: item.title[0],
      link: item.link[0],
      pubDate: new Date(item.pubDate),
      snippet,
      thumbnail,
      tags,
      readingTime: calculateReadingTime(content as string),
    } as PostType;
  });
}
