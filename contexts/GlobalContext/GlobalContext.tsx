import { createContext } from "react";
import { Config } from "../../src/backend/routers/config/schemas";
import { GlobalContext as GlobalContextInterface } from "./types";

export default createContext<GlobalContextInterface>({
  updateCacheKey: () => {},
  updateConfig: () => {},
  saveConfig: async (newConfig: Config) => {},
});
