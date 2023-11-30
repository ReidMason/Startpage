import React from "react";
import { SettingsSectionProps } from "./types";
import { Controller } from "react-hook-form";
import { Toggle } from "../Toggle/Toggle";
import SettingsPanelWrapper from "./SettingsPanelWrapper";
import Label from "../Label/Label";
import Input from "../Input/Input";
import SettingsGroup from "../Layouts/SettingsGroup";

export default function Weather({ ...props }: SettingsSectionProps) {
  return (
    <SettingsPanelWrapper {...props}>
      <SettingsGroup>
        <Label text="Weather enabled" htmlFor="WeatherEnabled">
          <Controller
            name="weather.enabled"
            control={props.control}
            render={({ field: { ref, ...field } }) => (
              <Toggle {...field} id="WeatherEnabled" />
            )}
          />
        </Label>

        <Label text="ApiKey" htmlFor="WeatherApiKey">
          <Input
            register={props.register("weather.apiKey")}
            id="WeatherApiKey"
            placeholder="Open weather api key"
          />
        </Label>
      </SettingsGroup>

      <SettingsGroup>
        <Label text="Location" htmlFor="WeatherLocation">
          <Input
            register={props.register("weather.location")}
            id="WeatherLocation"
            placeholder="Weather location"
          />
        </Label>

        <Label text="Detailed" htmlFor="WeatherDetailed">
          <Controller
            name="weather.detailed"
            control={props.control}
            render={({ field: { ref, ...field } }) => (
              <Toggle {...field} id="WeatherDetailed" />
            )}
          />
        </Label>
        <Label text="Show location" htmlFor="WeatherShowLocation">
          <Controller
            name="weather.showLocation"
            control={props.control}
            render={({ field: { ref, ...field } }) => (
              <Toggle {...field} id="WeatherShowLocation" />
            )}
          />
        </Label>
      </SettingsGroup>
    </SettingsPanelWrapper>
  );
}
