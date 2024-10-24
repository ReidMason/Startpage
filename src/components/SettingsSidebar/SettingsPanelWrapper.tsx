import React from "react";
import type { Page } from "./types";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

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
      <SheetHeader className="grid grid-cols-3">
        <Button
          className="mb-4 mr-auto flex items-center text-accent"
          onClick={() => setActivePage(panel.previousPage)}
          type="button"
          variant="link"
        >
          <ChevronLeftIcon className="-mx-1 h-6 w-6" />
          <span>Back</span>
        </Button>

        <SheetTitle className="text-center text-xl font-semibold text-white">
          {panel.name}
        </SheetTitle>
      </SheetHeader>
      <div className="flex flex-col gap-5">{children}</div>
    </>
  );
}
