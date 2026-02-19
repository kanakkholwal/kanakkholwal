import { TimelineProjectGrid } from "@/components/extended/timeline";
import { getProjectList } from "@/lib/project.source";
import Link from "next/link";

const projectsList = getProjectList().map(({body,...rest}) => ({
  ...rest,
}));


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
        <TimelineProjectGrid
          yearFilter={["2024", "2025"]}
          projectsList={projectsList}
        />
      </>
    ),
  },
  {
    title: "Early 2024",
    content: (
      <>
        <p>
          I joined{" "}
          <Link
            href="https://koinx.com?utm_source=kanak.eu.org"
            className="text-foreground font-medium underline underline-offset-4 decoration-border hover:decoration-primary transition-all"
          >
            KoinX
          </Link>
          , a fast-growing crypto tax and compliance startup. As a Frontend
          Engineer Intern, I focused on building and optimizing frontend
          applications.
        </p>
        <p className="mt-4">
          I worked on customer-facing and B2B platforms while also contributing
          to the company’s internal UI library. I migrated{" "}
          <strong className="text-foreground font-semibold">
            legacy CRA applications to Vite/TypeScript
          </strong>{" "}
          for faster builds, and optimized the multi-language landing pages by
          centralizing sources of truth, which improved{" "}
          <strong className="text-foreground font-semibold">
            SEO and page performance
          </strong>
          .
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
          app for my college. I built that app in just 24 hours.
        </p>
        <p className="mt-4">
          After that, I started learning more about web development and started
          building more projects. I started getting confident with my skills and
          started applying for internships. I got my first internship at{" "}
          <Link
            href="https://www.linkedin.com/company/textifyai"
            className="text-foreground font-medium underline underline-offset-4 decoration-border hover:decoration-primary transition-all"
          >
            Textify AI
          </Link>{" "}
          as a SDE Intern.
        </p>
        <div className="mt-4 p-4 rounded-xl bg-primary/30 border border-border/50 text-sm">
          <p>
            <strong>At Textify:</strong> I designed a drag-and-drop AI tool
            builder, migrated auth to NextAuth, and managed multi-cloud
            deployments (AWS, Azure, GCP).
          </p>
        </div>
      </>
    ),
  },
];
