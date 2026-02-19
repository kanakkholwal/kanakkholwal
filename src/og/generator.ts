import { ImageResponse } from "next/og";
import { getFonts } from "./fonts";

export type OgImageOptions = {
  width?: number;
  height?: number;
  fonts?: any[]; // Pass in fonts if already fetched to save bandwidth
};

export async function generateOgImage(
  element: React.ReactElement,
  options: OgImageOptions = {},
) {
  // Load fonts if not provided
  const fonts = options.fonts || (await getFonts());

  return new ImageResponse(element, {
    width: options.width || 1200,
    height: options.height || 630,
    fonts: fonts as any, // Type casting for Satori fonts
    // Critical: Satori uses flexbox by default, but we ensure consistency
    emoji: "twemoji",
  });
}
