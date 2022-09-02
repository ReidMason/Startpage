import dynamic from "next/dynamic";
import App from "../../elements/app/App";
import LayoutGrid from "../../layoutGrid/LayoutGrid";
import { Config } from "../../../backend/routers/config/schemas";
import { ConfigSetter } from "../../../../types/common";

interface AppsGridProps {
  appNameFilter: string;
  editMode: boolean;
  config: Config;
  updateConfig: ConfigSetter;
}

const DynamicEditableAppsGrid = dynamic(
  () => import("../EditableAppsGrid/EditableAppsGrid")
);

export default function AppsGrid({
  appNameFilter,
  editMode,
  config,
  updateConfig,
}: AppsGridProps) {
  const filteredApps = config.apps.filter((x) =>
    x.name.toLowerCase().includes(appNameFilter)
  );

  return (
    <>
      {editMode ? (
        <LayoutGrid>
          <DynamicEditableAppsGrid
            config={config}
            updateConfig={updateConfig}
          />
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
