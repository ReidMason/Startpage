import type { NextPage } from "next";
import SettingsButtons from "../components/SettingsButtons";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LazyMotion } from "framer-motion";
import { Extension } from "../components/extensions/types";
import Grid from "../components/grid/Grid";
import Greeting from "../components/modules/Greeting/Greeting";
import Searchbar from "../components/modules/Searchbar/Searchbar";
import AppsGrid from "../components/modules/AppsGrid/AppsGrid";
import { trpc } from "../utils/trpc";
import type { PartialConfig } from "../backend/routers/config/schemas";

const DynamicSettingsModal = dynamic(
  () => import("../components/modules/SettingsModal/SettingsModal")
);
const DynamicExtensionsDisplay = dynamic(
  () => import("../components/extensions/ExtensionsDisplay")
);

const loadFramerFeatures = () =>
  import("../../framer-features").then((res) => res.default);

const Home: NextPage = () => {
  const config = trpc.useQuery(["config.get"]);
  const configMutation = trpc.useMutation(["config.save"]);
  const weather = trpc.useQuery(
    [
      "weather.get",
      {
        location: config.data?.weather.location ?? "",
        apiKey: config.data?.weather.apiKey ?? "",
      },
    ],
    {
      enabled: !!config.data && config.data.weather.enabled,
    }
  );

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [appFilter, setAppFilter] = useState("");
  const [extensions, setExtensions] = useState<Array<Extension>>([]);

  useEffect(() => {
    if (!config.data) return;
    if (config.data.appearance.appearance === "system") {
      const useDarkmode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (useDarkmode) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } else if (config.data.appearance.appearance === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [config]);

  if (config.isLoading || !config.data) return <div>Loading...</div>;

  const saveConfig = async (newConfig: PartialConfig) => {
    await configMutation.mutateAsync(newConfig, {
      onSuccess: () => {
        config.refetch();
      },
    });
  };

  const test = () => {
    saveConfig({ version: (config.data.version += 1) });
  };

  return (
    <div
      className="h-full min-h-screen bg-cover bg-fixed pt-[5%]"
      style={{
        backgroundImage: config.data.appearance.backgroundEnabled
          ? `url("/static/background.png?v=${config.data.general.cacheKey}")`
          : undefined,
      }}
    >
      <LazyMotion features={loadFramerFeatures} strict>
        <Grid
          className={`container mx-auto gap-8 p-8 text-primary-300 transition dark:text-primary-100 sm:p-16 ${
            config.data.appearance.glassy &&
            "bg-primary-900/30 backdrop-blur-xl sm:rounded-2xl"
          }`}
        >
          <div className="col-span-full mb-4">
            <Searchbar config={config.data} setAppFilter={setAppFilter} />
          </div>
          <div className="col-span-full mb-2 md:mb-12">
            <Greeting
              appFilter={appFilter}
              config={config.data}
              weatherData={weather.data}
              editMode={editMode}
            />
          </div>
          <div
            className={`col-span-full ${
              extensions.length ? "sm:mb-12 md:mb-24" : ""
            }`}
          >
            <AppsGrid
              apps={config.data.apps}
              appNameFilter={appFilter}
              editMode={editMode}
            />
          </div>
          <div className="col-span-full">
            <DynamicExtensionsDisplay
              config={config.data}
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
          config={config.data}
          open={settingsModalOpen}
          setOpen={setSettingsModalOpen}
        />
      </LazyMotion>
    </div>
  );
};

export default Home;
