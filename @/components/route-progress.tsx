import { useRouterState } from "@tanstack/react-router";

/** Thin top bar while a navigation is loading; replaces next13-progressbar. */
export function RouteProgress() {
  const pending = useRouterState({ select: (s) => s.status === "pending" });
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden"
      style={{ opacity: pending ? 1 : 0, transition: "opacity 200ms ease-out" }}
    >
      <div className="h-full w-1/3 animate-[loading-sweep_1.1s_ease-in-out_infinite] bg-primary motion-reduce:w-full motion-reduce:animate-none" />
    </div>
  );
}
