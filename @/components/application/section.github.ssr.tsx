import GithubSection from "@/components/application/section.github";
import { Suspense } from "react";
import { appConfig } from "root/project.config";
import { getGithubStats } from "~/api/github";
import { DynamicSection } from "./base.ui";


export default async function GithubSectionSSR() {
  const data = await getGithubStats(appConfig.usernames.github);

  return (<Suspense
    fallback={
      <DynamicSection>
        <div className="h-96 w-full animate-pulse rounded-3xl bg-muted/50 border border-border" />
      </DynamicSection>
    }
  >
    <GithubSection data={data} />
  </Suspense>
  );
}
