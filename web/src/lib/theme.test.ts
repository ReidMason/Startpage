import { describe, expect, it } from "vitest";

import type { Theme } from "@/api";
import { pickableThemes, themeLabel, themeVariables, resolveTheme } from "@/lib/theme";

const theme = (id: number, background = "#fff"): Theme => ({
  id,
  name: `t${id}`,
  background,
  foreground: "#000",
  card: "#111",
  cardForeground: "#222",
  primary: "#333",
  primaryForeground: "#444",
  secondary: "#555",
  secondaryForeground: "#666",
  muted: "#777",
  mutedForeground: "#888",
  accent: "#999",
  accentForeground: "#aaa",
  destructive: "#bbb",
  border: "#ccc",
  input: "#ddd",
  ring: "#eee",
});

const themes = [theme(1, "light-bg"), theme(2, "dark-bg"), theme(7, "custom-bg")];

describe("resolveTheme", () => {
  it("uses the chosen Theme", () => {
    expect(resolveTheme(themes, 7, false)?.background).toBe("custom-bg");
    expect(resolveTheme(themes, 7, true)?.background).toBe("custom-bg");
  });

  it("follows the browser preference on System", () => {
    expect(resolveTheme(themes, null, false)?.background).toBe("light-bg");
    expect(resolveTheme(themes, null, true)?.background).toBe("dark-bg");
  });

  it("falls back to System when the chosen Theme is missing", () => {
    expect(resolveTheme(themes, 99, true)?.background).toBe("dark-bg");
  });

  it("returns nothing when the light or dark row is missing", () => {
    expect(resolveTheme([theme(2)], null, false)).toBeUndefined();
    expect(resolveTheme([], null, true)).toBeUndefined();
  });
});

describe("themeLabel", () => {
  it("turns a slug into a readable label", () => {
    expect(themeLabel("catppuccin-mocha")).toBe("Catppuccin Mocha");
    expect(themeLabel("tokyo-night")).toBe("Tokyo Night");
  });
});

describe("pickableThemes", () => {
  it("leaves out the light and dark rows that System uses", () => {
    expect(pickableThemes([theme(1), theme(2), theme(7)]).map((t) => t.id)).toEqual([7]);
  });
});

describe("themeVariables", () => {
  it("maps colours to kebab-case CSS variables", () => {
    const vars = themeVariables(theme(1, "red"));
    expect(vars["--background"]).toBe("red");
    expect(vars["--card-foreground"]).toBe("#222");
    expect(vars["--muted-foreground"]).toBe("#888");
    expect(vars["--ring"]).toBe("#eee");
    expect(Object.keys(vars)).toHaveLength(16);
  });
});
