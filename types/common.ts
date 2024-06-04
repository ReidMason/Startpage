import type { PartialConfig } from "../src/backend/routers/config/schemas";

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
export type ConfigSetter = (
  newConfig: PartialConfig,
  save: boolean,
  updateCachKey: boolean
) => Promise<void>;
