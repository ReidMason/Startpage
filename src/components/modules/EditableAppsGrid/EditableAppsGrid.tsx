import { useState } from "react";
import type {
  App as AppInterface,
  Config,
} from "../../../backend/routers/config/schemas";
import { DragOverlay } from "@dnd-kit/core";
import App from "../../elements/app/App";
import SortableApps from "../DragAndDrop/SortableApps";
import { createPortal } from "react-dom";
import EditableAppsGridDndContext from "../../elements/editableAppsGridDndContext/EditableAppsGridDndContext";
import dynamic from "next/dynamic";
import { generateUuid } from "../../../../utils";
import { ConfigSetter } from "../../../../types/common";

const DynamicAppEditModal = dynamic(() => import("./AppEditModal"));

interface EditableAppsGridProps {
  config: Config;
  updateConfig: ConfigSetter;
}

export default function EditableAppsGrid({
  config,
  updateConfig,
}: EditableAppsGridProps) {
  const [modifiedApps, setModifiedApps] = useState(config.apps);
  const [tempApps, setTempApps] = useState(modifiedApps);

  const [activeApp, setActiveApp] = useState<AppInterface | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [appBeingEdited, setAppBeingEdit] = useState<AppInterface>();
  const [binHovered, setBinHovered] = useState(false);

  const editApp = (app: AppInterface) => {
    setAppBeingEdit(app);
    setEditModalOpen(true);
  };

  const createNewApp = () => {
    const newApp = {
      icon: "mdi:square-edit-outline",
      name: "New app",
      url: "app.example.com",
      id: generateUuid(),
    };

    const newApps = [...modifiedApps, newApp];
    setTempApps(newApps);
    setModifiedApps(newApps);
  };

  return (
    <EditableAppsGridDndContext
      binHovered={binHovered}
      setBinHovered={setBinHovered}
      setActiveApp={setActiveApp}
      tempApps={tempApps}
      setTempApps={setTempApps}
      modifiedApps={modifiedApps}
      setModifiedApps={setModifiedApps}
    >
      {modifiedApps && (
        <SortableApps
          modifiedApps={tempApps}
          createNewApp={createNewApp}
          editApp={editApp}
        />
      )}

      {appBeingEdited && (
        <DynamicAppEditModal
          open={editModalOpen}
          setOpen={setEditModalOpen}
          app={appBeingEdited}
        />
      )}

      {createPortal(
        <DragOverlay>
          {activeApp && (
            <div
              className={`cursor-grabbing rounded outline transition-opacity ${
                binHovered
                  ? "opacity-20 outline-red-500"
                  : "outline-primary-200"
              }`}
            >
              <App app={activeApp} preview />
            </div>
          )}
        </DragOverlay>,
        document.body
      )}
    </EditableAppsGridDndContext>
  );
}
