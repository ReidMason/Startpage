import React from "react";
import { SettingsSectionProps } from "./types";
import SettingsPanelWrapper from "./SettingsPanelWrapper";
import Input from "../Input/Input";
import Label from "../Label/Label";
import SettingsGroup from "../Layouts/SettingsGroup";
import { Toggle } from "../Toggle/Toggle";
import { Controller } from "react-hook-form";

export const General = ({ ...props }: SettingsSectionProps) => {
  return (
    <SettingsPanelWrapper {...props}>
      <SettingsGroup>
        <Label text="Search placeholder" htmlFor="SearchPlaceholder">
          <Input
            register={props.register("general.searchPlaceholder")}
            id="SearchPlaceholder"
          />
        </Label>

        <Label text="Calendar url" htmlFor="CalendarUrl">
          <Input
            register={props.register("general.calendarUrl")}
            id="CalendarUrl"
          />
        </Label>
      </SettingsGroup>

      <SettingsGroup>
        <Label text="Custom Search" htmlFor="CustomSearchUrlEnabled">
          <Controller
            name="general.customSearchEnabled"
            control={props.control}
            render={({ field: { ref, ...field } }) => (
              <Toggle {...field} id="CustomSearchUrlEnabled" />
            )}
          />
        </Label>
        {!props.config.general.customSearchEnabled && (
          <Label text="Search URL" htmlFor="SearchUrl">
            <Input
              register={props.register("general.searchUrl")}
              id="SearchUrl"
            />
          </Label>
        )}
      </SettingsGroup>
    </SettingsPanelWrapper>
  );
};
