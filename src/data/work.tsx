export const workExperiences = [
  {
    company: "Textify AI",
    href: "https://textify.ai",
    badges: ["Full Stack", "DevOps"],
    location: "Indore, MP, India",
    locationType: "Remote",
    title: "Software Developer",
    logoUrl:
      "https://2hy7y2bvb4.ufs.sh/f/zWIvIoJSZF4QYH4HQCOnd4FsWwGtc1QjmblpSJE5xBn6y73Y",
    start: "Dec 2022",
    end: "Jun 2024",
    description: `
- Architected a **No-Code AI Workflow Engine** featuring a drag-and-drop interface, enabling users to build dynamic, schema-driven LLM chains (Text/Image/Markdown) without writing code.
- Orchestrated a complex multi-cloud infrastructure migration **(AWS Amplify → Azure → GCP Cloud Run)**, utilizing **Docker** and **GitHub Actions** to establish a scalable, containerized CI/CD pipeline.
- Hardened platform security by implementing **RBAC and Multi-Factor Authentication (MFA)** via AWS Cognito, later migrating to **NextAuth** to unify session management across microservices.
- Re-engineered legacy monolithic codebases into modular **RESTful microservices**, reducing API latency and cutting deployment build times by **30%**.
- Designed centralized schema handling systems that decoupled frontend logic from backend data structures, significantly improving developer velocity.
      `,
  },
  {
    company: "KoinX",
    href: "https://koinx.com",
    badges: ["Frontend", "Performance"],
    location: "Bhubaneswar, India",
    locationType: "Remote",
    title: "Frontend Engineer Intern",
    logoUrl:
      "https://2hy7y2bvb4.ufs.sh/f/zWIvIoJSZF4QPeYl8N26Hz53wg87YeZxFt9WfbvpIQLVAXau",
    start: "Mar 2024",
    end: "Jun 2024",
    description: `
- Spearheaded the architectural migration of legacy **Create-React-App (CRA)** repositories to **Vite + TypeScript**, slashing build times by **60%** and optimizing HMR (Hot Module Replacement) for the team.
- Engineered a centralized **Internationalization (i18n)** and SEO architecture, enabling localized landing pages that drove a **150% increase in organic traffic**.
- Co-developed the **internal UI Component Library**, enforcing strict design system tokens to ensure visual consistency across B2B and consumer-facing crypto dashboards.
- Optimized core web vitals and page load speeds for high-traffic pages, directly improving user retention and SERP rankings.
- Collaborated with product teams to ship production-ready features for a high-growth Fintech platform.
`,
  },
] as const;

export type WorkExperience = (typeof workExperiences)[number];