import { Config } from "@/services/config/schemas";

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
}
