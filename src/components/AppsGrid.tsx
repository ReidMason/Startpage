import React from "react";
import type { Config } from "@/services/config/schemas";

interface AppsGridProps {
  config: Config;
}

export default function AppsGrid({ config }: AppsGridProps) {
  return (
    <div>
      {config.apps.map((app) => (
        <div>{app.name}</div>
      ))}
    </div>
  );
}
