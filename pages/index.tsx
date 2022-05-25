import type { GetStaticProps, NextPage } from "next";
import { Config } from "../services/server/config/types";
import AppsGrid from "../components/modules/AppsGrid/AppsGrid";
import GreetingText from "../components/modules/GreetingText";
import { Weather } from "../services/server/weather/types";
import SettingsButton from "../components/SettingsButton";
import { useState } from "react";
import Button from "../components/button/Button";
import dynamic from "next/dynamic";
import { getConfig } from "../services/server/config/config";
import { LazyMotion } from "framer-motion";
import { getWeatherData } from "../services/server/weather/weather";
import WeatherDisplay from "../components/modules/WeatherDisplay";
import GlobalContext from "../contexts/GlobalContext/GlobalContext";

interface StartpageProps {
  configData: Config;
  weatherData: Weather;
}

const DynamicSettingsModal = dynamic(
  () => import("../components/modules/SettingsModal/SettingsModal")
);

const loadFeatures = () =>
  import("../framer-features").then((res) => res.default);

// TODO: Rewrite this properly using this guide https://felixgerschau.com/react-typescript-context/ the context and stuff should be in separate folders

const Home: NextPage<StartpageProps> = ({
  configData,
  weatherData,
}: StartpageProps) => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [config, setConfig] = useState(configData);

  return (
    <GlobalContext.Provider value={{ config, setConfig }}>
      <LazyMotion features={loadFeatures} strict>
        <div
          className={`h-screen transition ${settingsModalOpen ? "blur" : ""}`}
        >
          <div className="container mx-auto mb-8 pt-12 text-white lg:pt-28">
            <div className="mx-auto w-10/12 max-w-screen-xl px-4 md:w-11/12 lg:w-full">
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

              <AppsGrid
                apps={config.apps}
                appNameFilter={""}
                editMode={editMode}
              />
            </div>
            <DynamicSettingsModal
              config={config}
              open={settingsModalOpen}
              setOpen={setSettingsModalOpen}
            />
          </div>
          <div className="fixed bottom-0 left-40 m-4">
            <SettingsButton setSettingsModalOpen={setSettingsModalOpen} />
            <Button onClick={() => setEditMode((prev) => !prev)}>
              Enable {editMode ? "view" : "edit"} mode
            </Button>
          </div>
        </div>
      </LazyMotion>
    </GlobalContext.Provider>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const configData = await getConfig();
  const weatherData = await getWeatherData();

  return {
    props: {
      configData,
      weatherData,
    },
    revalidate: 3600,
  };
};
