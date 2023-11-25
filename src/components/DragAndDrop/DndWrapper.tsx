import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import type { Props as DndContextProps } from "@dnd-kit/core/dist/components/DndContext/DndContext";

interface DndWrapperProps extends DndContextProps { }

export const DndWrapper = ({ sensors, ...props }: DndWrapperProps) => {
  if (sensors === undefined) {
    sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    );
  }

  return (
    <DndContext {...props} sensors={sensors}>
      {props.children}
    </DndContext>
  );
};
