import { useContext, useState } from "react";
import {
  App as AppInterface,
  Config,
} from "../../../services/server/config/types";
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
import GlobalContext from "../../../contexts/GlobalContext/GlobalContext";
import { updateConfig } from "../../../services/client/config/config";
import SortableApps from "../DragAndDrop/SortableApps";
import { createPortal } from "react-dom";

interface EditableAppsGridProps {
  apps: Array<AppInterface>;
}

const saveApps = async (
  newConfig: Partial<Config>,
  config: Config,
  setConfig: (newConfig: Config) => void
) => {
  setConfig(await updateConfig(config, newConfig));
};

export default function EditableAppsGrid({ apps }: EditableAppsGridProps) {
  const { config, updateConfig: setConfig } = useContext(GlobalContext);

  const [modifiedApps, setModifiedApps] = useState(apps);
  const [tempApps, setTempApps] = useState<Array<AppInterface>>(
    apps.map((x) => ({ ...x, active: true }))
  );
  const [activeApp, setActiveApp] = useState<AppInterface | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editableApp, setEditableApp] = useState<AppInterface>();
  const [hoveredBin, setHoveredBin] = useState(false);

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveApp(null);

    // Didn't drag over anything so put the item back where it was
    if (over === null) setTempApps(modifiedApps);
    // Valid drag so update modified apps
    else setModifiedApps(tempApps);

    // App was dragged over the bin so delete it
    if (over && over.id == "bin") {
      const newApps = tempApps.filter((x) => x.id != active.id);
      updateApps(newApps);
      setTempApps(newApps);
    }
  }

  const updateApps = (newApps: Array<AppInterface>) => {
    saveApps({ apps: newApps }, config!, setConfig!);
    setModifiedApps(newApps);
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveApp(modifiedApps.find((x) => x.id == active.id) || null);
  };

  const editApp = (app: AppInterface) => {
    setEditableApp(app);
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
    if (over && over?.id !== "bin") {
      setTempApps((apps) => {
        const oldIndex = apps.map((x) => x.id).indexOf(active.id);
        const newIndex = apps.map((x) => x.id).indexOf(over.id);

        return arrayMove(apps, oldIndex, newIndex);
      });
    }
  };

  const updateActiveElementState = (active: Active, over: Over | null) => {
    // Item is dragged outside of droppable area so we want to hide it from the list
    if (over === null)
      setTempApps((prev) =>
        prev.map((x) => (x.id === active.id ? { ...x, active: false } : x))
      );
    // Item is back within droppable area so make sure it's active
    else if (
      tempApps.findIndex((x) => x.id === active.id && x.active !== false) ===
        -1 &&
      over.id !== "bin"
    )
      setTempApps((prev) =>
        prev.map((x) => (x.id === active.id ? { ...x, active: true } : x))
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
      <SortableApps
        modifiedApps={tempApps}
        setModifiedApps={setTempApps}
        updateApps={updateApps}
        editApp={editApp}
      />

      {editableApp && (
        <AppEditModal
          open={editModalOpen}
          setOpen={setEditModalOpen}
          app={editableApp}
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
