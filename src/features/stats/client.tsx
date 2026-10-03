import { useNavigate, useSearch } from "@tanstack/react-router";
import { defaultRepo, type PkgOption } from "./searchParams";

type StatsSearchPatch = { repo?: string; pkg?: PkgOption; beta?: boolean };

/** `repo`, `pkg` and `beta` live in the URL so a shared link opens the same view. */
export function useStatsSearch() {
  const search = useSearch({ from: "/_pages/stats" });
  const navigate = useNavigate({ from: "/stats" });
  const set = (patch: StatsSearchPatch) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });
  return {
    repo: search.repo ?? defaultRepo,
    pkg: search.pkg ?? "both",
    beta: search.beta ?? false,
    set,
  };
}
