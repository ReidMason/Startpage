import type { QueryClient } from "@tanstack/react-query";

import { getStartpage, type Startpage } from "@/api";
import { goToLogin } from "@/lib/session";

const CACHE_KEY = "startpage:startpage";

export const startpageQueryKey = ["startpage"] as const;

export function readCachedStartpage(): Startpage | undefined {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Startpage) : undefined;
  } catch {
    return undefined;
  }
}

function writeCachedStartpage(startpage: Startpage) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(startpage));
  } catch {
    // storage unavailable or full; the cache is only an optimisation
  }
}

export function setStartpage(queryClient: QueryClient, next: Startpage) {
  queryClient.setQueryData<Startpage>(startpageQueryKey, next);
  writeCachedStartpage(next);
}

/** Applies a change to the cached Startpage and returns the previous value for rollback. */
export function updateStartpage(queryClient: QueryClient, change: (page: Startpage) => Startpage): Startpage | undefined {
  const previous = queryClient.getQueryData<Startpage>(startpageQueryKey);
  if (previous) setStartpage(queryClient, change(previous));
  return previous;
}

export async function optimisticStartpage(queryClient: QueryClient, change: (page: Startpage) => Startpage) {
  await queryClient.cancelQueries({ queryKey: startpageQueryKey });
  return { previous: updateStartpage(queryClient, change) };
}

export function rollbackStartpage(queryClient: QueryClient, context: { previous?: Startpage } | undefined) {
  if (context?.previous) setStartpage(queryClient, context.previous);
}

export async function fetchStartpage(): Promise<Startpage> {
  const { data, response } = await getStartpage();
  if (response?.status === 401) {
    goToLogin();
    // never settles so callers don't render while the browser navigates away
    return new Promise<Startpage>(() => {});
  }
  if (!data) throw new Error(`GET /api/startpage failed: ${response?.status}`);
  writeCachedStartpage(data);
  return data;
}

export function clearCachedStartpage() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    return;
  }
}

const SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;

export function appHref(url: string): string {
  const scheme = /^([a-z][a-z0-9+.-]*):\/\//i.exec(url)?.[1].toLowerCase();
  if (!scheme) return `https://${url}`;
  return scheme === "http" || scheme === "https" ? url : "#";
}

export function displayUrl(url: string): string {
  return url.replace(SCHEME, "").replace(/\/$/, "");
}
