import { RefObject, SVGProps } from "react";
import { Control, UseFormRegister } from "react-hook-form";
import { Config, PartialConfig } from "../../../backend/routers/config/schemas";

export interface SettingsSectionProps {
  register: UseFormRegister<Config>;
  control: Control<Config, any>;
  config: Config;
  saveConfig: (newConfig: PartialConfig) => Promise<void>;
}

export interface SettingsSection {
  name: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  iconBg: string;
  content: ({}: SettingsSectionProps) => JSX.Element;
  hasCustomLayout?: boolean;
  ref?: RefObject<HTMLDivElement>;
}
