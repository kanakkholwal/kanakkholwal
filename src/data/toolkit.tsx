/**
 * Represents a toolkit containing device information and a list of tools.
 *
 * @property {Object} device - Information about the device.
 * @property {string} device.mockup - URL of the device mockup image.
 * @property {string} device.name - Name of the device.
 *
 * @property {Array<Object>} tools - List of tools with their details.
 * @property {string} tools[].image - URL of the tool's logo image.
 *   (Image credits: aayushbharti.in)
 * @property {string} tools[].label - Name of the tool.
 * @property {string} tools[].href - URL to the tool's website.
 */
export const toolKit = {
  device: {
    mockup:
      "https://www.asus.com/websites/global/products/vuly02jyj5aookmy/v1/features/images/tablet/04_Design_02.jpg",
    name: "ASUS TUF Gaming A15",
  },
  tools: [
    {
      image: "https://aayushbharti.in/uses/arc_logo.png",
      label: "Arc",
      href: "https://arc.net/",
    },
    {
      image: "https://aayushbharti.in/uses/vscode_logo.png",
      label: "VSCode",
      href: "https://code.visualstudio.com/",
    },
    {
      image: "https://aayushbharti.in/uses/notion_logo.png",
      label: "Notion",
      href: "https://www.notion.so/",
    },
    {
      image: "https://aayushbharti.in/uses/spotify_logo.png",
      label: "Spotify",
      href: "https://www.spotify.com/",
    },
    {
      image: "https://aayushbharti.in/uses/figma_logo.png",
      label: "Figma",
      href: "https://www.figma.com/",
    },
    {
      image: "https://aayushbharti.in/uses/linear_logo.png",
      label: "Linear",
      href: "https://linear.app/",
    },
  ],
};
