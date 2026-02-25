import { appConfig } from "root/project.config";
import { generateMetadata } from "~/utils/seo";
import ContactPageClient from "./client";

export default function ContactPage() {
  return (
    <ContactPageClient
      displayName={appConfig.displayName}
      email={appConfig.emails[0]}
    />
  );
}

export const metadata = generateMetadata({
  title: "Contact ",
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
});
