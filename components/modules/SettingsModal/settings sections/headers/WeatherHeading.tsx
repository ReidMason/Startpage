import React from "react";
import { Controller } from "react-hook-form";
import Toggle from "../../../../toggle/Toggle";
import { SettingsSectionProps } from "../../types";

export default function WeatherHeading({ control }: SettingsSectionProps) {
  return (
    <Controller
      control={control}
      name="weather.enabled"
      render={({ field: { ref, ...field } }) => (
        <Toggle {...field} noHelperText />
      )}
    />
  );
}
