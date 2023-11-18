"use client";

import React from "react";
import type { Config } from "@/services/config/schemas";
import App from "./App";

interface AppsGridProps {
  config: Config;
  appFilter: string;
}

export default function AppsGrid({ config, appFilter }: AppsGridProps) {
  const filteredApps = !!appFilter.trim()
    ? config.apps.filter((x) => {
        const filter = appFilter.toLowerCase().trim();
        return x.name.toLowerCase().trim().includes(filter);
      })
    : config.apps;

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {filteredApps.map((app) => (
        <App key={app.id} app={app} />
      ))}
    </div>
  );
}
