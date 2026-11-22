import type { Settings, SettingsUpdate } from "@/api";

export const searchEnginePresets = [
  { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  { name: "Google", url: "https://www.google.com/search?q=" },
  { name: "Bing", url: "https://www.bing.com/search?q=" },
  { name: "Brave", url: "https://search.brave.com/search?q=" },
  { name: "Kagi", url: "https://kagi.com/search?q=" },
] as const;

export const defaultSearchEngine = searchEnginePresets[1].url;

export const defaultSearchPlaceholder = "Search...";
export const maxSearchPlaceholderLength = 40;

export function isValidSearchEngine(address: string): boolean {
  try {
    const { protocol, host } = new URL(address.trim());
    return (protocol === "http:" || protocol === "https:") && host !== "";
  } catch {
    return false;
  }
}

export function changedSettings(saved: Settings, draft: Settings): SettingsUpdate {
  const changes: SettingsUpdate = {};
  if (draft.searchEngine !== saved.searchEngine) changes.searchEngine = draft.searchEngine;
  if (draft.searchPlaceholder !== saved.searchPlaceholder) changes.searchPlaceholder = draft.searchPlaceholder;
  if (draft.showNameInGreeting !== saved.showNameInGreeting) changes.showNameInGreeting = draft.showNameInGreeting;
  return changes;
}

export const isDirty = (saved: Settings, draft: Settings) => Object.keys(changedSettings(saved, draft)).length > 0;
