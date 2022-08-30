import dynamic from "next/dynamic";
import App from "../../elements/app/App";
import LayoutGrid from "../../layoutGrid/LayoutGrid";
import { Config } from "../../../backend/routers/config/schemas";

interface AppsGridProps {
  appNameFilter: string;
  editMode: boolean;
  config: Config;
}

const DynamicEditableAppsGrid = dynamic(
  () => import("../EditableAppsGrid/EditableAppsGrid")
);

export default function AppsGrid({
  appNameFilter,
  editMode,
  config,
}: AppsGridProps) {
  const filteredApps = config.apps.filter((x) =>
    x.name.toLowerCase().includes(appNameFilter)
  );

  return (
    <>
      {editMode ? (
        <LayoutGrid>
          <DynamicEditableAppsGrid />
        </LayoutGrid>
      ) : (
        <LayoutGrid>
          {filteredApps?.map((app) => (
            <App app={app} key={app.id} />
          ))}
        </LayoutGrid>
      )}
    </>
  );
}
