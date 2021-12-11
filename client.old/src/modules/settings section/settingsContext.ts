import { createContext } from "react";
import { IConfiguration } from "../../services/ConfigService";

export const SettingsContext = createContext<{ modifiedConfig: IConfiguration | null, setModifiedConfig: React.Dispatch<React.SetStateAction<IConfiguration | null>> } | null>(null);