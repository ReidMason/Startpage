import React from "react";
import { SettingsSectionProps } from "./types";
import SettingsPanelWrapper from "./SettingsPanelWrapper";
import Input from "../Input/Input";

export const General = (props: SettingsSectionProps) => {
  const handleChange = (newValue: string) => {
    const newConfig = structuredClone(props.config);
    newConfig.general.searchPlaceholder = newValue;
    props.setConfig(newConfig);
  };

  return (
    <SettingsPanelWrapper {...props}>
      <div>
        <Input
          label="Search placeholder"
          name="SearchPlaceholder"
          value={props.config.general.searchPlaceholder}
          setValue={handleChange}
        />
      </div>
    </SettingsPanelWrapper>
  );
};
