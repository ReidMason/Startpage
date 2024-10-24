import { appearanceSchema, configSchema } from "@/services/config/schemas";
import type { Control, UseFormRegister } from "react-hook-form";
import { PageObject } from "./pages";
import { z } from "zod";

export enum Page {
  "Home",
  "General",
  "Weather",
  "Appearance",
  "Providers",
}

export type SettingsSection = (props: SettingsSectionProps) => JSX.Element;
export type ConfigSettings = z.infer<typeof configSettingsSchema>;

export interface SettingsSectionProps {
  setActivePage: (panel: Page) => void;
  page: PageObject;
  control: Control<ConfigSettings>;
  loading: boolean;
  register: UseFormRegister<ConfigSettings>;
}

export const configSettingsSchema = configSchema.extend({
  appearance: appearanceSchema.extend({
    newBackgroundImage: z.instanceof(File).optional(),
  }),
});
