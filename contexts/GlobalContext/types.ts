import { Config } from "../../services/server/config/types";
import { StateSetter } from "../../types/common";

export interface GlobalContext {
  config?: Config;
  setConfig?: StateSetter<Config>;
}
