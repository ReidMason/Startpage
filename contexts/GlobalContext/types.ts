import { ConfigSchema } from "../../src/backend/routers/config/types";

export interface GlobalContext {
  config?: Config;
  updateConfig: (newConfig: Partial<Config>) => void;
  updateCacheKey: () => void;
}
