"use server";

import { merge } from "lodash-es";
import { Config, configSchema } from "./schemas";
import fs from "fs";

const CONFIG_PATH = `${process.cwd()}/data/config.json`;
const defaultConfig = configSchema.parse({});

export async function getConfig(): Promise<Config> {
  ensureConfigExists();
  const rawConfig = fs.readFileSync(CONFIG_PATH, "utf8");
  const config = JSON.parse(rawConfig);

  return validateConfig(config);
}

function validateConfig(config: Config): Config {
  const newConfig = merge(defaultConfig, config);
  if (JSON.stringify(config) != JSON.stringify(newConfig))
    saveConfig(newConfig);

  return newConfig;
}

function ensureConfigExists() {
  try {
    fs.statSync(CONFIG_PATH);
  } catch (ex) {
    console.warn("Failed to find config file. Generating a new one.");
    saveConfig(defaultConfig);
  }
}

export async function saveConfig(newConfig: Config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig));
}
