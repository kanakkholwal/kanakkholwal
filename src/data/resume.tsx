import { Icons } from "@/components/icons";
import { CodeIcon, HomeIcon, NotebookIcon } from "lucide-react";

const resume_link ="https://docs.google.com/document/d/1WleBXhgUwDkRIfodJCvhPchoVBjaCf7Q/edit?usp=sharing&ouid=109800121336149113874&rtpof=true&sd=true";

export const DATA = {
  name: "Kanak Kholwal",
  initials: "KK",
  url: "https://kanakkholwal.eu.org",
  location: "Rajasthan,India",
  locationLink: "https://www.google.com/maps/place/dausa",
  description:
    "Software Engineer. I love building things and helping people.",
  summary:
    `My drive? Crafting practical tools for people's everyday use – there's nothing quite like that "aha" moment when a solution clicks.I'm always looking for new opportunities to learn and grow. I'm passionate about open source and love to contribute to projects that make a difference. I'm currently working on a few projects that I'm excited to share with you. My Resume is available for download [here](${resume_link}).`,
  avatarUrl: "/me.png",
  skills: [
    "React",
    "Next.js",
    "Typescript",
    "Node.js",
    "Go",
    "MongoDB",
    "Postgres",
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
      instagram: {
        name: "Instagram",
        url: "https://instagram.com/kanakkholwal",
        icon: Icons.instagram,
        navbar: true,
      },
      email: {
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
        "Implemented the Bitcoin discreet log contract (DLC) protocol specifications as an open source Typescript SDK. Dockerized all microservices and setup production kubernetes cluster. Architected a data lake using AWS S3 and Athena for historical backtesting of bitcoin trading strategies. Built a mobile app using react native and typescript.",
    },
    {
      company: "KoinX",
      badges: [],
      href: "https://koinx.com",
      location: "Remote",
      title: "Frontend Intern",
      logoUrl: "/koinx.png",
      start: "Mar 2024",
      end: "Jun 2024",
      description:
        "Implemented a custom Kubernetes controller in Go to automate the deployment of MySQL and ProxySQL custom resources in order to enable 2,000+ internal developers to instantly deploy their app databases to production. Wrote several scripts in Go to automate MySQL database failovers while maintaining master-slave replication topologies and keeping Zookeeper nodes consistent with changes.",
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
        "Designed and developed go-to platform for frontend developers and web designers. Nexonauts is an open-source project designed to empower developers and designers with curated themes, templates, and tools to streamline their projects and foster innovation in the digital space.",
      technologies: [
        "Next.js",
        "Typescript",
        "MongoDB",
        "TailwindCSS",
        "Stripe",
        "Shadcn UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://nexonauts.com",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/kanakkholwal/nexonauts",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/nexonauts.png",
      video:
        "",
    },
    {
      title: "College Ecosystem Monorepo",
      href: "https://nith.eu.org",
      dates: "June 2024 - Present",
      active: true,
      description:
        "Developed a centralized platform that is multifunctional, user-friendly for college students. Any educational institution may utilize this generic, open-source platform  _(not individuals)_",
      technologies: [
        "Next.js",
        "Typescript",
        "Turbopack",
        "Github Actions",
        "MongoDB",
        "TailwindCSS",
        "Shadcn UI",
        "Magic UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://nith.eu.org",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/kanakkholwal/college-ecosystem",
          icon: <Icons.github className="size-3" />,
        },
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
        "Developed a user friendly and customisable and typesafe markdown solutions with native accessibility support",
      technologies: [
        "React.js",
        "Typescript",
        "TailwindCSS",
        "Shadcn UI",
        "NPM",
        "Github Actions",
      ],
      links: [
        {
          type: "Package",
          href: "https://www.npmjs.com/package/nexo-mdx",
          icon: <Icons.package className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/kanakkholwal/nexo-mdx",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Remark Plugins",
      href: "https://github.com/kanakkholwal/remark-plugins",
      dates: "June 2024 - June 2024",
      active: true,
      description:
        "Developed a collection of remark plugins for markdown processing.",
      technologies: [
        "Typescript",
        "NPM",
        "Github Actions",
      ],
      links: [
        {
          type: "Package",
          href: "https://www.npmjs.com/package/remark-plugins",
          icon: <Icons.package className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/kanakkholwal/remark-plugins",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "CodeGenX",
      href: "https://github.com/GDSC-NITH/GenCodeX",
      dates: "Oct 2023 - Oct 2023",
      active: true,
      description:
        "Developed a CLI tool designed to streamline project development by integrating popular features.",
      technologies: [
        "Go",
        "MongoDB",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/GDSC-NITH/GenCodeX",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video:
        "",
    },
  ],
  hackathons: [


    // {
    //   title: "Waterloo Equithon",
    //   dates: "May 5th - 7th, 2017",
    //   location: "Waterloo, Ontario",
    //   description:
    //     "Developed Pocketdoc, an app in which you take a picture of a physical wound, and the app returns common solutions or cures to the injuries or diseases.",
    //   image:
    //     "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/waterloo-equithon.png",
    //   links: [
    //     {
    //       title: "Devpost",
    //       icon: <Icons.globe className="h-4 w-4" />,
    //       href: "https://devpost.com/software/pocketdoc-react-native",
    //     },
    //     {
    //       title: "YouTube",
    //       icon: <Icons.youtube className="h-4 w-4" />,
    //       href: "https://www.youtube.com/watch?v=XwFdn5Rmx68",
    //     },
    //     {
    //       title: "Source",
    //       icon: <Icons.github className="h-4 w-4" />,
    //       href: "https://github.com/dillionverma/pocketdoc-react-native",
    //     },
    //   ],
    // },

  ],
} as const;
