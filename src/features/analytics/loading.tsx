export default function AnalyticsLoading() {
  return (
    <div className="mx-auto max-w-app animate-pulse space-y-14 px-6 py-14">
      <div className="space-y-3">
        <div className="h-5 w-28 rounded-full bg-muted" />
        <div className="h-12 w-64 rounded-lg bg-muted" />
        <div className="h-4 w-80 rounded bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl border border-border bg-muted/40" />
        ))}
      </div>
      <div className="h-80 rounded-2xl border border-border bg-muted/40" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-56 rounded-xl border border-border bg-muted/40" />
        ))}
      </div>
    </div>
  );
}
