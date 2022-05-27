import { Config } from "../../server/config/types";

export async function updateConfig(config: Config, newConfig: Partial<Config>) {
  const updatedConfig: Config = { ...config!, ...newConfig };

  // await saveConfig(updatedConfig);

  return updatedConfig;
}

export async function saveConfig(config: Config) {
  await fetch("/api/config", {
    method: "POST",
    body: JSON.stringify(config),
  });
}
