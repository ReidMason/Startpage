import React, { useState } from "react";
import { App as AppInterface } from "../../../services/config/types";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SortableItem from "../DragAndDrop/SortableItem";
import App from "../../App";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { generateUuid } from "../../../utils";
import AppEditModal from "./AppEditModal";
import Droppable from "../DragAndDrop/Droppable";

interface EditableAppsGridProps {
  apps: Array<AppInterface>;
}

export default function EditableAppsGrid({ apps }: EditableAppsGridProps) {
  const [modifiedApps, setModifiedApps] = useState(apps);
  const [activeApp, setActiveApp] = useState<AppInterface | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editableApp, setEditableApp] = useState<AppInterface>();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    setActiveApp(null);
    const { active, over } = event;

    if (over.id == "bin") {
      setModifiedApps((modifiedApps) => {
        return modifiedApps.filter((x) => x.id != active.id);
      });
    }

    if (active.id !== over.id) {
      setModifiedApps((modifiedApps) => {
        const oldIndex = modifiedApps.map((x) => x.id).indexOf(active.id);
        const newIndex = modifiedApps.map((x) => x.id).indexOf(over.id);

        return arrayMove(modifiedApps, oldIndex, newIndex);
      });
    }
  }

  const createNewApp = () => {
    setModifiedApps([
      ...modifiedApps,
      {
        icon: "mdi:square-edit-outline",
        name: "New app",
        url: "app.example.com",
        id: generateUuid(),
      },
    ]);
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

  return (
    <>
      <DndContext
        sensors={sensors}
        // collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
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
              <div className="cursor-grabbing rounded border-2 border-primary-200">
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
