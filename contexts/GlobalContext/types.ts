import { Config } from "../../services/server/config/types";
import { StateSetter } from "../../types/common";

export interface GlobalContext {
  config?: Config;
  updateConfig: (newConfig: Config) => void;
  darkmode?: boolean;
  setDarkmode?: StateSetter<boolean>;
  updateCacheKey: () => void;
}
