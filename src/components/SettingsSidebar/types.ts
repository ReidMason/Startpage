import { Config } from "@/services/config/schemas";

export enum Panel {
  "Home",
  "General",
}

export type SettingsSection = (props: SettingsSectionProps) => JSX.Element;

export interface PanelObject {
  name: string;
  panel: Panel;
  component: SettingsSection;
  previousPanel: Panel;
}

export interface SettingsSectionProps {
  setActivePanel: (panel: Panel) => void;
  panel: PanelObject;
  config: Config;
}
