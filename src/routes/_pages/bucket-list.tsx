import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";
import BucketListClient from "~/features/bucket-list/client";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/_pages/bucket-list")({
  head: () =>
    seo({
      title: "Bucket List",
      description: "Things I want to do at least once, and the few I've already done.",
      path: "/bucket-list",
    }),
  component: BucketListPage,
});

function BucketListPage() {
  return <BucketListClient items={appConfig.bucketList} />;
}
