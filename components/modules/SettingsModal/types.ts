import { UseFormRegister } from "react-hook-form";
import { Config } from "../../../services/config/types";

export interface SettingsSectionProps {
  register: UseFormRegister<Config>;
}
