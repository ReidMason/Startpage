import { useEffect, useState } from "react";
import type {
  App as AppInterface,
  PartialConfig,
} from "../../../backend/routers/config/schemas";
import { DragOverlay } from "@dnd-kit/core";
import App from "../../elements/app/App";
import SortableApps from "../DragAndDrop/SortableApps";
import { createPortal } from "react-dom";
import useConfig from "../../../hooks/useConfig";
import EditableAppsGridDndContext from "../../elements/editableAppsGridDndContext/EditableAppsGridDndContext";
import dynamic from "next/dynamic";

const DynamicAppEditModal = dynamic(() => import("./AppEditModal"));

export default function EditableAppsGrid() {
  const { config, configMutation } = useConfig();
  const [modifiedApps, setModifiedApps] = useState<Array<AppInterface>>();

  useEffect(() => {
    // Initialise the modified and temp apps lists
    if (config.isLoading || config.isError || config.isIdle) return;

    if (modifiedApps === undefined) setModifiedApps(config.data.apps);
  }, [config, modifiedApps]);

  const saveConfig = async (newConfig: PartialConfig) => {
    await configMutation.mutateAsync(newConfig, {
      onSuccess: () => {
        config.refetch();
      },
    });
  };

  const [activeApp, setActiveApp] = useState<AppInterface | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [appBeingEdited, setAppBeingEdit] = useState<AppInterface>();
  const [binHovered, setBinHovered] = useState(false);

  const editApp = (app: AppInterface) => {
    setAppBeingEdit(app);
    setEditModalOpen(true);
  };

  return (
    <EditableAppsGridDndContext
      binHovered={binHovered}
      setBinHovered={setBinHovered}
      modifiedApps={modifiedApps}
      setModifiedApps={setModifiedApps}
      setActiveApp={setActiveApp}
    >
      {modifiedApps && (
        <SortableApps
          modifiedApps={modifiedApps}
          setModifiedApps={setModifiedApps}
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
