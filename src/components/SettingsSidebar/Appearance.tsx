import React from "react";
import { SettingsSectionProps } from "./types";
import SettingsPanelWrapper from "./SettingsPanelWrapper";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { themes } from "@/services/config/schemas";

export default function Appearance({
  setActivePage,
  page,
  control,
  loading,
}: SettingsSectionProps) {
  return (
    <SettingsPanelWrapper setActivePage={setActivePage} panel={page}>
      <FormField
        control={control}
        name="appearance.backgroundImageEnabled"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <FormLabel>Enable background image</FormLabel>
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
        name="appearance.newBackgroundImage"
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Background image</FormLabel>
            <FormControl>
              <Input
                {...fieldProps}
                onChange={(event) => {
                  onChange(event.target.files && event.target.files[0]);
                }}
                placeholder="Background image URL"
                type="file"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="appearance.backgroundBlur"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Background blur</FormLabel>
            <FormControl>
              <div className="flex gap-4">
                <span className="w-12">{field.value}%</span>
                <Slider
                  max={100}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="appearance.glassy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Glassy</FormLabel>
            <FormControl>
              <div className="flex gap-4">
                <span className="w-12">{field.value}%</span>
                <Slider
                  max={100}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="appearance.opacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Opacity</FormLabel>
            <FormControl>
              <div className="flex gap-4">
                <span className="w-12">{field.value}%</span>
                <Slider
                  max={100}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="appearance.theme"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Theme</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={loading}
            >
              <FormControl>
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Select a search provider" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem className="capitalize" key={theme} value={theme}>
                    {theme}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </SettingsPanelWrapper>
  );
}
