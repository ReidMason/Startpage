import {
  DndContext,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  Over,
  Active,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { StateSetter } from "../../../../types/common";
import { App } from "../../../backend/routers/config/schemas";

interface EditableAppsGridDndContextProps {
  children: React.ReactNode;
  setActiveApp: StateSetter<App | null>;
  modifiedApps: Array<App> | undefined;
  setModifiedApps: StateSetter<Array<App> | undefined>;
  binHovered: boolean;
  setBinHovered: StateSetter<boolean>;
}

export default function EditableAppsGridDndContext({
  children,
  setActiveApp,
  modifiedApps,
  setModifiedApps,
  binHovered: hoveredBin,
  setBinHovered: setHoveredBin,
}: EditableAppsGridDndContextProps) {
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

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    updateActiveElementState(active, over);
    updateHoveredBinState(over?.id);
    repositionElements(active, over);
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

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
    >
      {children}
    </DndContext>
  );
}
