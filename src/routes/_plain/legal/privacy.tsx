import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";
import PrivacyPolicyPage from "~/features/legal/privacy";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_plain/legal/privacy")({
  head: () =>
    seo({
      title: "Privacy Policy",
      description: `Privacy Policy for the ${appConfig.displayName} portfolio site. Explains what data is collected and how it is used.`,
      path: "/legal/privacy",
      keywords: ["privacy policy", "portfolio", "personal site", "cookies"],
    }),
  component: PrivacyPolicyPage,
});
