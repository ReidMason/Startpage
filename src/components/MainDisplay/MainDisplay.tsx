"use client";

import type { App, Config } from "@/services/config/schemas";
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
  const [mutableConfig, setMutableConfig] = useState(config);
  const [appToEdit, setAppToEdit] = useState<App | null>(null);

  return (
    <SettingsSidebar
      open={sidebarOpen}
      setOpen={setSidebarOpen}
      config={mutableConfig}
      setConfig={setMutableConfig}
    >
      <AppEditor
        open={!!appToEdit}
        setOpen={(value) => setAppToEdit(value ? appToEdit : null)}
        app={appToEdit}
      >
        <div className="relative h-screen py-[5%]">
          <div className="container mx-auto flex flex-col gap-8 bg-primary p-8 transition glassy:backdrop-blur-xl sm:p-16 sm:glassy:rounded-2xl">
            <Searchbar config={mutableConfig} setAppFilter={setFilter} />
            <Greeting config={mutableConfig} />
            {editMode ? (
              <EditableAppsGrid
                config={mutableConfig}
                setAppToEdit={setAppToEdit}
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
