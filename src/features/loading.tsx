import { Page } from "@/components/site/page";
import { Skeleton } from "@/components/ui/skeleton";

const ROWS = ["w-3/5", "w-2/5", "w-1/2", "w-2/3"];

/** Route fallback shaped like a page: title, intro, then a few rows. Static, so it never competes with the load. */
export default function LoadingPage() {
  return (
    <Page aria-busy="true" aria-label="Loading">
      <div className="flex max-w-2xl flex-col gap-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="w-full" />
        <Skeleton className="w-4/5" />
      </div>
      <div className="mt-16 flex max-w-2xl flex-col gap-6">
        {ROWS.map((w) => (
          <div key={w} className="flex items-center justify-between gap-6">
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className={w} />
              <Skeleton className="h-3 w-4/5" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </Page>
  );
}
