import React from "react";
import { SettingsSectionProps } from "./types";
import SettingsPanelWrapper from "./SettingsPanelWrapper";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const searchOptions = [
  {
    id: 1,
    value: "https://www.google.com/search?q=",
    text: "Google",
  },
  {
    id: 2,
    value: "https://duckduckgo.com/?q=",
    text: "DuckDuckGo",
  },
  {
    id: 3,
    value: "https://search.brave.com/search?q=",
    text: "Brave",
  },
];

export const General = ({
  setActivePage,
  page,
  control,
  loading,
}: SettingsSectionProps) => {
  return (
    <SettingsPanelWrapper setActivePage={setActivePage} panel={page}>
      <FormField
        control={control}
        name="general.searchPlaceholder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Search placeholder</FormLabel>
            <FormControl>
              <Input
                placeholder="Search Placeholder"
                autoComplete="off"
                disabled={loading}
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="general.calendarUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Calendar url</FormLabel>
            <FormControl>
              <Input
                placeholder="Calendar url"
                autoComplete="off"
                disabled={loading}
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="general.searchUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Search provider</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a search provider" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {searchOptions.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </SettingsPanelWrapper>
  );
};
