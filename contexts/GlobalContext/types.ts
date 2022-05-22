import { Config } from "../../services/config/types";
import { StateSetter } from "../../types/common";

export interface GlobalContext {
  config?: Config;
  setConfig?: StateSetter<Config>;
}
