import React from "react";
import { SettingsSectionProps } from "./types";
import SettingsPanelWrapper from "./SettingsPanelWrapper";

export const General = (props: SettingsSectionProps) => {
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newConfig = structuredClone(props.config);
    newConfig.general.searchPlaceholder = e.currentTarget.value;
    props.setConfig(newConfig);
  };

  return (
    <SettingsPanelWrapper {...props}>
      <div>
        <p className="text-white">Search placeholder</p>
        <input
          value={props.config.general.searchPlaceholder}
          onChange={handleChange}
        />
      </div>
    </SettingsPanelWrapper>
  );
};
