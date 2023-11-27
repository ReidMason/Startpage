import React from "react";
import { SettingsSectionProps } from "./types";
import SettingsPanelWrapper from "./SettingsPanelWrapper";
import Input from "../Input/Input";

export const General = (props: SettingsSectionProps) => {
  return (
    <SettingsPanelWrapper {...props}>
      <div>
        <Input
          register={props.register("general.searchPlaceholder")}
          label="Search placeholder"
          name="SearchPlaceholder"
        />
      </div>
    </SettingsPanelWrapper>
  );
};
