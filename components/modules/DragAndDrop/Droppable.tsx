import React from "react";
import { useDroppable } from "@dnd-kit/core";

export default function Droppable() {
  const { isOver, setNodeRef } = useDroppable({
    id: "bin",
  });

  return (
    <div ref={setNodeRef} className="h-12 w-64 border border-red-500">
      {isOver ? "DELETE IT >:)" : "Drag here to delete"}
    </div>
  );
}
