export const workExperiences = [
  {
    company: "Textify AI",
    href: "https://textify.ai",
    badges: [],
    location: "Indore, MP, India",
    locationType: "remote",
    title: "Software Developer",
    logoUrl:
      "https://2hy7y2bvb4.ufs.sh/f/zWIvIoJSZF4QYH4HQCOnd4FsWwGtc1QjmblpSJE5xBn6y73Y",
    start: "Dec 2022",
    end: "Jun 2024",
    description: `
- Re-architected legacy hard-coded apps into modular tools with centralized schema handling, improving developer efficiency and scalability.
- Developed **no-code AI tool builder** with drag-and-drop support, enabling dynamic prompt structures and schema-driven LLM requests (text, markdown, image outputs).
- Implemented authentication with **AWS Cognito**, later migrating to NextAuth for streamlined cross-database user/session management.
- Fortified platform security by integrating **multi-factor authentication** through AWS Cognito; reduced unauthorized access attempts and improved overall platform reliability, addressing top security vulnerabilities.
- Managed cloud deployments across **AWS Amplify → Azure (GitHub Actions CI/CD) → GCP (Cloud Run, Artifact Registry, Docker)** ensuring reliable and cost-effective infrastructure.
- Developed RESTful APIs and microservices following **Agile practices and CI/CD pipelines**, enhancing system scalability on Azure and GCP, reducing deployment time by 30%.
- Contributed majorly to rewriting and stabilizing the legacy codebase, establishing a foundation for future features.

      `,
  },
  {
    company: "KoinX",
    href: "https://koinx.com",
    badges: ["Internship"],
    location: "Bhubaneswar, India",
    locationType: "remote",
    title: "Frontend Engineer",
    logoUrl:
      "https://2hy7y2bvb4.ufs.sh/f/zWIvIoJSZF4QPeYl8N26Hz53wg87YeZxFt9WfbvpIQLVAXau",
    start: "Mar 2024",
    end: "Jun 2024",
    description: `
- Built and optimized client-side applications for **B2B and customer-facing platforms**, ensuring high performance and responsiveness.
- Contributed to development of the **internal UI component library**, leveraging **strong UI/UX design sense** to improve team productivity.
- Optimized SEO and page speed, boosting organic traffic by 150%.
- Initiated and led the **migration of 4–5 legacy CRA apps to Vite/TS**, significantly enhancing build times and performance by 60%.
- Optimized landing page **SEO and page load times** by centralizing localized versions across countries/languages, significantly improving search ranking and user experience.
- Collaborated closely with product and design teams to deliver **scalable, production-ready frontend solutions**.


`,
  },
] as const;

export type WorkExperience = (typeof workExperiences)[number];
