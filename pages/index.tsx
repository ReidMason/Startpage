import { Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import GreetingText from "../components/GreetingText";
import AppsGrid from "../components/modules/AppsGrid"
import SearchBar from "../components/modules/SearchBar";
import WeatherDisplay from "../components/WeatherDisplay";
import { Config } from "../interfaces/Config";
import Weather from "../interfaces/Weather";
import { Extension } from "../interfaces/Extension";
import SettingsButton from "../components/modules/SettingsButton";
import ExtensionsDisplay from "../components/modules/ExtensionsDisplay";
import { getHost } from "../utils";

interface StartpageProps {
  config: Config;
  weatherData: Weather;
}

export default function Startpage({ config, weatherData }: StartpageProps) {
  const [appsNameFilter, setAppsNameFilter] = useState("");
  const [extensions, setExtensions] = useState<Array<Extension>>([]);

  return (
    <Transition
      appear
      show
      as={Fragment}
      enter="transform transition duration-150"
      enterFrom="opacity-0 translate-y-6"
      enterTo="opacity-100 translate-y-0"
    >
      <div className="container mx-auto text-white pt-28 mb-8 duration-">
        <div className="w-10/12 max-w-screen-xl px-4 mx-auto md:w-5/6 lg:w-full">
          <div className="mb-10">
            <SearchBar
              providers={config.providers}
              customSearchEnabled={config.general.customSearchEnabled}
              customSearchUrl={config.general.customSearchUrl}
              searchUrl={config.general.searchUrl}
              placeholder={config.general.searchPlaceholder}
              setAppFilter={setAppsNameFilter} />
          </div>

          <div className="mb-4 md:flex">
            <GreetingText calendarUrl={config.general.calendarUrl} />
            <div className="ml-auto">
              {config.weather.enabled && weatherData &&
                <WeatherDisplay weatherData={weatherData} detailed={config.weather.detailed} />
              }
            </div>
          </div>

          <AppsGrid apps={config.apps} appNameFilter={appsNameFilter} />
          <ExtensionsDisplay extensions={extensions} setExtensions={setExtensions} />
        </div>

        <SettingsButton extensions={extensions} setExtensions={setExtensions} />
      </div>
    </Transition>
  )
}

export const getServerSideProps = async () => {
  const res = await fetch(`${getHost()}/api/config`);
  const config = await res.json();

  // Load weather data
  var weatherData = null;
  if (config.weather.enabled) {
    const weatherRes = await fetch(`${getHost()}/api/weather`)
    if (weatherRes.status === 200)
      weatherData = await weatherRes.json();
  }

  return {
    props: {
      config,
      weatherData
    }
  }
}