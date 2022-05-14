import type { GetStaticProps, NextPage } from "next";
import { Config } from "../services/config/types";
import AppsGrid from "../components/modules/AppsGrid";
import { getHost } from "../utils";
import GreetingText from "../components/modules/GreetingText";
import WeatherDisplay from "../components/modules/WeatherDisplay";
import { Weather } from "../services/weather/types";
import SettingsButton from "../components/SettingsButton";
import { useState } from "react";
import Modal from "../components/modal/Modal";
import SettingsModal from "../components/modules/SettingsModal/SettingsModal";

interface StartpageProps {
  config: Config;
  weatherData: Weather;
}

const Home: NextPage<StartpageProps> = ({
  config,
  weatherData,
}: StartpageProps) => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  return (
    <div
      className={`container mx-auto mb-8 pt-28 text-white ${
        settingsModalOpen && "blur"
      }`}
    >
      <div className="mx-auto w-10/12 max-w-screen-xl px-4 md:w-5/6 lg:w-full">
        <div className="mb-4 md:flex">
          <GreetingText calendarUrl={config.general.calendarUrl} />
          <div className="ml-auto">
            {config.weather.enabled && weatherData && (
              <WeatherDisplay
                weatherData={weatherData}
                detailed={config.weather.detailed}
              />
            )}
          </div>
        </div>

        <AppsGrid apps={config.apps} appNameFilter={""} />
      </div>
      <SettingsModal
        config={config}
        open={settingsModalOpen}
        setOpen={setSettingsModalOpen}
      />
      <SettingsButton setSettingsModalOpen={setSettingsModalOpen} />
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${getHost()}/api/config`);
  const config = await res.json();

  // Load weather data
  var weatherData = null;
  if (config.weather.enabled) {
    const weatherRes = await fetch(`${getHost()}/api/weather`);
    if (weatherRes.status === 200) weatherData = await weatherRes.json();
  }

  return {
    props: {
      config,
      weatherData,
    },
  };
};
