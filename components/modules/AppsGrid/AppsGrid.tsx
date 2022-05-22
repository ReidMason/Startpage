import dynamic from "next/dynamic";
import { App as AppInterface } from "../../../services/config/types";
import App from "../../App";
import Skeleton from "../../skeleton/Skeleton";

interface AppsGridProps {
  apps: Array<AppInterface>;
  appNameFilter: string;
  editMode?: boolean;
}

const DynamicEditableAppsGrid = dynamic(
  () => import("../EditableAppsGrid/EditableAppsGrid"),
  { loading: () => <Skeleton /> }
);

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
        <DynamicEditableAppsGrid apps={apps} />
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
