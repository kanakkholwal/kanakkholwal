import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, CircleDashed, Trophy } from "lucide-react";
import Image from "next/image";
import { appConfig } from "root/project.config";
import { generateMetadata } from "~/utils/seo";

// --- METADATA ---
export const metadata = generateMetadata({
  title: "Bucket List",
  description:
    "A roadmap of my life's adventures, goals, and shipped experiences.",
  path: "/bucket-list",
});

// --- COMPONENT: BUCKET CARD ---
function BucketCard({ item }: { item: (typeof appConfig.bucketList)[0] }) {
  return (
    <div
      className={cn(
        "group relative mb-6 break-inside-avoid rounded-3xl border p-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl",
        item.completed
          ? "bg-card border-border shadow-sm"
          : "bg-background/50 border-dashed border-border/60 opacity-80 hover:opacity-100",
      )}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
        {item.images && item.images.length > 0 ? (
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              item.completed
                ? "group-hover:scale-105"
                : "grayscale group-hover:grayscale-0 group-hover:scale-105 opacity-70",
            )}
          />
        ) : (
          // Fallback Pattern for items without images
          <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
            <Trophy className="size-12 text-muted-foreground/20" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
          </div>
        )}

        {/* Status Badge (Overlaid on Image) */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={item.completed ? "default" : "secondary"}
            className={cn(
              "backdrop-blur-md shadow-sm border font-mono text-[10px] uppercase tracking-wider px-2 py-1",
              item.completed
                ? "bg-emerald-500/90 hover:bg-emerald-500 text-white border-transparent"
                : "bg-black/50 text-white border-white/20",
            )}
          >
            {item.completed ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3" /> Completed
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <CircleDashed className="size-3" /> Planned
              </span>
            )}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-4 px-2 pb-2 space-y-2">
        <h3
          className={cn(
            "text-xl font-bold tracking-tight leading-tight",
            item.completed
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground transition-colors",
          )}
        >
          {item.name}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.description}
        </p>

        {/* Footer Metadata (Optional location if you have it, or just a decorative element) */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {/* Micro-thumbnails for extra images */}
            {item.images.slice(1, 4).map((img, idx) => (
              <div
                key={idx}
                className="relative size-6 rounded-full ring-2 ring-background overflow-hidden"
              >
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>

          {/* Decorative Checkmark for completed items */}
          {item.completed && (
            <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              <CheckCircle2 className="size-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BucketListPage() {
  // Calculate Stats for the "Dashboard" feel
  const total = appConfig.bucketList.length;
  const completed = appConfig.bucketList.filter((i) => i.completed).length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <main className="min-h-screen w-full relative">
      <div className="fixed inset-0 -z-50 h-full w-full bg-background opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)" />

      <div className="mx-auto max-w-5xl px-6 md:px-12 py-24">
        <div className="flex flex-col items-center text-center space-y-8 mb-20">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-border/50 text-xs font-mono text-muted-foreground uppercase tracking-widest backdrop-blur-md">
            Life Roadmap v1.0
          </span>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[1.1]">
            Collecting
            <br />
            <span className="font-instrument-serif italic font-normal text-muted-foreground mr-3">
              Moments
            </span>
            <span className="text-colorful-titanium">Not Things.</span>
          </h1>

          {/* Progress Bar Component */}
          <div className="w-full max-w-md space-y-3">
            <div className="flex justify-between text-xs font-mono text-muted-foreground uppercase tracking-wider">
              <span>Progress</span>
              <span>{percentage}% Complete</span>
            </div>
            {/* Note: Ensure you have a Progress component or use a simple div with width style */}
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center pt-2">
              {completed} adventures unlocked / {total - completed} pending
            </p>
          </div>
        </div>

        {/* --- MASONRY GRID --- */}
        {/* 'columns-xs' or 'md:columns-2' creates a true masonry layout where cards stack naturally */}
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {appConfig.bucketList.map((item, index) => (
            <BucketCard key={index} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
