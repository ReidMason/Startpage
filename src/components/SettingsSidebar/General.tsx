import React from "react";
import { SettingsSectionProps } from "./types";
import SettingsPanelWrapper from "./SettingsPanelWrapper";
import Input from "../Input/Input";
import Label from "../Label/Label";

export const General = ({ ...props }: SettingsSectionProps) => {
  return (
    <SettingsPanelWrapper {...props}>
      <Label text="Search placeholder" htmlFor="SearchPlaceholder">
        <Input
          register={props.register("general.searchPlaceholder")}
          id="SearchPlaceholder"
        />
      </Label>
    </SettingsPanelWrapper>
  );
};
