import React from "react";
import { Config } from "~/server/services/config/schemas";

interface StyleControllerProps {
  children: React.ReactNode;
  config: Config;
}

export const StyleController = ({ children, config }: StyleControllerProps) => {
  // Styles can be overriden here
  const style = {
    "--transparency-level": config.appearance.opacity / 100,
  } as React.CSSProperties;

  return (
    <div
      className={`bg-slate-800 ${config.appearance.glassy ? "glassy" : ""}`}
      style={style}
    >
      {children}
    </div>
  );
};
