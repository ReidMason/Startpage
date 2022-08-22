import { Config } from "../../src/backend/routers/config/schemas";

export interface GlobalContext {
  config?: Config;
  updateConfig: (newConfig: Partial<Config>) => void;
  updateCacheKey: () => void;
  saveConfig: (newConfig: Config) => Promise<void>;
}
