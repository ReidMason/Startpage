import type { Config } from "@/services/config/schemas";
import type { StateSetter } from "@/utils/common";
import type { Control, UseFormRegister } from "react-hook-form";

export enum Page {
  "Home",
  "General",
}

export type SettingsSection = (props: SettingsSectionProps) => JSX.Element;

export interface PageObject {
  name: string;
  page: Page;
  component: SettingsSection;
  previousPage: Page;
}

export interface SettingsSectionProps {
  setActivePage: (panel: Page) => void;
  page: PageObject;
  config: Config;
  setConfig: StateSetter<Config>;
  register: UseFormRegister<Config>;
  control: Control<Config>;
}
