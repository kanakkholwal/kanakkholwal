import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";
import ContactPageClient from "~/features/contact/client";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_plain/contact")({
  head: () =>
    seo({
      title: "Contact",
      description: `Get in touch with ${appConfig.displayName} about a project, a role or an idea. Send a message or book a call.`,
      path: "/contact",
      keywords: ["contact", "get in touch", "book a call", "freelance", appConfig.displayName, "product engineer"],
    }),
  component: ContactPageClient,
});
