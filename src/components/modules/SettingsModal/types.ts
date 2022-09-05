import type { RefObject, SVGProps } from "react";
import type { Control, UseFormRegister } from "react-hook-form";
import type { ConfigSetter } from "../../../../types/common";
import type { Config } from "../../../backend/routers/config/schemas";
import { SettingsElementComponent } from "./settings sections/settings elements/types";

export interface SettingsSectionProps {
  register: UseFormRegister<Config>;
  control: Control<Config, any>;
  config: Config;
  saveConfig: ConfigSetter;
}

export interface SettingsSection {
  name: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  iconBg: string;
  hasCustomLayout?: boolean;
  ref?: RefObject<HTMLDivElement>;
  settingsElements: Array<SettingsElementComponent>;
}
