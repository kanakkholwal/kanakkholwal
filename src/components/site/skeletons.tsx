import { Skeleton } from "@/components/ui/skeleton";

const LINES = ["w-full", "w-11/12", "w-4/5", "w-full", "w-3/5"];

/** Stand-in for an MDX body while its chunk loads: a heading and two short paragraphs. */
export function ProseSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading content" className="flex flex-col gap-3">
      <Skeleton className="mb-2 h-6 w-1/3" />
      {LINES.map((w, i) => (
        <Skeleton key={`${w}-${i < 3 ? "a" : "b"}`} className={`h-4 ${w} ${i === 3 ? "mt-4" : ""}`} />
      ))}
    </div>
  );
}
