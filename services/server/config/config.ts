import fs from "fs";
import { Config } from "./types";
import { merge } from "lodash-es";

const CONFIG_PATH = `${process.cwd()}/data/config.json`;

export const defaultConfigData: Config = {
  version: parseInt(process.env.CONFIG_VERSION ?? "1"),
  general: {
    searchUrl: "https://www.google.com/search?q=",
    customSearchUrl: "",
    customSearchEnabled: false,
    calendarUrl: "https://calendar.google.com/calendar/",
    searchPlaceholder: "Search...",
    theme: "default",
    appearance: "system",
    glassy: true,
    cacheKey: Math.random(),
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

export async function getConfig(): Promise<Config> {
  await ensureConfigExists();
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  return merge({}, defaultConfigData, config);
}

async function ensureConfigExists() {
  // Try getting stats for the cache file, if it errors the file doesn't exist so we need to create it
  try {
    await fs.statSync(CONFIG_PATH);
  } catch (ex) {
    console.warn("Failed to find config file. Generating a new one.");
    await saveConfig(defaultConfigData);
  }
}

export async function saveConfig(newConfig: Config) {
  await fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig));
}
