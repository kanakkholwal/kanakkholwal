import { cache } from "react";

type Font = {
  name: string;
  data: ArrayBuffer;
  style: "normal" | "italic";
  weight: 400 | 500 | 600 | 700;
};

// 1. Module-level variable for In-Memory Caching (Hot Lambdas)
// This persists as long as the serverless function container is alive.
let loadedFonts: Font[] | null = null;

export const getFonts = cache(async (): Promise<Font[]> => {
  // If fonts are already in memory, return them instantly.
  if (loadedFonts) {
    return loadedFonts;
  }

  const spaceGroteskUrl =
    "https://cdn.jsdelivr.net/npm/@fontsource/space-grotesk@5.0.1/files/space-grotesk-latin-700-normal.woff";
  const jetBrainsMonoUrl =
    "https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.1/files/jetbrains-mono-latin-500-normal.woff";
  const instrumentSerifUrl =
    "https://cdn.jsdelivr.net/npm/@fontsource/instrument-serif@5.0.1/files/instrument-serif-latin-400-normal.woff";

  const [spaceGroteskBold, jetBrainsMono, instrumentSerif] = await Promise.all([
    // 2. Use { cache: 'force-cache' } for Persistent Caching (Cold Starts)
    // This tells Next.js to store the file in the Data Cache after the first download.
    fetch(spaceGroteskUrl, { cache: "force-cache" }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch Space Grotesk");
      return res.arrayBuffer();
    }),

    fetch(jetBrainsMonoUrl, { cache: "force-cache" }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch JetBrains Mono");
      return res.arrayBuffer();
    }),

    fetch(instrumentSerifUrl, { cache: "force-cache" }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch Instrument Serif");
      return res.arrayBuffer();
    }),
  ]);

  loadedFonts = [
    {
      name: "Space Grotesk",
      data: spaceGroteskBold,
      style: "normal",
      weight: 700,
    },
    {
      name: "JetBrains Mono",
      data: jetBrainsMono,
      style: "normal",
      weight: 500,
    },
    {
      name: "Instrument Serif",
      data: instrumentSerif,
      style: "normal",
      weight: 400,
    },
  ];

  return loadedFonts;
});
