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
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import App from "../../app/App";
import AppEditModal from "./AppEditModal";
import { StateSetter } from "../../../types/common";
import GlobalContext from "../../../contexts/GlobalContext/GlobalContext";
import { updateConfig } from "../../../services/client/config/config";
import SortableApps from "./SortableApps";

interface EditableAppsGridProps {
  apps: Array<AppInterface>;
}

const saveApps = async (
  newConfig: Partial<Config>,
  config: Config,
  setConfig: StateSetter<Config>
) => {
  setConfig(await updateConfig(config, newConfig));
};

export default function EditableAppsGrid({ apps }: EditableAppsGridProps) {
  const { config, setConfig } = useContext(GlobalContext);

  const [modifiedApps, setModifiedApps] = useState(apps);
  const [activeApp, setActiveApp] = useState<AppInterface | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editableApp, setEditableApp] = useState<AppInterface>();
  const [hoveredBin, setHoveredBin] = useState(false);

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveApp(null);

    // App was dragged over the bin so delete it
    if (over && over.id == "bin") {
      updateApps(modifiedApps.filter((x) => x.id != active.id));
    } else if (over && active.id !== over.id) {
      console.log(active);
      console.log(over);

      setModifiedApps((modifiedApps) => {
        const oldIndex = modifiedApps.map((x) => x.id).indexOf(active.id);
        const newIndex = modifiedApps.map((x) => x.id).indexOf(over.id) - 1;

        return arrayMove(modifiedApps, oldIndex, newIndex);
      });
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

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!hoveredBin && over?.id === "bin") {
      setHoveredBin(true);
    } else if (hoveredBin) {
      setHoveredBin(false);
    }

    if (over && over?.id !== "bin") {
      setModifiedApps((modifiedApps) => {
        const oldIndex = modifiedApps.map((x) => x.id).indexOf(active.id);
        const newIndex = modifiedApps.map((x) => x.id).indexOf(over.id);

        return arrayMove(modifiedApps, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
    >
      <SortableApps
        modifiedApps={modifiedApps}
        setModifiedApps={setModifiedApps}
        updateApps={updateApps}
        editApp={editApp}
      />

      <DragOverlay>
        {activeApp && (
          <div
            className={`cursor-grabbing rounded outline transition-opacity ${
              hoveredBin ? "opacity-20 outline-red-500" : "outline-primary-200"
            }`}
          >
            <App app={activeApp} preview />
          </div>
        )}
      </DragOverlay>

      {editableApp && (
        <AppEditModal
          open={editModalOpen}
          setOpen={setEditModalOpen}
          app={editableApp}
        />
      )}
    </DndContext>
  );
}
