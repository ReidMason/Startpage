import { useEffect, useState } from "react";

import type { Theme } from "@/api";

// Seeded rows; the database ids are the only link to the System light/dark Themes
const LIGHT_THEME_ID = 1;
const DARK_THEME_ID = 2;

export const themeLabel = (name: string) =>
  name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export function resolveTheme(themes: Theme[], themeId: number | null, prefersDark: boolean): Theme | undefined {
  const chosen = themeId === null ? undefined : themes.find((t) => t.id === themeId);
  return chosen ?? themes.find((t) => t.id === (prefersDark ? DARK_THEME_ID : LIGHT_THEME_ID));
}

const nonColourKeys = new Set(["id", "name"]);

export function themeVariables(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme)) {
    if (nonColourKeys.has(key)) continue;
    vars[`--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`] = String(value);
  }
  return vars;
}

export function applyTheme(root: HTMLElement, theme: Theme | undefined, previous: string[] = []): string[] {
  for (const name of previous) root.style.removeProperty(name);
  if (!theme) return [];
  const vars = themeVariables(theme);
  for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);
  return Object.keys(vars);
}

export const themeCacheKey = "startpage-theme";

type CacheStorage = Pick<Storage, "setItem" | "removeItem">;

export function cacheTheme(storage: CacheStorage, theme: Theme | undefined) {
  try {
    if (theme) storage.setItem(themeCacheKey, JSON.stringify(themeVariables(theme)));
    else storage.removeItem(themeCacheKey);
  } catch {
    // storage unavailable: next load falls back to the :root defaults
  }
}

const darkQuery = "(prefers-color-scheme: dark)";

export function usePrefersDark(): boolean {
  const [dark, setDark] = useState(() => window.matchMedia(darkQuery).matches);
  useEffect(() => {
    const media = window.matchMedia(darkQuery);
    const onChange = () => setDark(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return dark;
}
