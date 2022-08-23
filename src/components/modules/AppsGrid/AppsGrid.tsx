import dynamic from "next/dynamic";
import App from "../../elements/app/App";
import LayoutGrid from "../../grid/LayoutGrid";
import useConfig from "../../../hooks/useConfig";

interface AppsGridProps {
  appNameFilter: string;
  editMode: boolean;
}

const DynamicEditableAppsGrid = dynamic(
  () => import("../EditableAppsGrid/EditableAppsGrid")
);

export default function AppsGrid({ appNameFilter, editMode }: AppsGridProps) {
  const { config } = useConfig();

  const filteredApps = config.data?.apps.filter((x) =>
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
