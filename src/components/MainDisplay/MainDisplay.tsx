"use client";

import { Config } from "@/services/config/schemas";
import React, { useState } from "react";
import AppsGrid from "../Apps/AppsGrid";
import Searchbar from "../Searchbar/Searchbar";
import Greeting from "../Greeting/Greeting";
import EditableAppsGrid from "../Apps/EditableAppsGrid";
import { Button } from "../Button/Button";
import SettingsSidebar from "../SettingsSidebar/SettingsSidebar";
import AppEditor from "../AppEditor/AppEditor";

interface MainDisplayProps {
  config: Config;
}

export default function MainDisplay({ config }: MainDisplayProps) {
  const [filter, setFilter] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appEditOpen, setAppEditOpen] = useState(false);
  const [mutableConfig, setMutableConfig] = useState(config);

  return (
    <SettingsSidebar
      open={sidebarOpen}
      setOpen={setSidebarOpen}
      config={mutableConfig}
      setConfig={setMutableConfig}
    >
      <AppEditor open={appEditOpen} setOpen={setAppEditOpen}>
        <div className="relative h-screen py-[5%]">
          <div className="text-primary-300 bg-primary-transparent-900 dark:text-primary-100 container mx-auto flex flex-col gap-8 p-8 transition glassy:backdrop-blur-xl sm:p-16 sm:glassy:rounded-2xl">
            <Searchbar config={mutableConfig} setAppFilter={setFilter} />
            <Greeting config={mutableConfig} />
            {editMode ? (
              <EditableAppsGrid
                config={mutableConfig}
                setEditOpen={setAppEditOpen}
              />
            ) : (
              <AppsGrid config={mutableConfig} appFilter={filter} />
            )}
          </div>

          <div className="absolute bottom-0 left-0 flex gap-4 p-4">
            <Button onClick={() => setSidebarOpen(true)}>Settings</Button>
            <Button onClick={() => setEditMode(!editMode)}>
              {editMode ? "View mode" : "Edit mode"}
            </Button>
          </div>
        </div>
      </AppEditor>
    </SettingsSidebar>
  );
}
