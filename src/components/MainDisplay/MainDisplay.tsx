"use client";

import { configSchema, type App, type Config } from "@/services/config/schemas";
import React, { useState } from "react";
import AppsGrid from "../Apps/AppsGrid";
import Searchbar from "../Searchbar/Searchbar";
import Greeting from "../Greeting/Greeting";
import EditableAppsGrid from "../Apps/EditableAppsGrid";
import { Button } from "@/components/ui/button";
import SettingsSidebar from "../SettingsSidebar/SettingsSidebar";
import AppEditor from "../AppEditor/AppEditor";
import {
  getBackgroundImage,
  saveBackgroundImage,
  saveConfig,
} from "@/services/config/config";
import { toast } from "sonner";
import StyleHandler from "../StyleHandler/StyleHandler";
import { ConfigSettings } from "../SettingsSidebar/types";
import { Toaster } from "@/components/ui/sonner";

interface MainDisplayProps {
  config: Config;
  backgroundImageUrl?: string;
}

export default function MainDisplay({
  config,
  backgroundImageUrl,
}: MainDisplayProps) {
  const [filter, setFilter] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mutableConfig, setMutableConfig] = useState(config);
  const [appToEdit, setAppToEdit] = useState<App | null>(null);
  const [imageUrl, setImageUrl] = useState(backgroundImageUrl);

  const saveApp = (app: App) => {
    const newApps = mutableConfig.apps.map((a) => (a.id === app.id ? app : a));
    saveApps(newApps);
  };

  const saveApps = (apps: App[]) => {
    const newConfig = { ...mutableConfig, apps };
    saveNewConfig(newConfig);
  };

  const saveSettings = async (settings: ConfigSettings) => {
    if (settings.appearance.newBackgroundImage) {
      const formData = new FormData();
      formData.append(
        "backgroundImage",
        settings.appearance.newBackgroundImage,
      );
      await saveBackgroundImage(formData);
      const newImageUrl = await getBackgroundImage();
      setImageUrl(newImageUrl);
    }

    // Remove any additional fields from the settings object
    const result = configSchema.safeParse(settings);
    if (!result.success) {
      toast.error("Failed to save settings");
      return;
    }

    saveNewConfig(result.data);
  };

  const saveNewConfig = async (config: Config) => {
    try {
      setMutableConfig(window.structuredClone(config));
      await saveConfig(config);
      toast.success("Config saved");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save config");
    }
  };

  return (
    <StyleHandler config={mutableConfig} imageUrl={imageUrl}>
      <Toaster />
      <SettingsSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        config={mutableConfig}
        setConfig={setMutableConfig}
        saveSettings={saveSettings}
      ></SettingsSidebar>
      <AppEditor
        open={!!appToEdit}
        setOpen={(value) => setAppToEdit(value ? appToEdit : null)}
        app={appToEdit}
        saveApp={saveApp}
      ></AppEditor>
      <div className="relative h-screen py-[5%]">
        <div
          className="container flex max-w-screen-2xl flex-col gap-8 rounded-2xl bg-card/[--transparency-level] p-8 text-card-foreground transition sm:p-16"
          style={{
            backdropFilter: `blur(${mutableConfig.appearance.glassy / 4}px)`,
          }}
        >
          <Searchbar config={mutableConfig} setAppFilter={setFilter} />
          <Greeting config={mutableConfig} />
          {editMode ? (
            <EditableAppsGrid
              apps={mutableConfig.apps}
              setAppToEdit={setAppToEdit}
              setApps={saveApps}
            />
          ) : (
            <AppsGrid config={mutableConfig} appFilter={filter} />
          )}
        </div>

        <div className="absolute bottom-0 left-0 flex gap-4 p-4">
          <Button variant="secondary" onClick={() => setSidebarOpen(true)}>
            Settings
          </Button>
          <Button variant="secondary" onClick={() => setEditMode(!editMode)}>
            {editMode ? "View mode" : "Edit mode"}
          </Button>
        </div>
      </div>
    </StyleHandler>
  );
}
