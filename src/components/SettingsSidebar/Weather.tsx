import React from "react";
import { SettingsSectionProps } from "./types";
import { Controller } from "react-hook-form";
import { Toggle } from "../Toggle/Toggle";
import SettingsPanelWrapper from "./SettingsPanelWrapper";

export default function Weather({ ...props }: SettingsSectionProps) {
  return (
    <SettingsPanelWrapper {...props}>
      <Controller
        name="weather.enabled"
        control={props.control}
        render={({ field: { ref, ...field } }) => <Toggle {...field} />}
      ></Controller>
    </SettingsPanelWrapper>
  );
}
