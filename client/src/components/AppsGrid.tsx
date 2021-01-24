import React, { useContext } from 'react';
import { GlobalContext } from '../modules/startpage/globalContext';
import App from "./App";

export default function AppsGrid() {
    const { config } = useContext(GlobalContext)!;

    return (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 transition-opacity">
            {config && config.apps.map((app) => (
                <App app={app} key={app.name + app.icon + app.url} />
            ))}
        </div>
    )
}
