import type { Config } from "@/services/config/schemas";
import type { StateSetter } from "@/utils/common";
import type { Control, UseFormRegister } from "react-hook-form";
import { PageObject } from "./pages";

export enum Page {
  "Home",
  "General",
  "Weather",
  "Appearance",
  "Providers",
}

export type SettingsSection = (props: SettingsSectionProps) => JSX.Element;

export interface SettingsSectionProps {
  setActivePage: (panel: Page) => void;
  page: PageObject;
  config: Config;
  setConfig: StateSetter<Config>;
  register: UseFormRegister<Config>;
  control: Control<Config>;
}
