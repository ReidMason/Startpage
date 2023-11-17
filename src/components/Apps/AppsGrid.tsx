import React from "react";
import type { Config } from "@/services/config/schemas";
import App from "./App";

interface AppsGridProps {
  config: Config;
}

export default function AppsGrid({ config }: AppsGridProps) {
  return (
    <div>
      {config.apps.map((app) => (
        <App key={app.id} app={app} />
      ))}
    </div>
  );
}
