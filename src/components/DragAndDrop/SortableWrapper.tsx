"use client";

import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Props as SortableContextProps } from "@dnd-kit/sortable/dist/components/SortableContext";

interface SortableWrapperProps extends SortableContextProps { }

export default function SortableWrapper(props: SortableWrapperProps) {
  return (
    <SortableContext {...props} strategy={rectSortingStrategy}>
      {props.children}
    </SortableContext>
  );
}
