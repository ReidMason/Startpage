import {
  AdjustmentsIcon,
  CloudIcon,
  SearchIcon,
  PhotographIcon,
} from "@heroicons/react/solid";
import AppearanceSettings from "./settings sections/sections/AppearanceSettings";
import GeneralSettings from "./settings sections/sections/GeneralSettings";
import ProvidersSettings from "./settings sections/sections/ProvidersSettings";
import WeatherSettings from "./settings sections/sections/WeatherSettings";
import { SettingsSection } from "./types";

export const settingsSections: Array<SettingsSection> = [
  {
    name: "General",
    icon: AdjustmentsIcon,
    iconBg: "bg-violet-400",
    content: GeneralSettings,
  },
  {
    name: "Appearance",
    icon: PhotographIcon,
    iconBg: "bg-rose-600",
    content: AppearanceSettings,
  },
  {
    name: "Weather",
    icon: CloudIcon,
    iconBg: "bg-green-500",
    content: WeatherSettings,
  },
  {
    name: "Providers",
    icon: SearchIcon,
    iconBg: "bg-sky-400",
    content: ProvidersSettings,
    hasCustomLayout: true,
  },
];
