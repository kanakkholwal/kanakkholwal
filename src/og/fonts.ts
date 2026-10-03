type Font = {
  name: string;
  data: ArrayBuffer;
  style: "normal" | "italic";
  weight: 400 | 500 | 600 | 700;
};

const CDN = "https://cdn.jsdelivr.net/npm";
const FONT_SOURCES = [
  { name: "Geist", weight: 400, url: `${CDN}/@fontsource/geist@5.2.8/files/geist-latin-400-normal.woff` },
  { name: "Geist", weight: 600, url: `${CDN}/@fontsource/geist@5.2.8/files/geist-latin-600-normal.woff` },
  {
    name: "Geist Mono",
    weight: 400,
    url: `${CDN}/@fontsource/geist-mono@5.2.7/files/geist-mono-latin-400-normal.woff`,
  },
] as const;

// Per-isolate; a cold isolate refetches from jsDelivr.
let loadedFonts: Font[] | null = null;

export async function getFonts(): Promise<Font[]> {
  if (loadedFonts) return loadedFonts;
  const data = await Promise.all(
    FONT_SOURCES.map(async ({ name, url }) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${name}`);
      return res.arrayBuffer();
    }),
  );
  loadedFonts = FONT_SOURCES.map(({ name, weight }, i) => ({
    name,
    weight,
    style: "normal" as const,
    data: data[i],
  }));
  return loadedFonts;
}
