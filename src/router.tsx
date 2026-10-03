import { createRouter } from "@tanstack/react-router";
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
  });
}
