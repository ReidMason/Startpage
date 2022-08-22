import dynamic from "next/dynamic";
import { App as AppInterface } from "../../../../services/server/config/types";
import App from "../../app/App";
import { Transition } from "framer-motion";
import LayoutGrid from "../../grid/LayoutGrid";

interface AppsGridProps {
  apps: Array<AppInterface>;
  appNameFilter: string;
  editMode?: boolean;
}

const DynamicEditableAppsGrid = dynamic(
  () => import("../EditableAppsGrid/EditableAppsGrid")
);

export default function AppsGrid({
  apps,
  appNameFilter,
  editMode,
}: AppsGridProps) {
  const filteredApps = apps.filter((x) =>
    x.name.toLowerCase().includes(appNameFilter)
  );

  const spring: Transition = {
    type: "spring",
    duration: 0.25,
  };

  return (
    <>
      {editMode && (
        <LayoutGrid>
          <DynamicEditableAppsGrid apps={apps} />
        </LayoutGrid>
      )}
      {!editMode && (
        <LayoutGrid>
          {filteredApps.map((app) => (
            <App app={app} key={app.id} />
          ))}
        </LayoutGrid>
      )}
    </>
  );
}
