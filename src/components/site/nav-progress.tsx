import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

// Fast navigations finish before this; only a load the visitor would notice shows the bar.
const SHOW_AFTER_MS = 150;

/** A hairline that sweeps across the top while a route's data loads. */
export function NavProgress() {
  const pending = useRouterState({ select: (s) => s.status === "pending" });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!pending) return setVisible(false);
    const timer = setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [pending]);

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden opacity-0",
          "transition-opacity duration-(--duration-base) ease-(--ease-out)",
          visible && "opacity-100",
        )}
      >
        <div className="nav-sweep h-full w-2/5 bg-primary" />
      </div>
      <span role="status" className="sr-only">
        {visible ? "Loading page" : ""}
      </span>
    </>
  );
}
