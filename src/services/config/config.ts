"use server";

import { merge } from "lodash-es";
import { Config, configSchema } from "./schemas";
import fs from "fs";

const CONFIG_PATH = `${process.cwd()}/data/config.json`;
const defaultConfig = configSchema.parse({});

export async function getConfig(): Promise<Config> {
  ensureConfigExists();

  const rawConfig = fs.readFileSync(CONFIG_PATH, "utf8");

  let config = JSON.parse(rawConfig);
  const newConfig = merge(defaultConfig, config);
  if (JSON.stringify(config) != JSON.stringify(newConfig))
    saveConfig(newConfig);

  return newConfig;
}

function ensureConfigExists() {
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
