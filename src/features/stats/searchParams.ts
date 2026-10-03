import { statsConfig } from "./config";

export const pkgOptions = [...statsConfig.npmPackages, "both"] as const;
export type PkgOption = (typeof pkgOptions)[number];

export const repoOptions = statsConfig.repositories.map((r) => r.repo);
export const defaultRepo = repoOptions[0];
