import { AdjustmentsIcon, CloudIcon, SearchIcon } from "@heroicons/react/solid";
import GeneralSettings from "./settings sections/bodies/GeneralSettings";
import ProvidersSettings from "./settings sections/bodies/ProvidersSettings";
import WeatherSettings from "./settings sections/bodies/WeatherSettings";
import WeatherHeading from "./settings sections/headers/WeatherHeading";
import { SettingsSection } from "./types";

export const settingsSections: Array<SettingsSection> = [
  {
    name: "General",
    icon: AdjustmentsIcon,
    iconBg: "bg-violet-400",
    content: GeneralSettings,
  },
  {
    name: "Weather",
    icon: CloudIcon,
    iconBg: "bg-green-500",
    content: WeatherSettings,
    heading: WeatherHeading,
  },
  {
    name: "Providers",
    icon: SearchIcon,
    iconBg: "bg-sky-400",
    content: ProvidersSettings,
    customLayout: true,
  },
];
