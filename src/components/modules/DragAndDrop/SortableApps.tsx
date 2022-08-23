import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { AnimatePresence, domMax, LazyMotion, m } from "framer-motion";
import React from "react";
import { createPortal } from "react-dom";
import { softSpringTransition } from "../../../../common";
import { StateSetter } from "../../../../types/common";
import { generateUuid } from "../../../../utils";
import { App as AppInterface } from "../../../backend/routers/config/schemas";
import PresenceAnimation from "../../animations/PresenceAnimation";
import App from "../../app/App";
import Droppable from "./Droppable";
import SortableItem from "./SortableItem";

interface SortableAppsProps {
  modifiedApps: Array<AppInterface>;
  setModifiedApps: StateSetter<Array<AppInterface> | undefined>;
  editApp: (app: AppInterface) => void;
}

export default function SortableApps({
  modifiedApps,
  setModifiedApps,
  editApp,
}: SortableAppsProps) {
  const createNewApp = () => {
    const newApp = {
      icon: "mdi:square-edit-outline",
      name: "New app",
      url: "app.example.com",
      id: generateUuid(),
    };

    setModifiedApps([...modifiedApps, newApp]);
  };

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
              <PresenceAnimation
                className="group relative transition"
                key={app.id}
              >
                <SortableItem id={app.id}>
                  <m.div layoutId={app.id} transition={softSpringTransition}>
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
          transition={softSpringTransition}
          className="group flex items-center justify-center rounded border border-primary-400/80"
          onClick={createNewApp}
        >
          <PlusCircleIcon className="h-12 w-12 text-primary-50 group-hover:text-red-500" />
        </m.button>

        {createPortal(
          <div className="fixed bottom-24 right-24">
            <Droppable />
          </div>,
          document.body
        )}
      </SortableContext>
    </LazyMotion>
  );
}
