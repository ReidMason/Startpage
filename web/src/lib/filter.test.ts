import { describe, expect, it } from "vitest";

import type { App } from "@/api";
import { filterApps, isFilterQuery, rankApps, submitTarget } from "@/lib/filter";

const apps = (...appNames: string[]): App[] =>
  appNames.map((name, i) => ({ id: i + 1, name, url: "https://example.com", iconName: "", iconSvg: "" }) as App);
const rank = (query: string, ...appNames: string[]) => rankApps(apps(...appNames), query).map((a) => a.name);

describe("rankApps", () => {
  it("matches regardless of case", () => {
    expect(rank("PLEX", "Plex", "Grafana")).toEqual(["Plex"]);
    expect(rank("graf", "Plex", "Grafana")).toEqual(["Grafana"]);
  });

  it("matches abbreviations of the name", () => {
    expect(rank("gf", "Plex", "Grafana")).toEqual(["Grafana"]);
    expect(rank("hm", "Plex", "Home Assistant")).toEqual(["Home Assistant"]);
  });

  it("hides apps that do not match", () => {
    expect(rank("xyz", "Plex", "Grafana", "Home Assistant")).toEqual([]);
  });

  it("returns nothing for a blank query", () => {
    expect(rank("", "Plex")).toEqual([]);
    expect(rank("  ", "Plex")).toEqual([]);
  });

  it("puts the best match first", () => {
    expect(rank("pl", "Paperless-ngx", "Pi-hole", "Plex")).toEqual(["Plex", "Pi-hole"]);
  });

  it("hides weak matches whose letters are scattered", () => {
    expect(rank("plx", "Paperless-ngx", "Plex")).toEqual(["Plex"]);
    expect(rank("uk", "Authentik", "Uptime Kuma")).toEqual(["Uptime Kuma"]);
    expect(rank("tr", "Vaultwarden", "Portainer", "Traefik")).toEqual(["Traefik"]);
  });

  it("keeps a single-letter query useful", () => {
    expect(rank("g", "Plex", "Grafana", "Gitea")).toEqual(["Grafana", "Gitea"]);
  });

  it("breaks ties in the order the apps were given", () => {
    expect(rank("pro", "Prometheus", "Proxmox", "Nginx Proxy Manager")).toEqual([
      "Prometheus",
      "Proxmox",
      "Nginx Proxy Manager",
    ]);
    expect(rank("pro", "Nginx Proxy Manager", "Proxmox", "Prometheus")).toEqual([
      "Nginx Proxy Manager",
      "Proxmox",
      "Prometheus",
    ]);
  });

  it("ranks apps from different groups together", () => {
    const groups = [apps("Pi-hole", "Grafana"), apps("Plex", "Gitea")];
    expect(rankApps(groups.flat(), "pl").map((a) => a.name)).toEqual(["Plex", "Pi-hole"]);
  });
});

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

  it("searches normally for a slash followed only by whitespace", () => {
    expect(submitTarget({ query: "/ ", searchEngine: engine, best: undefined, forceSearch: false })).toBe(`${engine}%2F`);
  });

  it("does nothing for a blank query", () => {
    expect(submitTarget({ query: "  ", searchEngine: engine, best: undefined, forceSearch: false })).toBeNull();
  });
});

describe("isFilterQuery", () => {
  it("requires a non-blank remainder after the slash", () => {
    expect(isFilterQuery("/pl")).toBe(true);
    expect(isFilterQuery("/")).toBe(false);
    expect(isFilterQuery("/ ")).toBe(false);
    expect(isFilterQuery("pl")).toBe(false);
  });
});

describe("filterApps", () => {
  it("ranks apps against the text after the slash", () => {
    expect(filterApps(apps("Plex", "Grafana"), "/gf").map((a) => a.name)).toEqual(["Grafana"]);
  });
});
