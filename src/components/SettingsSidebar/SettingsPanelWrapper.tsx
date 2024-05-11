import React, { HTMLAttributes } from "react";
import { SettingsSectionProps } from "./types";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

interface SettingsPanelWrapperProps
  extends HTMLAttributes<HTMLDivElement>,
    SettingsSectionProps {}

export default function SettingsPanelWrapper({
  children,
  setActivePage,
  page: panel,
}: SettingsPanelWrapperProps) {
  return (
    <>
      <div className="grid grid-cols-3 pt-4">
        <button
          className="mb-4 mr-auto flex items-center text-accent"
          onClick={() => setActivePage(panel.previousPage)}
        >
          <ChevronLeftIcon className="-mx-2 h-8 w-8" />
          <span>Back</span>
        </button>
        <h2 className="text-center text-xl font-semibold text-white">
          {panel.name}
        </h2>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </>
  );
}
