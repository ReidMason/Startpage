import { Config } from "@/services/config/schemas";
import React from "react";

interface StyleHandlerProps {
  children: React.ReactNode;
  config: Config;
}

export default function StyleHandler({ config, children }: StyleHandlerProps) {
  // Styles can be overriden here
  const style = {
    "--transparency-level": config.appearance.opacity / 100,
  } as React.CSSProperties;

  return (
    <div
      className={`${config.appearance.glassy ? "glassy" : ""}`}
      style={style}
    >
      {children}
    </div>
  );
}
