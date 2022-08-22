import * as trpc from "@trpc/server";
import { merge } from "lodash-es";
import { z } from "zod";
import fs from "fs";
import { Config } from "../../../services/server/config/types";

const CONFIG_PATH = `${process.cwd()}/data/config.json`;

const defaultConfigData: Config = {
  version: parseInt(process.env.CONFIG_VERSION ?? "1"),
  general: {
    searchUrl: "https://www.google.com/search?q=",
    customSearchUrl: "",
    customSearchEnabled: false,
    calendarUrl: "https://calendar.google.com/calendar/",
    searchPlaceholder: "Search...",
    cacheKey: Math.random(),
  },
  appearance: {
    theme: "default",
    appearance: "system",
    glassy: true,
    backgroundEnabled: false,
  },
  apps: [],
  providers: [],
  weather: {
    enabled: false,
    location: "",
    detailed: false,
    apiKey: "",
  },
};

async function ensureConfigExists() {
  // Try getting stats for the cache file, if it errors the file doesn't exist so we need to create it
  try {
    await fs.statSync(CONFIG_PATH);
  } catch (ex) {
    console.warn("Failed to find config file. Generating a new one.");
    await saveConfig(defaultConfigData);
  }
}

async function saveConfig(newConfig: Config) {
  await fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig));
}

export async function getConfig() {
  await ensureConfigExists();
  const config: Config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  return merge({}, defaultConfigData, config);
}

const configRouter = trpc.router().query("get", {
  async resolve() {
    return await getConfig();
  },
});

export default configRouter;
