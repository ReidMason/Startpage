import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { AnimatePresence, m } from "framer-motion";
import React from "react";
import { springTranstition } from "../../../common";
import { App as AppInterface } from "../../../services/server/config/types";
import { StateSetter } from "../../../types/common";
import { generateUuid } from "../../../utils";
import PresenceAnimation from "../../animations/PresenceAnimation";
import App from "../../app/App";
import Droppable from "../DragAndDrop/Droppable";
import SortableItem from "../DragAndDrop/SortableItem";

interface SortableAppsProps {
  modifiedApps: Array<AppInterface>;
  setModifiedApps: StateSetter<Array<AppInterface>>;
  updateApps: (newApps: Array<AppInterface>) => void;
  editApp: (app: AppInterface) => void;
}

export default function SortableApps({
  modifiedApps,
  setModifiedApps,
  updateApps,
  editApp,
}: SortableAppsProps) {
  const createNewApp = () => {
    const newApp = {
      icon: "mdi:square-edit-outline",
      name: "New app",
      url: "app.example.com",
      id: generateUuid(),
    };

    const newApps = [...modifiedApps, newApp];
    updateApps(newApps);
    setModifiedApps([...modifiedApps, newApp]);
  };

  return (
    <SortableContext
      items={modifiedApps.map((x) => x.id)}
      strategy={rectSortingStrategy}
    >
      <AnimatePresence initial={false}>
        {modifiedApps.map((app) => (
          <PresenceAnimation className="group relative transition" key={app.id}>
            <SortableItem id={app.id}>
              <m.div
                layoutId={app.id}
                transition={{
                  type: "spring",
                  bounce: 0.15,
                }}
              >
                <App app={app} preview />
              </m.div>
            </SortableItem>

            <button
              onClick={() => editApp(app)}
              className="absolute top-0 right-0 hidden rounded bg-primary-400 px-4 active:scale-90 group-hover:block"
            >
              Edit
            </button>
          </PresenceAnimation>
        ))}
      </AnimatePresence>

      <m.button
        layoutId="new-button"
        transition={{
          type: "spring",
          bounce: 0.15,
        }}
        className="group flex items-center justify-center rounded border border-primary-400/80"
        onClick={createNewApp}
      >
        <PlusCircleIcon className="h-12 w-12 text-primary-50 group-hover:text-red-500" />
      </m.button>

      <div className="fixed bottom-24 right-24">
        <Droppable />
      </div>
    </SortableContext>
  );
}
