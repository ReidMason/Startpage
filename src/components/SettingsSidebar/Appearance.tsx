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
import { hexToHSL, hslToHex } from "@/utils/utils";
import { Button } from "../ui/button";
import { themeColours } from "../StyleHandler/Themes";

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<F>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => func(...args), waitFor);
  };
}

const debounceUpdate = debounce(
  (func: (...event: any[]) => void, ...args: any[]) => func(...args),
  1,
);

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

      <div>
        <FormField
          control={control}
          name="appearance.customTheme"
          render={({ field }) => (
            <div>
              <div className="flex items-center justify-between">
                <FormLabel>Custom theme colours</FormLabel>
                <FormField
                  control={control}
                  name="appearance.theme"
                  render={({ field: themeField }) => (
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        if (themeField.value === "custom") return;
                        field.onChange(themeColours[themeField.value]);
                      }}
                    >
                      Load into custom
                    </Button>
                  )}
                />
              </div>
              {Object.keys(field.value)
                .sort()
                .map((colourName) => (
                  <div
                    className="flex items-center justify-between gap-4"
                    key={colourName}
                  >
                    <FormLabel className="capitalize">{colourName}</FormLabel>
                    <input
                      className="w-full max-w-32 rounded-md border-0 bg-transparent p-0"
                      type="color"
                      value={hslToHex(
                        ...(field.value[colourName as keyof typeof field.value]
                          .split(" ")
                          .map((value) => parseInt(value)) as [
                            number,
                            number,
                            number,
                          ]),
                      )}
                      onChange={(e) =>
                        debounceUpdate(field.onChange, {
                          ...field.value,
                          [colourName]: hexToHSL(e.target.value),
                        })
                      }
                    />
                  </div>
                ))}
            </div>
          )}
        />
      </div>
    </SettingsPanelWrapper>
  );
}
