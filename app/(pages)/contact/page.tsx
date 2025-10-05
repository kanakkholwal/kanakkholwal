import { Socials } from "@/components/socials";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import { appConfig } from "root/project.config";
import { BookACallForm, ContactForm } from "./client";

export default function ContactPage() {
  return (
    <>
      <section className="relative px-4 pt-10">
        <div className="mt-24 mb-6 flex w-full flex-col items-center text-balance">
          <h2
            className="text-shadow-glow relative z-2 text-5xl font-medium tracking-tight text-balance sm:text-5xl md:mb-36 md:text-6xl text-center !mb-0"
            
          >
            <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
              Contact
            </p>
            <span className="font-instrument-serif">
              <span className="">Get in touch</span>{" "}
              <span className="text-colorful animate-gradient font-instrument-serif pe-2 tracking-tight italic" />
            </span>
          </h2>
          <a
            href={`mailto:${appConfig.emails[0]}`}
            className="flex items-center gap-2 py-2 font-light outline-hidden transition-all duration-300 cursor-pointer hover:text-black/60 dark:hover:text-white/90 text-xl text-black/85 dark:text-white/85 md:text-2xl"
          >
            {appConfig.emails[0]}
          </a>
          <Socials className="items-center gap-x-1" />
        </div>
        <Tabs
          defaultValue="book-call"
          className="gap-2 flex w-full flex-col justify-center"
        >
          <TabsList className="mx-auto my-4 md:px-4">
            <TabsTrigger value="book-call">Book a call</TabsTrigger>
            <TabsTrigger value="fill-form">Fill a form</TabsTrigger>
          </TabsList>
          <TabsContent value="book-call">
            <BookACallForm />
          </TabsContent>
          <TabsContent value="fill-form">
            <ContactForm />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}

export const metadata: Metadata = {
  title: "Contact ",
  description:
    "Get in touch with Kanak — reach out for collaborations, freelance opportunities, or professional inquiries. Book a call or fill out the contact form to connect directly.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Kanak",
    description:
      "Want to collaborate or discuss a project? Connect with Kanak via email, book a call, or submit a quick contact form.",
    url: `${appConfig.url}/contact`,
    siteName: "Kanak’s Portfolio",
    images: [
      {
        url: `${appConfig.url}/og/contact.png`,
        width: 1200,
        height: 630,
        alt: "Contact Kanak — Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Kanak",
    description:
      "Reach out to Kanak for collaborations, partnerships, or questions — book a call or send a quick message.",
    creator: appConfig.social.twitter,
    images: [`${appConfig.url}/og/contact.png`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};
