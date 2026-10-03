type Font = {
  name: string;
  data: ArrayBuffer;
  style: "normal" | "italic";
  weight: 400 | 500 | 600 | 700;
};

const FONT_SOURCES = [
  {
    name: "Space Grotesk",
    weight: 700,
    url: "https://cdn.jsdelivr.net/npm/@fontsource/space-grotesk@5.0.1/files/space-grotesk-latin-700-normal.woff",
  },
  {
    name: "JetBrains Mono",
    weight: 500,
    url: "https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.1/files/jetbrains-mono-latin-500-normal.woff",
  },
  {
    name: "Instrument Serif",
    weight: 400,
    url: "https://cdn.jsdelivr.net/npm/@fontsource/instrument-serif@5.0.1/files/instrument-serif-latin-400-normal.woff",
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
