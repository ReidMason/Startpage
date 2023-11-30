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
    <div>
      <div className="grid grid-cols-3 pt-4">
        <button
          className="flex text-blue-600 items-center mr-auto mb-4"
          onClick={() => setActivePage(panel.previousPage)}
        >
          <ChevronLeftIcon className="w-8 h-8 -mx-2" />
          <span>Back</span>
        </button>
        <h2 className="font-semibold text-white text-xl text-center">
          {panel.name}
        </h2>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}
