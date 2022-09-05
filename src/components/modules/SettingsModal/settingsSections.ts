import {
  AdjustmentsIcon,
  CloudIcon,
  SearchIcon,
  PhotographIcon,
} from "@heroicons/react/solid";
import CalendarUrl from "./settings sections/settings elements/General/CalendarUrl";
import { SettingsSection } from "./types";
import BackgroundImage from "./settings sections/settings elements/Appearance/BackgroundImage";
import WeatherDisplay from "./settings sections/settings elements/weather/WeatherDisplay";
import WeatherApiKey from "./settings sections/settings elements/weather/WeatherApiKey";
import WeatherLocation from "./settings sections/settings elements/weather/WeatherLocation";
import DetailedWeatherDisplay from "./settings sections/settings elements/weather/DetailedWeatherDisplay";
import SearchPlaceholder from "./settings sections/settings elements/General/SearchPlaceholder";
import SearchUrl from "./settings sections/settings elements/General/SearchUrl";
import CustomSearch from "./settings sections/settings elements/General/CustomSearch";
import Theme from "./settings sections/settings elements/Appearance/Theme";
import Transparency from "./settings sections/settings elements/Appearance/Transparency";
import BackgroundImageUpload from "./settings sections/settings elements/Appearance/BackgroundImageUpload";
import BackgroundBlur from "./settings sections/settings elements/Appearance/BackgroundBlur";

export const settingsSections: Array<SettingsSection> = [
  {
    name: "General",
    icon: AdjustmentsIcon,
    iconBg: "bg-violet-400",
    settingsElements: [SearchPlaceholder, CalendarUrl, SearchUrl, CustomSearch],
  },
  {
    name: "Appearance",
    icon: PhotographIcon,
    iconBg: "bg-rose-600",
    settingsElements: [
      Theme,
      Transparency,
      BackgroundImage,
      BackgroundImageUpload,
      BackgroundBlur,
    ],
  },
  {
    name: "Weather",
    icon: CloudIcon,
    iconBg: "bg-green-500",
    settingsElements: [
      WeatherDisplay,
      WeatherApiKey,
      WeatherLocation,
      DetailedWeatherDisplay,
    ],
  },
  // {
  //   name: "Providers",
  //   icon: SearchIcon,
  //   iconBg: "bg-sky-400",
  //   content: ProvidersSettings,
  //   hasCustomLayout: true,
  // },
];
