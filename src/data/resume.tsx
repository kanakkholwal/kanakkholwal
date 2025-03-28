import { Icons } from "@/components/icons";
import { CodeIcon, HomeIcon, NotebookIcon } from "lucide-react";

const resume_link = "https://docs.google.com/document/d/1WleBXhgUwDkRIfodJCvhPchoVBjaCf7Q/edit?usp=sharing&ouid=109800121336149113874&rtpof=true&sd=true";

export const DATA = {
  name: "Kanak Kholwal",
  initials: "KK",
  url: "https://kanakkholwal.eu.org",
  location: "Rajasthan, India",
  locationLink: "https://www.google.com/maps/place/dausa",
  description: "Software Engineer passionate about building impactful digital solutions.",
  summary: `I thrive on solving real-world problems with code. Whether it's designing scalable systems, contributing to open-source, or architecting seamless user experiences, I love bringing ideas to life. Currently working on innovative projects that push boundaries. My resume is available for download [here](${resume_link}).`,
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
      GitHub: { name: "GitHub", url: "https://github.com/kanakkholwal", icon: Icons.github, navbar: true },
      LinkedIn: { name: "LinkedIn", url: "https://linkedin.com/in/kanakkholwal", icon: Icons.linkedin, navbar: true },
      X: { name: "X (Twitter)", url: "https://twitter.com/kanakkholwal", icon: Icons.x, navbar: true },
      Instagram: { name: "Instagram", url: "https://instagram.com/kanakkholwal", icon: Icons.instagram, navbar: true },
      Email: { name: "Send Email", url: "mailto:kanakkholwal@gmail.com", icon: Icons.email, navbar: false },
    },
  },
  work: [
    {
      company: "Textify AI",
      href: "https://textify.ai",
      location: "Remote",
      title: "Software Developer Intern",
      logoUrl: "/textify-ai.png",
      start: "Dec 2022",
      end: "Jun 2024",
      description:
        "Developed an open-source TypeScript SDK for Bitcoin Discreet Log Contracts (DLC). Spearheaded Dockerization of microservices and deployed a Kubernetes cluster for production. Architected an AWS S3 & Athena-powered data lake for historical Bitcoin trading strategy analysis. Built a mobile app using React Native and TypeScript.",
    },
    {
      company: "KoinX",
      href: "https://koinx.com",
      location: "Remote",
      title: "Frontend Intern",
      logoUrl: "/koinx.png",
      start: "Mar 2024",
      end: "Jun 2024",
      description:
        "Designed and implemented a custom Kubernetes controller in Go to automate MySQL and ProxySQL deployments, streamlining database management for 2,000+ developers. Developed automation scripts for MySQL failover while maintaining master-slave replication and Zookeeper consistency.",
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
        "Built an open-source platform empowering frontend developers and designers with curated themes, templates, and tools, fostering innovation in web development.",
      technologies: ["Next.js", "TypeScript", "MongoDB", "TailwindCSS", "Stripe", "Shadcn UI"],
      links: [
        { type: "Website", href: "https://nexonauts.com", icon: <Icons.globe className="size-3" /> },
        { type: "Source", href: "https://github.com/kanakkholwal/nexonauts", icon: <Icons.github className="size-3" /> },
      ],
      image: "/nexonauts.png",
    },
    {
      title: "College Ecosystem Monorepo",
      href: "https://nith.eu.org",
      dates: "June 2024 - Present",
      active: true,
      description:
        "Developed a centralized, multi-functional platform for educational institutions. Open-source, scalable, and designed to streamline student and faculty management.",
      technologies: ["Next.js", "TypeScript", "Turbopack", "GitHub Actions", "MongoDB", "TailwindCSS", "Shadcn UI", "Magic UI"],
      links: [
        { type: "Website", href: "https://nith.eu.org", icon: <Icons.globe className="size-3" /> },
        { type: "Source", href: "https://github.com/kanakkholwal/college-ecosystem", icon: <Icons.github className="size-3" /> },
      ],
      image: "/college-ecosystem.png",
    },
    {
      title: "Markdown Editor React",
      href: "https://github.com/kanakkholwal/nexo-mdx",
      dates: "June 2024",
      active: true,
      description:
        "Developed a customizable, accessible, and type-safe markdown editor for developers, with seamless integration into web applications.",
      technologies: ["React.js", "TypeScript", "TailwindCSS", "Shadcn UI", "NPM", "GitHub Actions"],
      links: [
        { type: "Package", href: "https://www.npmjs.com/package/nexo-mdx", icon: <Icons.package className="size-3" /> },
        { type: "Source", href: "https://github.com/kanakkholwal/nexo-mdx", icon: <Icons.github className="size-3" /> },
      ],
    },
  ],
};
