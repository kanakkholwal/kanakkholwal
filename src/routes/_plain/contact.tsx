import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";
import ContactPageClient from "~/features/contact/client";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_plain/contact")({
  head: () =>
    seo({
      title: "Contact",
      description: `Get in touch with ${appConfig.displayName}  reach out for collaborations, freelance opportunities, or professional inquiries. Book a call or fill out the contact form to connect directly.`,
      path: "/contact",
      keywords: [
        "contact",
        "get in touch",
        "collaborate",
        "freelance",
        "inquiries",
        "book a call",
        "contact form",
        appConfig.displayName,
        "developer",
        "designer",
        "freelancer",
        "problem solver",
      ],
    }),
  component: ContactPage,
});

function ContactPage() {
  return <ContactPageClient displayName={appConfig.displayName} email={appConfig.emails[0]} />;
}
