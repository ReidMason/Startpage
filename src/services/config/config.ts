"use server";

import { merge } from "lodash-es";
import { Config, configSchema } from "./schemas";
import fs from "fs";

const CONFIG_PATH = `${process.cwd()}/data/config.json`;
const BACKGROUND_IMAGE_PATH = `${process.cwd()}/public/static/background.jpg`;
const defaultConfig = configSchema.parse({});

export async function getConfig(): Promise<Config> {
  ensureConfigExists();
  const rawConfig = fs.readFileSync(CONFIG_PATH, "utf8");
  const config = JSON.parse(rawConfig);

  return validateConfig(config);
}

function validateConfig(config: Config): Config {
  const newConfig = merge(structuredClone(defaultConfig), config);

  // Replace any invalid values with the default value
  const result = configSchema.safeParse(newConfig);
  result.error?.errors.forEach((error) => {
    const value = error.path.reduce(
      (obj: any, key) => (obj || {})[key],
      defaultConfig,
    );

    error.path.reduce((obj: any, key, i: number) => {
      if (i === error.path.length - 1) {
        obj[key] = value;
      }
      return (obj || {})[key];
    }, newConfig);
  });

  if (result.error || JSON.stringify(config) != JSON.stringify(newConfig))
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

export async function saveBackgroundImage(formData: FormData) {
  const file = formData.get("backgroundImage") as File;
  const buffer = await file.arrayBuffer();
  fs.writeFileSync(BACKGROUND_IMAGE_PATH, Buffer.from(buffer));
}
