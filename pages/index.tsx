import type { GetServerSideProps, NextPage } from "next";
import { Config } from "../services/server/config/types";
import { Weather } from "../services/server/weather/types";
import SettingsButtons from "../components/SettingsButtons";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getConfig } from "../services/server/config/config";
import { LazyMotion } from "framer-motion";
import { getWeatherData } from "../services/server/weather/weather";
import GlobalContext from "../contexts/GlobalContext/GlobalContext";
import { Extension } from "../components/extensions/types";
import Grid from "../components/grid/Grid";
import Greeting from "../components/modules/Greeting/Greeting";
import Searchbar from "../components/modules/Searchbar/Searchbar";
import AppsGrid from "../components/modules/AppsGrid/AppsGrid";
import { RecursivePartial } from "../common";

interface StartpageProps {
  configData: Config;
  weatherData: Weather;
}

const DynamicSettingsModal = dynamic(
  () => import("../components/modules/SettingsModal/SettingsModal")
);
const DynamicExtensionsDisplay = dynamic(
  () => import("../components/extensions/ExtensionsDisplay")
);

const loadFeatures = () =>
  import("../framer-features").then((res) => res.default);

const Home: NextPage<StartpageProps> = ({
  configData,
  weatherData,
}: StartpageProps) => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [config, setConfig] = useState(configData);
  const [editMode, setEditMode] = useState(false);
  const [appFilter, setAppFilter] = useState("");
  const [extensions, setExtensions] = useState<Array<Extension>>([]);

  const updateConfig = (newConfig: RecursivePartial<Config>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(JSON.parse(JSON.stringify(updatedConfig)));
  };

  const updateCacheKey = () => {
    const newConfig: RecursivePartial<Config> = {
      general: { cacheKey: Math.random() },
    };
    updateConfig(newConfig);
  };

  useEffect(() => {
    if (config.appearance.appearance === "system") {
      const useDarkmode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (useDarkmode) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } else if (config.appearance.appearance === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [config]);

  return (
    <GlobalContext.Provider value={{ config, updateConfig, updateCacheKey }}>
      <div
        className="h-full min-h-screen bg-cover bg-fixed pt-[5%]"
        style={{
          backgroundImage: config.appearance.backgroundEnabled
            ? `url("/static/background.png?v=${config.general.cacheKey}")`
            : undefined,
        }}
      >
        <LazyMotion features={loadFeatures} strict>
          <Grid
            className={`container mx-auto gap-8 p-8 text-primary-300 transition dark:text-primary-100 sm:p-16 ${
              config.appearance.glassy &&
              "bg-primary-900/30 backdrop-blur-xl sm:rounded-2xl"
            }`}
          >
            <div className="col-span-full mb-4">
              <Searchbar config={config} setAppFilter={setAppFilter} />
            </div>
            <div className="col-span-full mb-2 md:mb-12">
              <Greeting
                appFilter={appFilter}
                config={config}
                weatherData={weatherData}
                editMode={editMode}
              />
            </div>
            <div
              className={`col-span-full ${
                extensions.length ? "sm:mb-12 md:mb-24" : ""
              }`}
            >
              <AppsGrid
                apps={config.apps}
                appNameFilter={appFilter}
                editMode={editMode}
              />
            </div>
            <div className="col-span-full">
              <DynamicExtensionsDisplay
                config={config}
                extensions={extensions}
                setExtensions={setExtensions}
              />
            </div>
          </Grid>

          <SettingsButtons
            setSettingsModalOpen={setSettingsModalOpen}
            editMode={editMode}
            setEditMode={setEditMode}
            extensions={extensions}
            setExtensions={setExtensions}
          />

          <DynamicSettingsModal
            config={config}
            open={settingsModalOpen}
            setOpen={setSettingsModalOpen}
          />
        </LazyMotion>
      </div>
    </GlobalContext.Provider>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const configData = await getConfig();
  const weatherData = await getWeatherData(configData.weather);

  return {
    props: {
      configData,
      weatherData,
    },
  };
};
