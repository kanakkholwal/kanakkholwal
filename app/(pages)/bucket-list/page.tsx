import { appConfig } from "root/project.config";
import { generateMetadata } from "~/utils/seo";
import BucketListClient from "./client";

export const metadata = generateMetadata({
  title: "Bucket List",
  description:
    "A roadmap of my life's adventures, goals, and shipped experiences.",
  path: "/bucket-list",
});

export default function BucketListPage() {
  const total = appConfig.bucketList.length;
  const completed = appConfig.bucketList.filter((i) => i.completed).length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <BucketListClient
      items={appConfig.bucketList}
      total={total}
      completed={completed}
      percentage={percentage}
    />
  );
}

