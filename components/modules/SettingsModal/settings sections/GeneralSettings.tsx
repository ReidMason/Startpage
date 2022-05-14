import React from "react";
import Input from "../../../input/Input";
import { SettingsSectionProps } from "../../types";

export default function GeneralSettings({ register }: SettingsSectionProps) {
  return (
    <div className="grid grid-cols-1">
      <Input
        placeholder="Search placeholder"
        register={register("general.searchPlaceholder")}
      />
      <Input
        placeholder="Calendar url"
        register={register("general.calendarUrl")}
      />
      <Input
        placeholder="Search url"
        register={register("general.searchUrl")}
      />
      <Input
        placeholder="Custom search url"
        register={register("general.customSearchUrl")}
      />
    </div>
  );
}
