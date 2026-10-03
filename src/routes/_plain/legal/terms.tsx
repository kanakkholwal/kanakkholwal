import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";
import TermsPage from "~/features/legal/terms";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_plain/legal/terms")({
  head: () =>
    seo({
      title: "Terms",
      description: `Terms and Conditions for the ${appConfig.displayName} portfolio site. Rules for using this website.`,
      path: "/legal/terms",
      keywords: ["terms and conditions", "portfolio terms", "legal"],
    }),
  component: TermsPage,
});
