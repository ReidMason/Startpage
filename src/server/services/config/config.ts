import { Config, configSchema } from "./schemas";
import fs from "fs";
import { merge } from "lodash-es";

const CONFIG_PATH = `${process.cwd()}/data/config.json`;

const defaultConfig = configSchema.parse({});

async function ensureConfigExists() {
  // Try getting stats for the cache file, if it errors the file doesn't exist so we need to create it
  try {
    fs.statSync(CONFIG_PATH);
  } catch (ex) {
    console.warn("Failed to find config file. Generating a new one.");
    saveConfig(defaultConfig);
  }
}

function saveConfig(newConfig: Config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig));
}

export async function getConfig() {
  await ensureConfigExists();
  const config: Config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  return merge({}, defaultConfig, config);
}
