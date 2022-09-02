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
  binHovered: boolean;
  setBinHovered: StateSetter<boolean>;
  modifiedApps: Array<App>;
  setModifiedApps: (newApps: Array<App>) => void;
  tempApps: Array<App>;
  setTempApps: StateSetter<Array<App>>;
}

export default function EditableAppsGridDndContext({
  children,
  setActiveApp,
  tempApps,
  setTempApps,
  modifiedApps,
  setModifiedApps,
  binHovered,
  setBinHovered,
}: EditableAppsGridDndContextProps) {
  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveApp(null);
    // Didn't drag over anything so put the item back where it was
    if (!over) {
      ensureAppEnabled(active.id);
      setTempApps(modifiedApps);
      return;
    }
    // App was dragged over the bin so delete it
    if (over.id === "bin") {
      const newApps = tempApps.filter((x) => x.id != active.id);
      setTempApps(newApps);
      setModifiedApps(newApps);
      return;
    }
    setModifiedApps(tempApps);
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveApp(tempApps.find((x) => x.id == active.id) || null);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    updateActiveElementState(active, over);
    updateHoveredBinState(over?.id);
    repositionElements(active, over);
  };

  const updateActiveElementState = (active: Active, over: Over | null) => {
    // Item is dragged outside of droppable area so we want to hide it from the list
    if (over === null)
      setTempApps((prev) =>
        prev!.map((x) => (x.id === active.id ? { ...x, enabled: false } : x))
      );
    // Item is back within droppable area so make sure it's active
    else if (over.id !== "bin") ensureAppEnabled(active.id);
  };

  const updateHoveredBinState = (overId: string | undefined) => {
    if (!binHovered && overId === "bin") setBinHovered(true);
    else if (binHovered) setBinHovered(false);
  };

  const repositionElements = (active: Active, over: Over | null) => {
    if (over && over.id !== "bin") {
      setTempApps((apps) => {
        const oldIndex = apps!.map((x) => x.id).indexOf(active.id);
        const newIndex = apps!.map((x) => x.id).indexOf(over.id);

        return arrayMove(apps!, oldIndex, newIndex);
      });
    }
  };

  const ensureAppEnabled = (appId: string) => {
    setTempApps((prev) =>
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
