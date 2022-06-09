import { Config } from "../../services/server/config/types";

export interface GlobalContext {
  config?: Config;
  updateConfig: (newConfig: Partial<Config>) => void;
  updateCacheKey: () => void;
}
