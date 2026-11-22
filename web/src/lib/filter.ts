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

const rest = String.raw`(?::\d{1,5})?(?:[/?#]\S*)?$`;
const octet = String.raw`(?:25[0-5]|2[0-4]\d|1?\d?\d)`;
const explicitUrl = /^https?:\/\/\S+$/i;
const hostWithTld = new RegExp(String.raw`^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}${rest}`, "i");
const localhost = new RegExp(String.raw`^localhost${rest}`, "i");
const ipv4 = new RegExp(String.raw`^(?:${octet}\.){3}${octet}${rest}`);

export function urlTarget(query: string): string | null {
  const trimmed = query.trim();
  if (!trimmed || trimmed.startsWith("/") || /\s/.test(trimmed)) return null;
  if (explicitUrl.test(trimmed)) return trimmed;
  if (localhost.test(trimmed)) return `http://${trimmed}`;
  if (hostWithTld.test(trimmed) || ipv4.test(trimmed)) return `https://${trimmed}`;
  return null;
}

type Submit = { query: string; searchEngine: string; best: App | undefined; forceSearch: boolean };

export function submitTarget({ query, searchEngine, best, forceSearch }: Submit): string | null {
  if (!forceSearch && isFilterQuery(query)) return best ? appHref(best.url) : null;
  if (!forceSearch) {
    const url = urlTarget(query);
    if (url) return url;
  }
  const trimmed = query.trim();
  return trimmed ? searchEngine + encodeURIComponent(trimmed) : null;
}
