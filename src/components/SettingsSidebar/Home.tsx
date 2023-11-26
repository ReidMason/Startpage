import React from "react";

import {
  CloudIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Panel, SettingsSectionProps } from "./types";

const navigation = [
  { name: "General", icon: Cog6ToothIcon, panel: Panel.General },
  { name: "Appearance", icon: PaintBrushIcon, panel: Panel.General },
  { name: "Weather", icon: CloudIcon, panel: Panel.General },
  {
    name: "Providers",
    icon: DocumentMagnifyingGlassIcon,
    panel: Panel.General,
  },
];

export const Home = ({ setActivePanel }: SettingsSectionProps) => {
  return (
    <>
      <div className="flex-col pt-4 shrink-0 items-center">
        <h2 className="font-semibold text-white text-xl">Settings</h2>
      </div>
      <div className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <button
                className="text-gray-400 hover:text-white hover:bg-gray-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full"
                onClick={() => setActivePanel(item.panel)}
              >
                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
