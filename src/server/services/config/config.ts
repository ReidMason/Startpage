import fs from "fs";
import { z } from "zod";
import { merge } from "lodash-es";

const CONFIG_PATH = "./data/config.json";

const appSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  icon: z.string(),
  enabled: z.boolean().default(false),
});

const providerSchema = z.object({
  id: z.string(),
  baseUrl: z.string(),
  prefix: z.string(),
  searchUrl: z.string(),
});

const generalSchema = z.object({
  searchUrl: z.string().default("https://www.google.com/search?q="),
  customSearchUrl: z.string().default(""),
  customSearchEnabled: z.boolean().default(false),
  searchPlaceholder: z.string().default("Search..."),
  calendarUrl: z.string().default("https://calendar.google.com/calendar/"),
});

const weatherSchema = z.object({
  enabled: z.boolean().default(false),
  location: z.string().default(""),
  detailed: z.boolean().default(false),
  apiKey: z.string().default(""),
});

const appearanceSchema = z.object({
  glassy: z.boolean().default(false),
  opacity: z.number().default(100),
  backgroundImageEnabled: z.boolean().default(false),
});

const configSchema = z
  .object({
    version: z.number().default(1),
    appearance: appearanceSchema.default({}),
    general: generalSchema.default({}),
    weather: weatherSchema.default({}),
    apps: z.array(appSchema).default([]),
    providers: z.array(providerSchema).default([]),
  })
  .strict();

export type Config = z.infer<typeof configSchema>;
export type App = z.infer<typeof appSchema>;
export type Provider = z.infer<typeof providerSchema>;

export function getConfig(): Config {
  ensureConfigIsValid();
  const config = JSON.parse(readConfig()) as Config;
  return config;
}

export function saveConfig(newConfig: Config): Config {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig));
  return newConfig;
}

function readConfig(): string {
  ensureConfigExists();
  return fs.readFileSync(CONFIG_PATH, "utf-8");
}

function ensureConfigExists() {
  if (!fs.existsSync(CONFIG_PATH)) {
    saveConfig(getDefaultConfig());
  }
}

function ensureConfigIsValid() {
  const config = JSON.parse(readConfig()) as Config;
  const newConfig = merge(getDefaultConfig(), config);
  if (JSON.stringify(config) != JSON.stringify(newConfig))
    saveConfig(newConfig);
}

function getDefaultConfig(): Config {
  return configSchema.parse({});
}
