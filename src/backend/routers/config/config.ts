import * as trpc from "@trpc/server";
import { merge } from "lodash-es";
import fs from "fs";
import { z } from "zod";
import { Config, ConfigSchema } from "./types";

const CONFIG_PATH = `${process.cwd()}/data/config.json`;

const defaultConfig = ConfigSchema.parse({});

async function ensureConfigExists() {
  // Try getting stats for the cache file, if it errors the file doesn't exist so we need to create it
  try {
    await fs.statSync(CONFIG_PATH);
  } catch (ex) {
    console.warn("Failed to find config file. Generating a new one.");
    await saveConfig(defaultConfig);
  }
}

async function saveConfig(newConfig: Config) {
  await fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig));
}

export async function getConfig() {
  await ensureConfigExists();
  const config: Config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  return merge({}, defaultConfig, config);
}

const configRouter = trpc
  .router()
  .query("get", {
    async resolve() {
      return await getConfig();
    },
  })
  .mutation("save", {
    input: ConfigSchema,
    async resolve({ input }) {
      await saveConfig(input);
      return { message: "Config saved" };
    },
  });
export default configRouter;
