import { describe, expect, it } from "vitest";

import type { App } from "@/api";
import { rankApps } from "@/lib/filter";

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
