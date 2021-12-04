import { createContext } from "react";
import { IConfiguration } from "../../services/ConfigService";

export const GlobalContext = createContext<{ config: IConfiguration | null, setConfig: React.Dispatch<React.SetStateAction<IConfiguration | null>> } | null>(null);