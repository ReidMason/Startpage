import React from "react";
import { SettingsSectionProps } from "./types";
import SettingsPanelWrapper from "./SettingsPanelWrapper";
import Input from "../Input/Input";
import { Toggle } from "../Toggle/Toggle";
import { Controller } from "react-hook-form";

export const General = ({ ...props }: SettingsSectionProps) => {
  return (
    <SettingsPanelWrapper {...props}>
      <div>
        <Input
          register={props.register("general.searchPlaceholder")}
          label="Search placeholder"
          name="SearchPlaceholder"
        />
        <Controller
          name="weather.enabled"
          control={props.control}
          render={({ field: { ref, ...field } }) => <Toggle {...field} />}
        ></Controller>
      </div>
    </SettingsPanelWrapper>
  );
};
