import { createRouter } from "@tanstack/react-router";
import ErrorPageClient from "@/components/utils/error-page.view";
import LoadingPage from "~/features/loading";
import NotFound from "~/features/not-found";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultViewTransition: true,
    // Loader data is reused on back/forward and after a hover preload instead of refetching.
    defaultStaleTime: 60_000,
    defaultPreloadStaleTime: 5 * 60_000,
    defaultGcTime: 30 * 60_000,
    defaultPendingComponent: LoadingPage,
    defaultNotFoundComponent: NotFound,
    // A failing route keeps the shell; only the content pane shows the error.
    defaultErrorComponent: ({ error, reset }) => <ErrorPageClient error={error as Error} reset={reset} />,
    // The skeleton waits for a slow load and then stays long enough not to flicker.
    defaultPendingMs: 600,
    defaultPendingMinMs: 300,
  });
}
