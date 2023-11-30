import React from "react";
import { SettingsSectionProps } from "./types";
import SettingsPanelWrapper from "./SettingsPanelWrapper";
import Input from "../Input/Input";
import Label from "../Label/Label";
import SettingsGroup from "../Layouts/SettingsGroup";

export const General = ({ ...props }: SettingsSectionProps) => {
  return (
    <SettingsPanelWrapper {...props}>
      <SettingsGroup>
        <Label text="Search placeholder" htmlFor="SearchPlaceholder">
          <Input
            register={props.register("general.searchPlaceholder")}
            id="SearchPlaceholder"
          />
        </Label>
      </SettingsGroup>
    </SettingsPanelWrapper>
  );
};
