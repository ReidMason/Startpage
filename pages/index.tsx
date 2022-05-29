import type { GetStaticProps, NextPage } from "next";
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
  const [darkmode, setDarkmode] = useState<boolean>(true);
  const [blurred, setBlurred] = useState<boolean>(false);

  useEffect(() => {
    // Darkmode check
    // setDarkmode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    if (config.general.appearance === "system") {
      const useDarkmode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (useDarkmode) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } else if (config.general.appearance === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkmode, config]);

  return (
    <GlobalContext.Provider
      value={{ config, setConfig, darkmode, setDarkmode, setBlurred }}
    >
      <div className={`h-screen ${blurred && "blur"}`}>
        <LazyMotion features={loadFeatures} strict>
          <Grid className="container mx-auto gap-8 px-8 pt-28 text-primary-300 dark:text-primary-100">
            <div className="col-span-full">
              <Searchbar config={config} setAppFilter={setAppFilter} />
            </div>
            <div className="col-span-full">
              <Greeting
                appFilter={appFilter}
                config={config}
                weatherData={weatherData}
                editMode={editMode}
              />
            </div>
            <div className="col-span-full sm:mb-12 md:mb-24">
              <AppsGrid
                apps={config.apps}
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
