import { createRouter } from "@tanstack/react-router";
import LoadingPage from "~/features/loading";
import NotFound from "~/features/not-found";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPendingComponent: LoadingPage,
    defaultNotFoundComponent: NotFound,
  });
}
