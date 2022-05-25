import fs from "fs";
import { Config } from "./types";

const CONFIG_PATH = "./data/config.json";

export async function getConfig(): Promise<Config> {
  await ensureConfigExists();
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
}

async function ensureConfigExists() {
  // Try getting stats for the cache file, if it errors the file doesn't exist so we need to create it
  try {
    await fs.statSync(CONFIG_PATH);
  } catch (ex) {
    console.info("Failed to find config file. Generating a new one.");
    const defaultConfigData: Config = {
      version: parseInt(process.env.CONFIG_VERSION ?? "1"),
      general: {
        searchUrl: "https://www.google.com/search?q=",
        customSearchUrl: "",
        customSearchEnabled: false,
        calendarUrl: "https://calendar.google.com/calendar/",
        searchPlaceholder: "Search...",
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
    await saveConfig(defaultConfigData);
  }
}

export async function saveConfig(newConfig: Config) {
  await fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig));
}
