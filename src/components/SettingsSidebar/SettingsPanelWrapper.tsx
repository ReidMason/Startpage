import React from "react";
import type { Page } from "./types";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";

interface SettingsPanelWrapperProps {
  children: React.ReactNode;
  setActivePage: (page: Page) => void;
  panel: {
    previousPage: Page;
    name: string;
  };
}

export default function SettingsPanelWrapper({
  children,
  setActivePage,
  panel,
}: SettingsPanelWrapperProps) {
  return (
    <>
      <div className="grid grid-cols-3 pt-4">
        <Button
          className="mb-4 mr-auto flex items-center text-accent"
          onClick={() => setActivePage(panel.previousPage)}
        >
          <ChevronLeftIcon className="-mx-2 h-8 w-8" />
          <span>Back</span>
        </Button>
        <h2 className="text-center text-xl font-semibold text-white">
          {panel.name}
        </h2>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </>
  );
}
