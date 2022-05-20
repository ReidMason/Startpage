import React from "react";
import { App as AppInterface } from "../../../services/config/types";
import App from "../../App";
import EditableAppsGrid from "../EditableAppsGrid/EditableAppsGrid";

interface AppsGridProps {
  apps: Array<AppInterface>;
  appNameFilter: string;
  editMode?: boolean;
}

export default function AppsGrid({
  apps,
  appNameFilter,
  editMode,
}: AppsGridProps) {
  const filteredApps = apps.filter((x) =>
    x.name.toLowerCase().includes(appNameFilter)
  );

  return (
    <div className="gap grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {editMode ? (
        <EditableAppsGrid apps={apps} />
      ) : (
        <>
          {filteredApps.map((app) => (
            <App app={app} key={app.id} />
          ))}
        </>
      )}
    </div>
  );
}
