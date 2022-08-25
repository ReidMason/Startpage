import { useDroppable } from "@dnd-kit/core";
import { TrashIcon } from "@heroicons/react/solid";

export default function AppsBinDroppable() {
  const { isOver, setNodeRef } = useDroppable({
    id: "bin",
  });

  return (
    <div
      ref={setNodeRef}
      className={`z-10 flex h-12 w-64 items-center justify-center rounded-full border ${
        isOver ? "border-red-500/80" : "border-red-500/50"
      }`}
    >
      <TrashIcon
        className={`h-8 w-8 ${
          isOver ? "animate-bounce text-red-400/80" : "text-red-400/60"
        }`}
      />
    </div>
  );
}
