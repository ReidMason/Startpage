"use client";

import React, { useState } from "react";
import type { Config } from "@/services/config/schemas";
import App from "./App";
import { DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { SortableItem } from "../DragAndDrop/SortableItem";
import { PlusIcon } from "@heroicons/react/20/solid";
import { generateUuid } from "@/utils/utils";
import SortableWrapper from "../DragAndDrop/SortableWrapper";
import { DndWrapper } from "../DragAndDrop/DndWrapper";

interface AppsGridProps {
  config: Config;
  appFilter: string;
}

export default function AppsGrid({ config }: AppsGridProps) {
  const [apps, setApps] = useState(config.apps);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over == null) return;

    if (active.id !== over.id) {
      setApps((items) => {
        const oldIndex = items.findIndex((x) => x.id === active.id);
        const newIndex = items.findIndex((x) => x.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const createNewApp = () => {
    setApps((oldApps) => [
      ...oldApps,
      {
        id: generateUuid(),
        url: "",
        icon: "",
        name: "",
        enabled: true,
      },
    ]);
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 relative">
      <DndWrapper onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableWrapper items={apps}>
          {apps.map((app) => (
            <SortableItem id={app.id} key={app.id}>
              <App app={app} preview />
            </SortableItem>
          ))}
          <button
            className="rounded-lg border border-primary-400/80 flex items-center justify-center"
            onClick={createNewApp}
          >
            <PlusIcon className="w-12 h-12" />
          </button>
        </SortableWrapper>
      </DndWrapper>
    </div>
  );
}
