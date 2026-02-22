import { Socials } from "@/components/socials";
import { appConfig } from "root/project.config";
import { generateMetadata } from "~/utils/seo";
import { BookACallForm } from "./client";

export default function ContactPage() {
  return (
    <>
      <section className="relative px-4 pt-10">
        <div className="mt-24 mb-6 flex w-full flex-col items-center text-balance">
          <h2 className="text-shadow-glow relative z-2 text-5xl font-medium tracking-tight text-balance sm:text-5xl md:mb-36 md:text-6xl text-center !mb-0">
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
        <BookACallForm />
        {/* <Tabs
          defaultValue="book-call"
          className="gap-2 flex w-full flex-col justify-center"
        >
          <TabsList className="mx-auto my-4 md:px-4">
            <TabsTrigger value="book-call">Book a call</TabsTrigger>
            <TabsTrigger value="fill-form">Fill a form</TabsTrigger>
          </TabsList>
          <TabsContent value="book-call">
          </TabsContent>
          <TabsContent value="fill-form">
            <ContactForm />
          </TabsContent>
        </Tabs> */}
      </section>
    </>
  );
}

export const metadata = generateMetadata({
  title: "Contact ",
  description: `Get in touch with ${appConfig.displayName} — reach out for collaborations, freelance opportunities, or professional inquiries. Book a call or fill out the contact form to connect directly.`,
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
