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
            exit="hidden"
            variants={{
              shown: { opacity: 1 },
              hidden: { opacity: 0.5 },
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <div className="gap grid gap-4 first-line:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <DynamicEditableAppsGrid apps={apps} />
            </div>
          </m.div>
        )}
        {!editMode && (
          <m.div
            className="w-full"
            key="apps-grid"
            initial="hidden"
            animate="shown"
            exit="hidden"
            variants={{
              shown: { opacity: 1 },
              hidden: { opacity: 1 },
            }}
            transition={{
              delay: 0.05,
            }}
          >
            <div className="gap grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredApps.map((app) => (
                <m.div layout transition={spring} key={app.id}>
                  <App app={app} />
                </m.div>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
