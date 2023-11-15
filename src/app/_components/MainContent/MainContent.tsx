"use client";

import React, { useState } from "react";
import AppsGrid from "../AppsGrid/AppsGrid";
import { Config } from "~/server/services/config/schemas";

interface MainContentProps {
  config: Config;
}

export const MainContent = ({ config }: MainContentProps) => {
  const [appFilter, setAppFilter] = useState("");

  return (
    <div className="container mx-auto mb-20 gap-8 p-8 text-primary-300 transition glassy:bg-primary-900/30 glassy:backdrop-blur-xl dark:text-primary-100 sm:p-16 sm:glassy:rounded-2xl">
      <AppsGrid config={config} appFilter={appFilter} />
    </div>
  );
};
