import React from "react";
import Input from "../../../input/Input";
import Toggle from "../../../toggle/Toggle";
import { SettingsSectionProps } from "../../types";

export default function WeatherSettings({ register }: SettingsSectionProps) {
  return (
    <div className="mb-4 grid grid-cols-1">
      <Input placeholder="Api key" register={register("weather.apiKey")} />
      <Input placeholder="Location" register={register("weather.location")} />
      <div className="flex flex-col gap-2">
        <p>Detailed weather display</p>
        <Toggle defaultValue={false} setter={() => {}} />
      </div>
    </div>
  );
}
