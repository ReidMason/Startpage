import { Fzf } from "fzf";

import type { App } from "@/api";
import { appHref } from "@/lib/startpage";

// Minimum fzf score per query character; below this the letters are scattered across the name.
const minScorePerChar = 15;

export function rankApps(apps: App[], query: string): App[] {
  const needle = query.trim();
  if (!needle) return [];
  const fzf = new Fzf(apps, { selector: (app) => app.name, casing: "case-insensitive" });
  return fzf
    .find(needle)
    .filter((r) => r.score >= minScorePerChar * needle.length)
    .map((r) => r.item);
}

const filterNeedle = (query: string) => query.slice(1);

export const isFilterQuery = (query: string) => query.startsWith("/") && filterNeedle(query).trim() !== "";

export const filterApps = (apps: App[], query: string): App[] => rankApps(apps, filterNeedle(query));

type Submit = { query: string; searchEngine: string; best: App | undefined; forceSearch: boolean };

export function submitTarget({ query, searchEngine, best, forceSearch }: Submit): string | null {
  if (!forceSearch && isFilterQuery(query)) return best ? appHref(best.url) : null;
  const trimmed = query.trim();
  return trimmed ? searchEngine + encodeURIComponent(trimmed) : null;
}
