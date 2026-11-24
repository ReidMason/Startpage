import { useEffect, useState } from "react";

import type { Theme } from "@/api";
import { themeCacheKey } from "@/lib/themeCacheKey";

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

export function applyTheme(root: HTMLElement, theme: Theme | undefined) {
  const style = root.style;
  const applied: string[] = [];
  for (let i = 0; i < style.length; i++) {
    const name = style.item(i);
    if (name.startsWith("--")) applied.push(name);
  }
  for (const name of applied) style.removeProperty(name);
  if (!theme) return;
  for (const [name, value] of Object.entries(themeVariables(theme))) style.setProperty(name, value);
}

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
