import { Control, UseFormRegister } from "react-hook-form";
import { Config } from "../../../services/server/config/types";

export interface SettingsSectionProps {
  register: UseFormRegister<Config>;
  control: Control<Config, any>;
}
