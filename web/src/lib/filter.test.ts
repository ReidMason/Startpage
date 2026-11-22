import { describe, expect, it } from "vitest";

import type { App } from "@/api";
import { filterApps, isFilterQuery, rankApps, submitTarget, urlTarget } from "@/lib/filter";

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

const go = (query: string, forceSearch = false) =>
  submitTarget({ query, searchEngine: engine, best: plex, forceSearch });

describe("direct navigation", () => {
  it.each([
    ["https://example.com/a?b=c", "https://example.com/a?b=c"],
    ["http://example.com", "http://example.com"],
    ["HTTP://x", "HTTP://x"],
    ["example.com", "https://example.com"],
    ["sub.example.co.uk:8080/path?q=1", "https://sub.example.co.uk:8080/path?q=1"],
    ["localhost", "http://localhost"],
    ["localhost:3000/app", "http://localhost:3000/app"],
    ["192.168.1.10", "https://192.168.1.10"],
    ["192.168.1.10:8080/x", "https://192.168.1.10:8080/x"],
    ["  example.com  ", "https://example.com"],
  ])("navigates to %s", (query, expected) => {
    expect(go(query)).toBe(expected);
  });

  it.each(["javascript:alert(1)", "data:text/html,hi", "file:///etc/passwd", "cats", "hello world", "example.com is down", "e.g", "1.2.3", "999.1.1"])(
    "searches for %s",
    (query) => {
      expect(go(query)).toBe(engine + encodeURIComponent(query.trim()));
    },
  );

  it("filter mode wins over a URL", () => {
    expect(go("/example.com")).toBe("https://plex.local");
  });

  it("force search wins over a URL", () => {
    expect(go("example.com", true)).toBe(`${engine}example.com`);
  });
});

describe("urlTarget", () => {
  it("is null for non-URLs and filter queries", () => {
    expect(urlTarget("cats")).toBeNull();
    expect(urlTarget("/example.com")).toBeNull();
    expect(urlTarget("")).toBeNull();
  });
});
