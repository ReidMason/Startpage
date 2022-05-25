import { useContext, useState } from "react";
import {
  App as AppInterface,
  Config,
} from "../../../services/server/config/types";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SortableItem from "../DragAndDrop/SortableItem";
import App from "../../App/App";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { generateUuid } from "../../../utils";
import AppEditModal from "./AppEditModal";
import Droppable from "../DragAndDrop/Droppable";
import { StateSetter } from "../../../types/common";
import GlobalContext from "../../../contexts/GlobalContext/GlobalContext";
import { updateConfig } from "../../../services/client/config/config";

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    setActiveApp(null);
    const { active, over } = event;

    // Item wasn't dragged over anything
    if (over === null) return;

    // App was dragged over the bin so delete it
    if (over.id == "bin") {
      deleteApp(active.id);
      return;
    }

    if (active.id !== over.id) {
      setModifiedApps((modifiedApps) => {
        const oldIndex = modifiedApps.map((x) => x.id).indexOf(active.id);
        const newIndex = modifiedApps.map((x) => x.id).indexOf(over.id);

        return arrayMove(modifiedApps, oldIndex, newIndex);
      });
    }
  }

  const deleteApp = (appId: string) => {
    const newApps = modifiedApps.filter((x) => x.id != appId);
    saveApps({ apps: newApps }, config!, setConfig!);

    setModifiedApps((modifiedApps) => {
      return modifiedApps.filter((x) => x.id != appId);
    });
  };

  const createNewApp = () => {
    const newApp = {
      icon: "mdi:square-edit-outline",
      name: "New app",
      url: "app.example.com",
      id: generateUuid(),
    };

    const newApps = [...modifiedApps, newApp];
    saveApps({ apps: newApps }, config!, setConfig!);
    setModifiedApps([...modifiedApps, newApp]);
  };

  function handleDragStart(event: DragStartEvent) {
    setActiveApp(modifiedApps.find((x) => x.id == event.active.id) || null);
  }

  const editApp = (app: AppInterface) => {
    setEditableApp(app);
    setEditModalOpen(true);
  };

  const closeModal = () => {
    setEditModalOpen(false);
  };

  const handleDragOver = (e: DragOverEvent) => {
    if (!hoveredBin && e.over?.id === "bin") {
      setHoveredBin(true);
    } else if (hoveredBin) {
      setHoveredBin(false);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        <SortableContext
          items={modifiedApps.map((x) => x.id)}
          strategy={rectSortingStrategy}
        >
          {modifiedApps.map((app) => (
            <div className="group relative" key={app.id}>
              <SortableItem id={app.id}>
                <div className={activeApp?.id === app.id ? "invisible" : ""}>
                  <App app={app} preview editMode />
                </div>
              </SortableItem>
              <button
                onClick={() => editApp(app)}
                className="absolute top-0 hidden rounded bg-primary-400 px-4 active:scale-90 group-hover:block"
              >
                Edit
              </button>
            </div>
          ))}
          <button
            onClick={createNewApp}
            className="group flex items-center justify-center rounded border border-primary-400/80"
          >
            <PlusCircleIcon className="h-12 w-12 text-primary-50 group-hover:text-red-500" />
          </button>
          <DragOverlay>
            {activeApp && (
              <div
                className={`cursor-grabbing rounded border-2 border-primary-200 transition-opacity ${
                  hoveredBin ? "opacity-20" : ""
                }`}
              >
                <App app={activeApp} preview editMode />
              </div>
            )}
          </DragOverlay>

          <div className="fixed bottom-24 right-24">
            <Droppable />
          </div>
        </SortableContext>

        {editableApp && (
          <AppEditModal
            open={editModalOpen}
            setOpen={setEditModalOpen}
            app={editableApp}
          />
        )}
      </DndContext>
    </>
  );
}
