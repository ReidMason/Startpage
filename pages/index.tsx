import type { GetStaticProps, NextPage } from "next";
import { Config } from "../services/config/types";
import AppsGrid from "../components/modules/AppsGrid/AppsGrid";
import { getHost } from "../utils";
import GreetingText from "../components/modules/GreetingText";
import WeatherDisplay from "../components/modules/WeatherDisplay";
import { Weather } from "../services/weather/types";
import SettingsButton from "../components/SettingsButton";
import { useEffect, useState } from "react";
import SettingsModal from "../components/modules/SettingsModal/SettingsModal";
import Button from "../components/button/Button";

interface StartpageProps {
  config: Config;
  weatherData: Weather;
}

const Home: NextPage<StartpageProps> = ({
  config,
  weatherData,
}: StartpageProps) => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Darkmode check
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className={`transition ${settingsModalOpen ? "blur" : ""}`}>
      <div className="container mx-auto mb-8 h-screen pt-28 text-white">
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

          <AppsGrid apps={config.apps} appNameFilter={""} editMode={editMode} />
        </div>
        <SettingsModal
          config={config}
          open={settingsModalOpen}
          setOpen={setSettingsModalOpen}
        />
      </div>
      <div className="fixed bottom-0 left-40 m-4">
        <SettingsButton setSettingsModalOpen={setSettingsModalOpen} />
        <Button onClick={() => setEditMode((prev) => !prev)}>Edit mode</Button>
      </div>
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
