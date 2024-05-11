import React from "react";
import { SettingsSectionProps } from "./types";
import SettingsPanelWrapper from "./SettingsPanelWrapper";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Switch } from "@/components/ui/switch";

export default function Weather({ ...props }: SettingsSectionProps) {
  return (
    <SettingsPanelWrapper {...props}>
      <FormField
        control={props.control}
        name="weather.enabled"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <FormLabel>Weather enabled</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={props.control}
        name="weather.detailed"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <FormLabel>Show detailed weather</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </SettingsPanelWrapper>
  );
}

// <SettingsGroup>
//   <Label text="Enabled" htmlFor="WeatherEnabled">
//     <Controller
//       name="weather.enabled"
//       control={props.control}
//       render={({ field: { ref, ...field } }) => (
//         <Toggle {...field} id="WeatherEnabled" />
//       )}
//     />
//   </Label>
// </SettingsGroup>
//
// <SettingsGroup>
//   <Label text="Detailed" htmlFor="WeatherDetailed">
//     <Controller
//       name="weather.detailed"
//       control={props.control}
//       render={({ field: { ref, ...field } }) => (
//         <Toggle {...field} id="WeatherDetailed" />
//       )}
//     />
//   </Label>
// </SettingsGroup>
