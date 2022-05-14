import React, { useState } from "react";
import App from "../App";
import { App as AppInterface } from "../../services/config/types";

interface AppsGridProps {
  apps: Array<AppInterface>;
  appNameFilter: string;
}
export default function AppsGrid({ apps, appNameFilter }: AppsGridProps) {
  const filteredApps = apps.filter((x) =>
    x.name.toLowerCase().includes(appNameFilter)
  );

  return (
    <section
      className="gap grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      aria-label="apps-grid"
    >
      {filteredApps.map((app, i) => (
        <App app={app} key={app.name + app.icon + app.url} />
      ))}
    </section>
  );
}
