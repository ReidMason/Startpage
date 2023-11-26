import React from "react";
import { SettingsSectionProps } from "./types";
import SettingsPanelWrapper from "./SettingsPanelWrapper";

export const General = (props: SettingsSectionProps) => {
  return (
    <SettingsPanelWrapper {...props}>
      <div>
        <p className="text-white">Search placeholder</p>
        <input value={props.config.general.searchPlaceholder} />
      </div>
    </SettingsPanelWrapper>
  );
};
