import React from "react";
import { Controller } from "react-hook-form";
import Switch from "../../../../switch/Switch";
import { SettingsSectionProps } from "../../types";

export default function WeatherHeading({ control }: SettingsSectionProps) {
  return (
    <Controller
      control={control}
      name="weather.enabled"
      render={({ field: { ref, ...field } }) => (
        <Switch {...field} noHelperText />
      )}
    />
  );
}
