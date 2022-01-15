import { createContext } from "react";
import IStartpageContext from "../../interfaces/StartpageContext";

export const startpageContext = createContext<{ startpageCont: IStartpageContext, setStartpageCont: React.Dispatch<React.SetStateAction<IStartpageContext>> }>({ startpageCont: { modules: [] }, setStartpageCont: () => { } });