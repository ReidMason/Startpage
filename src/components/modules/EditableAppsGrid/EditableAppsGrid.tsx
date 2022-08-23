import { useEffect, useState } from "react";
import {
  App as AppInterface,
  PartialConfig,
} from "../../../backend/routers/config/schemas";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  Over,
  Active,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import App from "../../app/App";
import AppEditModal from "./AppEditModal";
import SortableApps from "../DragAndDrop/SortableApps";
import { createPortal } from "react-dom";
import useConfig from "../../../hooks/useConfig";

export default function EditableAppsGrid() {
  const { config, configMutation } = useConfig();
  const [modifiedApps, setModifiedApps] = useState<Array<AppInterface>>();

  useEffect(() => {
    // Initialise the modified and temp apps lists
    if (config.isLoading || config.isError || config.isIdle) return;

    if (modifiedApps === undefined) setModifiedApps(config.data.apps);
  }, [config.isLoading, config.data, config.data?.apps]);

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
  const [hoveredBin, setHoveredBin] = useState(false);

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveApp(null);

    // Didn't drag over anything so put the item back where it was
    if (!over) {
      ensureAppEnabled(active.id);
      return;
    }

    // App was dragged over the bin so delete it
    if (over.id === "bin") {
      const newApps = modifiedApps?.filter((x) => x.id != active.id);
      setModifiedApps(newApps);
    }
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveApp(modifiedApps?.find((x) => x.id == active.id) || null);
  };

  const editApp = (app: AppInterface) => {
    setAppBeingEdit(app);
    setEditModalOpen(true);
  };

  const updateHoveredBinState = (overId: string | undefined) => {
    if (!hoveredBin && overId === "bin") {
      setHoveredBin(true);
    } else if (hoveredBin) {
      setHoveredBin(false);
    }
  };

  const repositionElements = (active: Active, over: Over | null) => {
    if (over && over.id !== "bin") {
      setModifiedApps((apps) => {
        const oldIndex = apps!.map((x) => x.id).indexOf(active.id);
        const newIndex = apps!.map((x) => x.id).indexOf(over.id);

        return arrayMove(apps!, oldIndex, newIndex);
      });
    }
  };

  const updateActiveElementState = (active: Active, over: Over | null) => {
    // Item is dragged outside of droppable area so we want to hide it from the list
    if (over === null)
      setModifiedApps((prev) =>
        prev!.map((x) => (x.id === active.id ? { ...x, enabled: false } : x))
      );
    // Item is back within droppable area so make sure it's active
    else if (over.id !== "bin") ensureAppEnabled(active.id);
  };

  const ensureAppEnabled = (appId: string) => {
    setModifiedApps((prev) =>
      prev!.map((x) => (x.id === appId ? { ...x, enabled: true } : x))
    );
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    updateActiveElementState(active, over);
    updateHoveredBinState(over?.id);
    repositionElements(active, over);
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
    >
      {modifiedApps && (
        <SortableApps
          modifiedApps={modifiedApps}
          setModifiedApps={setModifiedApps}
          editApp={editApp}
        />
      )}

      {appBeingEdited && (
        <AppEditModal
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
                hoveredBin
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
    </DndContext>
  );
}
