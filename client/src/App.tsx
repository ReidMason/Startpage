import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import MainRoutes from './routes/MainRoutes'
import { getConfig, IConfiguration } from "./services/ConfigService";
import { GlobalContext } from './views/startpage/globalContext';

export default function App() {
    const [config, setConfig] = useState<IConfiguration | null>(null);

    useEffect(() => {
        // Load the config
        getConfig().then((response) => {
            setConfig(response.data);
        });
    }, []);

    return (
        <GlobalContext.Provider value={{ config, setConfig }}>
            <BrowserRouter>
                {config &&
                    <MainRoutes />
                }
            </BrowserRouter>
        </GlobalContext.Provider>
    )
}
