import type { GetStaticProps, NextPage } from "next";
import { Config } from "../services/config/types";
import AppsGrid from "../components/modules/AppsGrid/AppsGrid";
import GreetingText from "../components/modules/GreetingText";
import { Weather } from "../services/weather/types";
import SettingsButton from "../components/SettingsButton";
import { useContext, useState } from "react";
import Button from "../components/button/Button";
import dynamic from "next/dynamic";
import { getConfig } from "../services/config/config";
import { LazyMotion } from "framer-motion";
import { getWeatherData } from "../services/weather/weather";
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

  const { config: c, setConfig: sc } = useContext(GlobalContext);

  return (
    <GlobalContext.Provider value={{ config, setConfig }}>
      {c && (
        <LazyMotion features={loadFeatures} strict>
          <div className={`transition ${settingsModalOpen ? "blur" : ""}`}>
            <div className="container mx-auto mb-8 h-screen pt-28 text-white">
              <div className="mx-auto w-10/12 max-w-screen-xl px-4 md:w-5/6 lg:w-full">
                <div className="mb-4 md:flex">
                  <GreetingText calendarUrl={c.general.calendarUrl} />
                  <div className="ml-auto">
                    {c.weather.enabled && weatherData && (
                      <WeatherDisplay
                        weatherData={weatherData}
                        detailed={c.weather.detailed}
                      />
                    )}
                  </div>
                </div>

                <AppsGrid
                  apps={c.apps}
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
      )}
    </GlobalContext.Provider>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const config = await getConfig();
  const weatherData = await getWeatherData();

  return {
    props: {
      config,
      weatherData,
    },
    revalidate: 3600,
  };
};
