import { Logo } from "@/components/logo";

// A route-loading fallback runs while the browser is already busy fetching the
// route. It previously mounted a canvas particle system and an infinite
// brightness pulse — both competing for the main thread with the work being
// waited on. A static mark and a determinate-looking bar is the whole job.
export default function LoadingPage() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex h-dvh w-full flex-col items-center justify-center gap-6 bg-background"
    >
      <Logo size="lg" />
      <div className="h-px w-32 overflow-hidden rounded-full bg-border">
        <div className="h-full w-1/3 animate-[loading-sweep_1.1s_ease-in-out_infinite] rounded-full bg-primary motion-reduce:w-full motion-reduce:animate-none" />
      </div>
    </div>
  );
}
