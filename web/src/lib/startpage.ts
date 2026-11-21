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

export function writeCachedStartpage(startpage: Startpage) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(startpage));
  } catch {
    // storage unavailable or full; the cache is only an optimisation
  }
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
    // nothing cached to clear
  }
}

const SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;

export function appHref(url: string): string {
  return SCHEME.test(url) ? url : `https://${url}`;
}

export function displayUrl(url: string): string {
  return url.replace(SCHEME, "").replace(/\/$/, "");
}
