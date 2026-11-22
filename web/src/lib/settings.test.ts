import { describe, expect, it } from "vitest";
import { changedSettings } from "./settings";

const saved = { searchEngine: "https://duckduckgo.com/?q=", showNameInGreeting: false, searchPlaceholder: "Search..." };

describe("changedSettings", () => {
  it("is empty when nothing changed", () => {
    expect(changedSettings(saved, { ...saved })).toEqual({});
  });

  it("includes only the search placeholder when only it changed", () => {
    expect(changedSettings(saved, { ...saved, searchPlaceholder: "Find..." })).toEqual({ searchPlaceholder: "Find..." });
  });
});
