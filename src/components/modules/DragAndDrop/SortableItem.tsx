import { useSortable } from "@dnd-kit/sortable";
import { ReactNode } from "react";

interface SortableItemProps {
  children: ReactNode;
  id: string;
}

export default function SortableItem({ children, id }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: id,
  });

  return (
    <div
      className={`cursor-grab active:cursor-grabbing ${
        isDragging && "invisible"
      }`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}
