import { describe, expect, it } from "vitest";
import { changedSettings } from "./settings";

const saved = { searchEngine: "https://duckduckgo.com/?q=", showNameInGreeting: false, searchPlaceholder: "Search...", themeId: null };

describe("changedSettings", () => {
  it("is empty when nothing changed", () => {
    expect(changedSettings(saved, { ...saved })).toEqual({});
  });

  it("includes the Theme when it changed", () => {
    expect(changedSettings(saved, { ...saved, themeId: 3 })).toEqual({ themeId: 3 });
  });

  it("includes null when returning to System", () => {
    expect(changedSettings({ ...saved, themeId: 3 }, { ...saved, themeId: null })).toEqual({ themeId: null });
  });

  it("includes only the search placeholder when only it changed", () => {
    expect(changedSettings(saved, { ...saved, searchPlaceholder: "Find..." })).toEqual({ searchPlaceholder: "Find..." });
  });
});
