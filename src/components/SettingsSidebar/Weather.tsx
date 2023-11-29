import React from "react";
import { SettingsSectionProps } from "./types";
import { Controller } from "react-hook-form";
import { Toggle } from "../Toggle/Toggle";
import SettingsPanelWrapper from "./SettingsPanelWrapper";
import Label from "../Label/Label";

export default function Weather({ ...props }: SettingsSectionProps) {
  return (
    <SettingsPanelWrapper {...props}>
      <Label text="Weather enabled" htmlFor="WeatherEnabled">
        <Controller
          name="weather.enabled"
          control={props.control}
          render={({ field: { ref, ...field } }) => (
            <Toggle {...field} id="WeatherEnabled" />
          )}
        ></Controller>
      </Label>
    </SettingsPanelWrapper>
  );
}
