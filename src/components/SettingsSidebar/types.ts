import type { Config } from "@/services/config/schemas";
import type { Control } from "react-hook-form";
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
  control: Control<Config>;
  loading: boolean;
}
