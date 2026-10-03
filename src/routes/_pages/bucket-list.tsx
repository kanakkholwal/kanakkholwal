import { createFileRoute } from "@tanstack/react-router";
import { appConfig } from "root/project.config";
import BucketListClient from "~/features/bucket-list/client";
import { seo } from "~/utils/seo";

const total = appConfig.bucketList.length;
const completed = appConfig.bucketList.filter((i) => i.completed).length;

export const Route = createFileRoute("/_pages/bucket-list")({
  head: () =>
    seo({
      title: "Bucket List",
      description: "A roadmap of my life's adventures, goals, and shipped experiences.",
      path: "/bucket-list",
    }),
  component: BucketListPage,
});

function BucketListPage() {
  return (
    <BucketListClient
      items={appConfig.bucketList}
      total={total}
      completed={completed}
      percentage={Math.round((completed / total) * 100)}
    />
  );
}
