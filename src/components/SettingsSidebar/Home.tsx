import React from "react";
import { Page, SettingsSectionProps } from "./types";
import { pages } from "./pages";

export const Home = ({ setActivePage }: SettingsSectionProps) => {
  const navigation = pages.filter((x) => x.page != Page.Home);

  return (
    <>
      <h2 className="font-semibold text-white py-4 text-xl">Settings</h2>
      <ul role="list" className="flex flex-1 flex-col gap-1">
        {navigation.map((item) => (
          <li key={item.name}>
            <button
              className="text-gray-400 hover:text-white hover:bg-gray-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full"
              onClick={() => setActivePage(item.page)}
            >
              {item.icon && (
                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
              )}
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};
