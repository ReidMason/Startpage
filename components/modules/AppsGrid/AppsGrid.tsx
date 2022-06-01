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
          <m.div
            className="w-full"
            key="editable-apps-grid"
            initial="hidden"
            animate="shown"
            exit="exit"
            variants={{
              shown: { opacity: 1 },
              hidden: { opacity: 0 },
              exit: { opacity: 0 },
            }}
            transition={{
              duration: 0.4,
            }}
          >
            <LayoutGrid>
              <DynamicEditableAppsGrid apps={apps} />
            </LayoutGrid>
          </m.div>
        )}
        {!editMode && (
          <LayoutGrid>
            {filteredApps.map((app) => (
              <m.div
                className="w-full"
                key="editable-apps-grid"
                initial="hidden"
                animate="shown"
                exit="exit"
                variants={{
                  shown: { opacity: 1 },
                  hidden: { opacity: 0 },
                  exit: { opacity: 0 },
                }}
                transition={{
                  duration: 0.4,
                }}
                key={app.id}
              >
                <m.div layout transition={spring}>
                  <App app={app} />
                </m.div>
              </m.div>
            ))}
          </LayoutGrid>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
