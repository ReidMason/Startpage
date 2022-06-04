import dynamic from "next/dynamic";
import { App as AppInterface } from "../../../services/server/config/types";
import App from "../../app/App";
import {
  m,
  AnimatePresence,
  domMax,
  LazyMotion,
  Transition,
} from "framer-motion";
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
    <LazyMotion features={domMax}>
      <AnimatePresence initial={false}>
        {editMode && (
          <LayoutGrid>
            <DynamicEditableAppsGrid apps={apps} />
          </LayoutGrid>
        )}
        {!editMode && (
          <LayoutGrid>
            {filteredApps.map((app) => (
              <m.div layout transition={spring} key={app.id}>
                <App app={app} />
              </m.div>
            ))}
          </LayoutGrid>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
