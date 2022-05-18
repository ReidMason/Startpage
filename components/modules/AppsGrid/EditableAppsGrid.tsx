import React, { useState } from "react";
import { App as AppInterface } from "../../../services/config/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
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

interface EditableAppsGridProps {
  apps: Array<AppInterface>;
}

export default function EditableAppsGrid({ apps }: EditableAppsGridProps) {
  const [modifiedApps, setModifiedApps] = useState(apps);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={modifiedApps.map((x) => x.id)}
        strategy={rectSortingStrategy}
      >
        {modifiedApps.map((app) => (
          <SortableItem key={app.id} id={app.id}>
            <App app={app} preview editMode />
          </SortableItem>
        ))}
        <button
          onClick={createNewApp}
          className="group flex items-center justify-center rounded border border-primary-400/80"
        >
          <PlusCircleIcon className="h-12 w-12 text-primary-50 group-hover:text-red-500" />
        </button>
      </SortableContext>
    </DndContext>
  );
}
