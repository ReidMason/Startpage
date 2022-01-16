import React from 'react';
import App from "../App";
import { App as AppInterface } from "../../interfaces/Config";

interface AppsGridProps {
    apps: Array<AppInterface>;
    appNameFilter: string;
}

export default function AppsGrid({ apps, appNameFilter }: AppsGridProps) {
    const filteredApps = apps.filter(x => x.name.toLowerCase().includes(appNameFilter));

    return (
        <section className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 transition-opacity" aria-label="apps-grid">
            {(filteredApps).map((app) => (
                <App app={app} key={app.name + app.icon + app.url} />
            ))}
        </section>
    )
}
