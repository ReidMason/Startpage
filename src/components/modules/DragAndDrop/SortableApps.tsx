import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { AnimatePresence, domMax, LazyMotion, m } from "framer-motion";
import { createPortal } from "react-dom";
import { softSpringTransition } from "../../../../common";
import type { StateSetter } from "../../../../types/common";
import { App as AppInterface } from "../../../backend/routers/config/schemas";
import AppsBinDroppable from "./AppsBinDroppable";
import DraggableApp from "./DraggableApp";

interface SortableAppsProps {
  modifiedApps: Array<AppInterface>;
  editApp: (app: AppInterface) => void;
  createNewApp: () => void;
}

export default function SortableApps({
  modifiedApps,
  editApp,
  createNewApp,
}: SortableAppsProps) {
  return (
    <LazyMotion features={domMax}>
      <SortableContext
        items={modifiedApps.map((x) => x.id)}
        strategy={rectSortingStrategy}
      >
        <AnimatePresence initial={false}>
          {modifiedApps
            .filter((x) => x.enabled !== false)
            .map((app) => (
              <DraggableApp key={app.id} app={app} editApp={editApp} />
            ))}
        </AnimatePresence>

        <m.button
          layoutId="new-button"
          transition={softSpringTransition}
          className="group flex items-center justify-center rounded border border-primary-400/80"
          onClick={createNewApp}
        >
          <PlusCircleIcon className="h-12 w-12 text-primary-50 group-hover:text-red-500" />
        </m.button>

        {createPortal(
          <div className="fixed bottom-24 right-24">
            <AppsBinDroppable />
          </div>,
          document.body
        )}
      </SortableContext>
    </LazyMotion>
  );
}
