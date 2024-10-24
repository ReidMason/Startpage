"use server";

import { merge } from "lodash-es";
import { Config, configSchema } from "./schemas";
import fs from "fs";
import path from "path";

const CONFIG_PATH = `${process.cwd()}/data/config.json`;
const BACKGROUND_IMAGE_PATH = `${process.cwd()}/data/background.jpg`;
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
  const configDir = path.dirname(CONFIG_PATH);
  try {
    fs.statSync(configDir);
  } catch (ex) {
    console.warn("Failed to find config directory. Creating a new one.");
    fs.mkdirSync(configDir, { recursive: true });
  }
  try {
    fs.statSync(CONFIG_PATH);
  } catch (ex) {
    console.warn("Failed to find config file. Generating a new one.");
    saveConfig(defaultConfig);
  }
}

export async function saveConfig(newConfig: Config) {
  newConfig.version = defaultConfig.version;

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig));
}

export async function saveBackgroundImage(formData: FormData) {
  const file = formData.get("backgroundImage") as File;
  const buffer = await file.arrayBuffer();
  fs.writeFileSync(BACKGROUND_IMAGE_PATH, Buffer.from(buffer));
}

export async function getBackgroundImage(): Promise<string | undefined> {
  try {
    const imageBuffer = fs.readFileSync(BACKGROUND_IMAGE_PATH);
    if (!imageBuffer) undefined;
    const base64String = Buffer.from(imageBuffer).toString("base64");
    return `data:image/jpeg;base64,${base64String}`;
  } catch (ex) {
    return undefined;
  }
}
