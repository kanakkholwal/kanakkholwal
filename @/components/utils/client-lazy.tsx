import { ClientOnly } from "@tanstack/react-router";
import { type ComponentProps, type ComponentType, lazy, type ReactNode, Suspense } from "react";

/** `next/dynamic` with `ssr: false`: code-split and rendered only after hydration. */
// biome-ignore lint/suspicious/noExplicitAny: mirrors React.lazy's own constraint
export function clientLazy<C extends ComponentType<any>>(
  load: () => Promise<{ default: C }>,
  fallback: ReactNode = null,
) {
  const Lazy = lazy(load);
  return function ClientLazy(props: ComponentProps<C>) {
    return (
      <ClientOnly fallback={fallback}>
        <Suspense fallback={fallback}>
          <Lazy {...props} />
        </Suspense>
      </ClientOnly>
    );
  };
}
