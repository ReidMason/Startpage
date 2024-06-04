import * as trpc from "@trpc/server";
import { merge } from "lodash-es";
import fs from "fs";
import { Config, configSchema, saveConfigSchema } from "./schemas";
import { completeConfig } from "../../../../utils";

const CONFIG_PATH = `${process.cwd()}/data/config.json`;

const defaultConfig = configSchema.parse({});

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
      // await new Promise((r) => setTimeout(r, 5000));
      return await getConfig();
    },
  })
  .mutation("save", {
    input: saveConfigSchema,
    async resolve({ input }) {
      const currentConfig = await getConfig();
      const newConfig = completeConfig(
        currentConfig,
        input.config,
        input.updateCacheKey
      );
      await saveConfig(newConfig);
      return newConfig;
    },
  });
export default configRouter;
