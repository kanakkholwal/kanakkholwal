import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";

const manifest = {
  id: "kanakkholwal",
  name: appConfig.displayName,
  short_name: appConfig.shortName,
  description: appConfig.description,
  icons: [
    {
      src: "./favicon/web-app-manifest-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "./favicon/web-app-manifest-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
  theme_color: "#0d9488",
  background_color: "#0d9488",
  start_url: "/",
  scope: ".",
  display: "standalone",
  orientation: "portrait-primary",
};

export const Route = createFileRoute("/manifest.webmanifest")({
  server: {
    handlers: {
      GET: () =>
        Response.json(manifest, {
          headers: {
            "Content-Type": "application/manifest+json",
            "Cache-Control": "public, max-age=86400",
          },
        }),
    },
  },
});
