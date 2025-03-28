import { Icons } from "@/components/icons";
import { CodeIcon, HomeIcon, NotebookIcon } from "lucide-react";

const resume_link =
  "https://docs.google.com/document/d/1WleBXhgUwDkRIfodJCvhPchoVBjaCf7Q/edit?usp=sharing&ouid=109800121336149113874&rtpof=true&sd=true";

export const DATA = {
  name: "Kanak Kholwal",
  initials: "KK",
  url: "https://kanakkholwal.eu.org",
  location: "Rajasthan, India",
  locationLink: "https://www.google.com/maps/place/dausa",
  description:
    "Software Engineer | Passionate about building scalable solutions, automation, and AI-driven products.",
  summary: `I thrive on solving complex problems and building impactful products. From developing scalable architectures to integrating AI solutions, my goal is to create software that makes a real difference. Always eager to learn, contribute to open source, and collaborate with like-minded developers. Check out my work below, and feel free to reach out. My resume is available for download [here](${resume_link}).`,
  avatarUrl: "/me.png",
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
    { href: "/#projects", icon: CodeIcon, label: "Projects" },
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
      X: {
        name: "X",
        url: "https://twitter.com/kanakkholwal",
        icon: Icons.x,
        navbar: true,
      },
      Instagram: {
        name: "Instagram",
        url: "https://instagram.com/kanakkholwal",
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
  work: [
    {
      company: "Textify AI",
      href: "https://textify.ai",
      badges: [],
      location: "Remote",
      title: "Software Developer Intern",
      logoUrl: "/textify-ai.png",
      start: "Dec 2022",
      end: "Jun 2024",
      description:
        "Developed a TypeScript SDK implementing Bitcoin DLC protocol. Led Dockerization and Kubernetes setup for production. Designed AWS S3-based data lake for historical backtesting of Bitcoin trading strategies. Built a cross-platform mobile app with React Native and TypeScript.",
    },
    {
      company: "KoinX",
      href: "https://koinx.com",
      badges: [],
      location: "Remote",
      title: "Frontend Intern",
      logoUrl: "/koinx.png",
      start: "Mar 2024",
      end: "Jun 2024",
      description:
        "Developed a custom Kubernetes controller in Go, automating MySQL and ProxySQL deployments for 2,000+ developers. Implemented MySQL failover automation scripts ensuring seamless master-slave replication and Zookeeper consistency.",
    },
  ],
  education: [
    {
      school: "National Institute of Technology, Hamirpur",
      href: "https://nith.ac.in",
      degree: "B.Tech. (Dual), Electronics and Communication Engineering",
      logoUrl: "/nith.png",
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
      image: "/nexonauts.png",
      video: "",
    },
    {
      title: "College Ecosystem Monorepo",
      href: "https://nith.eu.org",
      dates: "June 2024 - Present",
      active: true,
      description:
        "A scalable, open-source monorepo built for college management, including student portals, dashboards, and more.",
      technologies: ["Next.js", "TypeScript", "Turbopack", "GitHub Actions", "MongoDB", "TailwindCSS", "Shadcn UI"],
      links: [
        { type: "Website", href: "https://nith.eu.org", icon: <Icons.globe className="size-3" /> },
        { type: "Source", href: "https://github.com/kanakkholwal/college-ecosystem", icon: <Icons.github className="size-3" /> },
      ],
      image: "/college-ecosystem.png",
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
        { type: "Package", href: "https://www.npmjs.com/package/nexo-mdx", icon: <Icons.package className="size-3" /> },
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
