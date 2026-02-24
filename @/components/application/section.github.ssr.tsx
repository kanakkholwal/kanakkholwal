import GithubSection from "@/components/application/section.github";
import { Suspense } from "react";
import { appConfig } from "root/project.config";
import { getGithubStats } from "~/api/github";


export default async function GithubSectionSSR() {
  const data = await getGithubStats(appConfig.usernames.github);

  return (<Suspense
        fallback={
          <div className="max-w-app mx-auto px-6 md:px-12 py-24">
            <div className="h-96 w-full animate-pulse rounded-3xl bg-muted/50 border border-border" />
          </div>
        }
      >
        <GithubSection data={data} />
      </Suspense>
);
}
