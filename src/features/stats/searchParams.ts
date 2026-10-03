import { parseAsBoolean, parseAsStringLiteral } from "nuqs";
import { statsConfig } from "./config";

export const pkgOptions = [...statsConfig.npmPackages, "both"] as const;
export const pkgParser = parseAsStringLiteral(pkgOptions).withDefault("both");

export const searchParams = {
  pkg: pkgParser,
  beta: parseAsBoolean.withDefault(false),
  repo: parseAsStringLiteral(statsConfig.repositories.map((repo) => repo.repo)).withDefault(
    statsConfig.repositories[0].repo,
  ),
};
