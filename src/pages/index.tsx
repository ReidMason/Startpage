import type { NextPage } from "next";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Extension } from "../components/extensions/types";
import Greeting from "../components/modules/Greeting/Greeting";
import Searchbar from "../components/modules/Searchbar/Searchbar";
import AppsGrid from "../components/modules/AppsGrid/AppsGrid";
import type { Config } from "../backend/routers/config/schemas";
import MainLayout from "../components/layouts/MainLayout";
import SettingsFeatures from "../components/modules/SettingsFeatures/SettingsFeatures";
import { getConfig } from "../backend/routers/config/config";
import { Weather } from "../backend/routers/weather/schemas";
import { getWeatherData } from "../backend/routers/weather/weather";
import { completeConfig, updateGlobalClasses } from "../../utils";
import { trpc } from "../utils/trpc";
import useConfig from "../hooks/useConfig";
import { ConfigSetter } from "../../types/common";

const DynamicExtensionsDisplay = dynamic(
  () => import("../components/extensions/ExtensionsDisplay")
);

interface HomePageProps {
  config: Config;
  weather: Weather;
}

const Home: NextPage<HomePageProps> = ({
  config: configData,
  weather,
}: HomePageProps) => {
  const [config, setConfig] = useState(configData);
  const [editMode, setEditMode] = useState(false);
  const [appFilter, setAppFilter] = useState("");
  const [extensions, setExtensions] = useState<Array<Extension>>([]);
  const trpcUtils = trpc.useContext();
  const { configMutation } = useConfig();

  const updateConfig: ConfigSetter = async (
    newConfig,
    save = true,
    updateCachKey = false
  ) => {
    if (save) {
      await configMutation.mutateAsync(newConfig, {
        onSuccess: (data) => {
          trpcUtils.invalidateQueries(["config.get"]);
          setConfig(data);
          updateGlobalClasses(data);
        },
      });
    } else {
      const fullConfig = completeConfig(config, newConfig, updateCachKey);
      setConfig(fullConfig);
      updateGlobalClasses(fullConfig);
    }
  };

  return (
    <MainLayout config={config}>
      <div className="container mx-auto gap-8 p-8 text-primary-300 transition glassy:bg-primary-900/30 glassy:backdrop-blur-xl dark:text-primary-100 sm:p-16 sm:glassy:rounded-2xl">
        <div className="col-span-full mb-4">
          <Searchbar setAppFilter={setAppFilter} config={config} />
        </div>
        <div className="col-span-full mb-2 md:mb-12">
          <Greeting weather={weather} config={config} />
        </div>

        <div
          className={`col-span-full ${
            extensions.length ? "sm:mb-12 md:mb-24" : ""
          }`}
        >
          <AppsGrid
            config={config}
            appNameFilter={appFilter}
            editMode={editMode}
          />
        </div>

        <div className="col-span-full">
          <DynamicExtensionsDisplay
            extensions={extensions}
            setExtensions={setExtensions}
          />
        </div>
      </div>

      <SettingsFeatures
        {...{
          editMode,
          setEditMode,
          extensions,
          setExtensions,
          config,
          setConfig: updateConfig,
        }}
      />
    </MainLayout>
  );
};

export async function getStaticProps() {
  const config = await getConfig();
  const weather = await getWeatherData(
    config.weather.location,
    config.weather.apiKey
  );

  return {
    props: {
      config,
      weather,
    },
  };
}

export default Home;
