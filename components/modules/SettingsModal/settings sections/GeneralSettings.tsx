import React from "react";
import Input from "../../../input/Input";
import { SettingsSectionProps } from "../types";

export default function GeneralSettings({ register }: SettingsSectionProps) {
  return (
    <>
      <Input
        label="Search placeholder"
        placeholder="Search placeholder"
        register={register("general.searchPlaceholder")}
      />
      <Input
        label="Calendar Url"
        placeholder="Calendar url"
        register={register("general.calendarUrl")}
      />
      <Input
        label="Search url"
        placeholder="Search url"
        register={register("general.searchUrl")}
      />
      <Input
        label="Custom search url"
        placeholder="Custom search url"
        register={register("general.customSearchUrl")}
      />
    </>
  );
}
