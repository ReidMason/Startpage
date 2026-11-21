import { describe, expect, it } from "vitest";

import type { App } from "@/api";
import { submitTarget } from "@/lib/filter";

const engine = "https://www.google.com/search?q=";
const plex = { id: 1, name: "Plex", url: "plex.local", iconName: "", iconSvg: "" } as App;

describe("submitTarget", () => {
  it("opens the best match when filtering", () => {
    expect(submitTarget({ query: "/pl", searchEngine: engine, best: plex, forceSearch: false })).toBe("https://plex.local");
  });

  it("does nothing when filtering with no matches", () => {
    expect(submitTarget({ query: "/zzz", searchEngine: engine, best: undefined, forceSearch: false })).toBeNull();
  });

  it("sends the whole query, slash included and encoded, on force search", () => {
    expect(submitTarget({ query: "/a&b", searchEngine: engine, best: plex, forceSearch: true })).toBe(
      `${engine}%2Fa%26b`,
    );
  });

  it("searches normally outside filter mode", () => {
    expect(submitTarget({ query: "cats", searchEngine: engine, best: undefined, forceSearch: false })).toBe(`${engine}cats`);
    expect(submitTarget({ query: "/", searchEngine: engine, best: undefined, forceSearch: false })).toBe(`${engine}%2F`);
  });

  it("does nothing for a blank query", () => {
    expect(submitTarget({ query: "  ", searchEngine: engine, best: undefined, forceSearch: false })).toBeNull();
  });
});
