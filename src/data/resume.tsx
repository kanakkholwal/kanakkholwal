import { Icons } from "@/components/icons/icons";
import { CodeIcon, HomeIcon, NotebookIcon } from "lucide-react";

export const WorkExperience = [
  {
    company: "Textify AI",
    href: "https://textify.ai",
    badges: [],
    location: "Remote",
    title: "Software Developer Intern",
    logoUrl: "https://2hy7y2bvb4.ufs.sh/f/zWIvIoJSZF4QYH4HQCOnd4FsWwGtc1QjmblpSJE5xBn6y73Y",
    start: "Dec 2022",
    end: "Jun 2024",
    description: `
- Built and maintained core platform features, improving engagement by 220%.
- Led the development of the initial design system and codebase structure.
- Fortified platform security by integrating multi-factor authentication through AWS Cognito; reduced unauthorized access attempts and improved overall platform reliability, addressing top security vulnerabilities.
- Developed RESTful APIs and microservices following Agile practices and CI/CD pipelines, enhancing system scalability on Azure and GCP, reducing deployment time by 30%.
      `,
  },
  {
    company: "KoinX",
    href: "https://koinx.com",
    badges: [],
    location: "Remote",
    title: "Frontend Intern",
    logoUrl: "https://2hy7y2bvb4.ufs.sh/f/zWIvIoJSZF4QPeYl8N26Hz53wg87YeZxFt9WfbvpIQLVAXau",
    start: "Mar 2024",
    end: "Jun 2024",
    description: `
- Optimized SEO and page speed, boosting organic traffic by 150%.
- Initiated and led the migration of multiple frontend repositories from CRA to VITE , significantly enhancing build times and performance by 60%.
- Developed internal UI library, significantly enhancing development efficiency and consistency.
`,
  },
] as const;
export const DATA = {
  name: "Kanak Kholwal",
  initials: "KK",
  url: "https://kanakkholwal.eu.org",
  location: "Rajasthan, India",
  locationLink: "https://www.google.com/maps/place/dausa",
  description:
    "Software Engineer | Passionate about building scalable solutions, automation, and AI-driven products.",
  summary: `I thrive on solving complex problems and building impactful products. From developing scalable architectures to integrating AI solutions, my goal is to create software that makes a real difference. Always eager to learn, contribute to open source, and collaborate with like-minded developers. Check out my work below, and feel free to reach out.`,
  avatarUrl: "https://2hy7y2bvb4.ufs.sh/f/zWIvIoJSZF4QODD3M9KxlqUsuHJcSkNd3oRnbL2QzBtj8EM7",
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Go",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "Google Cloud Platform",
    "AI/ML",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "https://kanakkholwal.medium.com", icon: NotebookIcon, label: "Blog" },
    { href: "/projects", icon: CodeIcon, label: "Projects" },
  ],
  contact: {
    email: "kanakkholwal@gmail.com",
    tel: "+123456789",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/kanakkholwal",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/kanakkholwal",
        icon: Icons.linkedin,
        navbar: true,
      },
      Twitter: {
        name: "Twitter",
        url: "https://twitter.com/kanakkholwal",
        icon: Icons.x,
        navbar: true,
      },
      Instagram: {
        name: "Instagram",
        url: "https://www.instagram.com/kanakkholwal",
        icon: Icons.instagram,
        navbar: true,
      },
      Email: {
        name: "Send Email",
        url: "mailto:kanakkholwal@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },
  education: [
    {
      school: "National Institute of Technology, Hamirpur",
      href: "https://nith.ac.in",
      degree: "B.Tech. (Dual), Electronics and Communication Engineering",
      logoUrl: "https://2hy7y2bvb4.ufs.sh/f/zWIvIoJSZF4Q1sGyUyITPZD6mAdTXjKkufM30qH2OYSCoLJI",
      start: "2021",
      end: "2026",
    },
  ],
  projects: [
    {
      title: "Nexonauts",
      href: "https://nexonauts.com",
      dates: "Jan 2024 - Feb 2024",
      active: true,
      description:
        "A platform for frontend developers and designers featuring curated themes, templates, and tools to accelerate web development.",
      technologies: ["Next.js", "TypeScript", "MongoDB", "TailwindCSS", "Stripe", "Shadcn UI"],
      links: [
        { type: "Website", href: "https://nexonauts.com", icon: <Icons.globe className="size-3" /> },
        { type: "Source", href: "https://github.com/kanakkholwal/nexonauts", icon: <Icons.github className="size-3" /> },
      ],
      image: "https://2hy7y2bvb4.ufs.sh/f/zWIvIoJSZF4Q64uPWYLSDg1lxYaJETdBLR4osu532vZFqcUH",
      video: "",
    },
    {
      title: "College Ecosystem Monorepo",
      href: "https://app.nith.eu.org",
      dates: "Jan 2025 - Present",
      active: true,
      description:
        "A scalable, open-source monorepo built for college management, including student portals, dashboards, and more.",
      technologies: ["Next.js", "TypeScript", "Turbopack", "GitHub Actions", "MongoDB", "PostgresQL", "TailwindCSS", "Shadcn UI"],
      links: [
        { type: "Website", href: "https://nith.eu.org", icon: <Icons.globe className="size-3" /> },
        { type: "Source", href: "https://github.com/kanakkholwal/college-ecosystem", icon: <Icons.github className="size-3" /> },
      ],
      image: "https://2hy7y2bvb4.ufs.sh/f/zWIvIoJSZF4Q8fkvTJrLAESoTyORbnBq8xC7wQu4rKdJhHvY",
      video: "",
    },
    {
      title: "Rich Text Editor React",
      href: "https://github.com/kanakkholwal/nexo-editor",
      dates: "August 2025 - August 2025",
      active: true,
      description:
        "A lightweight, customizable Rich Text Editor built on TipTap, designed for modern React projects with support for SSR, Tailwind, ShadCN UI, and plugin extensibility based on prosemirror schema",
      technologies: ["React.js", "TypeScript", "TailwindCSS", "NPM", "GitHub Actions"],
      links: [
        { type: "Docs", href: "https://docs.nexonauts.com/packages/nexo-editor", icon: <Icons.package className="size-3" /> },
        { type: "Package", href: "https://www.npmjs.com/package/nexo-editor", icon: <Icons.npm className="size-3" /> },
        { type: "Source", href: "https://github.com/kanakkholwal/nexo-editor", icon: <Icons.github className="size-3" /> },
      ],
      image: "",
      video: "",
    },
    {
      title: "Markdown Editor React",
      href: "https://github.com/kanakkholwal/nexo-mdx",
      dates: "June 2024 - June 2024",
      active: true,
      description:
        "A highly customizable and accessible Markdown editor with native TypeScript support.",
      technologies: ["React.js", "TypeScript", "TailwindCSS", "Shadcn UI", "NPM", "GitHub Actions"],
      links: [
        { type: "Docs", href: "https://docs.nexonauts.com/packages/nexo-mdx", icon: <Icons.package className="size-3" /> },
        { type: "Package", href: "https://www.npmjs.com/package/nexo-mdx", icon: <Icons.npm className="size-3" /> },
        { type: "Source", href: "https://github.com/kanakkholwal/nexo-mdx", icon: <Icons.github className="size-3" /> },
      ],
      image: "",
      video: "",
    },
    {
      title: "Serverless Mailing System MVP",
      href: "https://github.com/kanakkholwal/mail-system",
      dates: "Feb 2025",
      active: true,
      description:
        "A serverless mailing system built with Next.js and React Mail for scalable email automation.",
      technologies: ["React Mail", "TypeScript", "TailwindCSS", "GitHub Actions", "Serverless"],
      links: [{ type: "Source", href: "https://github.com/kanakkholwal/mail-system", icon: <Icons.github className="size-3" /> }],
      image: "",
      video: "",
    },
    {
      title: "Nexo html2jsx",
      href: "https://www.npmjs.com/package/nexo-html2jsx",
      dates: "June 2023 - June 2023",
      active: true,
      description:
        "npm package designed to facilitate the conversion of HTML strings into JSX syntax. It provides a versatile toolset for developers working with HTML-based content who need to integrate it seamlessly into React applications.",
      technologies: ["React.js", "TypeScript", "React Core", "NPM", "GitHub Actions"],
      links: [
        { type: "Package", href: "https://www.npmjs.com/package/nexo-html2jsx", icon: <Icons.npm className="size-3" /> },
      ],
      image: "",
      video: "",
    },
    {
      title: "Web Crawler for LLMs",
      href: "https://github.com/kanakkholwal/crawler-for-llms",
      dates: "Feb 2025",
      active: true,
      description:
        "A high-performance web crawler designed for LLM fine-tuning and Retrieval-Augmented Generation (RAG) workflows.",
      technologies: ["TypeScript", "Next.js", "Serverless", "Open Source"],
      links: [{ type: "Source", href: "https://github.com/kanakkholwal/crawler-for-llms", icon: <Icons.github className="size-3" /> }],
      image: "",
      video: "",
    },
  ],
} as const;
