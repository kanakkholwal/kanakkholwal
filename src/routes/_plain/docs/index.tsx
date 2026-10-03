import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/site/page";
import WritingIndex from "~/features/docs/client";
import { getWriting } from "~/features/docs/server";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_plain/docs/")({
  loader: () => getWriting(),
  staleTime: Number.POSITIVE_INFINITY,
  head: () =>
    seo({
      title: "Writing",
      description:
        "Write-ups on things Kanak built, broke or researched: systems, deploys, product engineering and an M.Tech thesis on ECG models.",
      path: "/docs",
    }),
  component: DocsIndexPage,
});

function DocsIndexPage() {
  return (
    <Page>
      <WritingIndex posts={Route.useLoaderData()} />
    </Page>
  );
}
