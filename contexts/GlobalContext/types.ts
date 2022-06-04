import { Config } from "../../services/server/config/types";

export interface GlobalContext {
  config?: Config;
  updateConfig: (newConfig: Config) => void;
  updateCacheKey: () => void;
}
