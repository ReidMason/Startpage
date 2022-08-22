import { RefObject, SVGProps } from "react";
import { Control, UseFormRegister } from "react-hook-form";
import { configSchema } from "../../../backend/routers/config/schemas";
import { StateSetter } from "../../../../types/common";

export interface SettingsSectionProps {
  register: UseFormRegister<Config>;
  control: Control<Config, any>;
  config: Config;
}

export interface SettingsSection {
  name: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  iconBg: string;
  content: ({}: SettingsSectionProps) => JSX.Element;
  heading?: ({}: SettingsSectionProps) => JSX.Element;
  customLayout?: boolean;
  ref?: RefObject<HTMLDivElement>;
}
