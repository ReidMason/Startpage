import React from "react";
import { SettingsSectionProps } from "./types";
import SettingsPanelWrapper from "./SettingsPanelWrapper";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Switch } from "@/components/ui/switch";

export default function Weather({
  setActivePage,
  page,
  control,
  loading,
}: SettingsSectionProps) {
  return (
    <SettingsPanelWrapper setActivePage={setActivePage} panel={page}>
      <FormField
        control={control}
        name="weather.enabled"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <FormLabel>Weather enabled</FormLabel>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={loading}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="weather.detailed"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <FormLabel>Show detailed weather</FormLabel>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={loading}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </SettingsPanelWrapper>
  );
}
