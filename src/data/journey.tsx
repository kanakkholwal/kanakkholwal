import Image from "next/image";
import { DATA } from "./resume";

export const journey_data = [
  {
    title: "Mid 2024",
    content: (
      <>
        <p>
          I burned out with internships and needed a break. So I worked on some
          personal projects, Data Structures and Algorithms, System Design,
          learning new skills and also started contributing to Open Source.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {DATA.projects
            .filter((project) => {
              if (!project.image) return false;
              if (
                project.dates.includes("2024") ||
                project.dates.includes("2025")
              ) {
                return true;
              }
              return false;
            })
            .map((project) => {
              return (
                <a
                  key={project.href}
                  href={project.links[0].href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={500}
                    height={500}
                    className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                  />
                </a>
              );
            })}
        </div>
      </>
    ),
  },
  {
    title: "Early 2024",
    content: (
      <>
        <p>
          I joined{" "}
          <a
            href="https://koinx.com?utm_source=kanak.eu.org"
            className="text-primary hover:underline"
          >
            KoinX
          </a>
          , a fast-growing crypto tax and compliance startup, as a Frontend
          Engineer Intern, I focused on building and optimizing frontend
          applications.
        </p>
        <p>
          I worked on customer-facing and B2B platforms while also contributing
          to the company’s internal UI library. I migrated{" "}
          <strong> legacy CRA applications to Vite/TypeScript</strong> for
          faster builds, and optimized the multi-language landing pages by
          centralizing sources of truth, which improved{" "}
          <strong> SEO and page performance</strong>. My work helped strengthen
          the platform’s user experience and developer efficiency, ensuring
          smoother scaling for global audiences.
        </p>
      </>
    ),
  },
  {
    title: "Late 2022",
    content: (
      <>
        <p>
          I got fascinated with building web apps and web technologies. My first
          noticeable and actually first React.js project was a result ranking
          app for my college. I built that app in just 24 hours, although it was
          my first experience working with React.js, but I was able to complete
          the project, and batchmates, seniors & juniors were very impressed
          with the app. During that project I also learnt to scrape websites
          using nodejs. Although I had no idea about web scraping before that
          project, nor did I have any experience with any database. I ended up
          storing data in JSON files and bundled it in the React.js app and
          deployed that on the Firebase web app.
        </p>
        <p>
          After that I started learning more about web development and started
          building more projects. I started getting confident with my skills and
          started applying for internships. I got my first internship at{" "}
          <a
            href="https://www.linkedin.com/company/textifyai"
            className="text-primary hover:underline"
          >
            Textify AI
          </a>{" "}
          as a SDE Intern.
        </p>
        <p>
          At Textify, an early-stage AI startup, I played a key role in
          developing no-code AI tools. I designed and implemented a
          drag-and-drop AI tool builder that allowed dynamic schema-driven
          prompt execution, replacing rigid hard-coded applications. I also led
          the migration of authentication from AWS Cognito to NextAuth for more
          seamless user/session management, and managed deployments across AWS,
          Azure, and finally GCP using Docker and Cloud Run. Beyond
          infrastructure, I contributed significantly to rewriting and
          stabilizing the legacy codebase, laying the groundwork for scalable
          product growth.
        </p>
      </>
    ),
  },
];
