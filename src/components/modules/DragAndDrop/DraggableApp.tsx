import React from "react";
import type { App as AppInterface } from "../../../backend/routers/config/schemas";
import PresenceAnimation from "../../animations/PresenceAnimation";
import App from "../../elements/app/App";
import { m } from "framer-motion";
import SortableItem from "./SortableItem";
import { softSpringTransition } from "../../../../common";

interface DraggableAppProps {
  app: AppInterface;
  editApp: (app: AppInterface) => void;
}

export default function DraggableApp({ app, editApp }: DraggableAppProps) {
  return (
    <PresenceAnimation className="group relative transition">
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
  );
}
