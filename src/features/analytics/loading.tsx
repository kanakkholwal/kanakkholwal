import { Page, PageHeader } from "@/components/site/page";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <Page className="flex flex-col gap-20">
      <PageHeader
        className="mb-0"
        title="analytics."
        description="Who reads this site and how they got here. Nothing sampled or rounded up."
      />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-7 w-28" />
        </div>
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-card p-1 sm:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length skeleton never reorders.
            <Skeleton key={i} shape="block" className="h-24 bg-background dark:bg-popover" />
          ))}
        </div>
        <Skeleton shape="block" className="aspect-[2/1] h-auto rounded-2xl" />
      </div>
    </Page>
  );
}
