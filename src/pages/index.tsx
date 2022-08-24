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
import type { Config, PartialConfig } from "../backend/routers/config/schemas";
import useConfig from "../hooks/useConfig";
import MainLayout from "../components/layouts/MainLayout";

const DynamicSettingsModal = dynamic(
  () => import("../components/modules/SettingsModal/SettingsModal")
);
const DynamicExtensionsDisplay = dynamic(
  () => import("../components/extensions/ExtensionsDisplay")
);

const loadFramerFeatures = () =>
  import("../../framer-features").then((res) => res.default);

const setDarkTheme = (config: Config) => {
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
};

const Home: NextPage = () => {
  const { config, configMutation } = useConfig(setDarkTheme);

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [appFilter, setAppFilter] = useState("");
  const [extensions, setExtensions] = useState<Array<Extension>>([]);

  const saveConfig = async (newConfig: PartialConfig) => {
    await configMutation.mutateAsync(newConfig, {
      onSuccess: () => {
        config.refetch();
      },
    });
  };

  return (
    <MainLayout>
      <LazyMotion features={loadFramerFeatures} strict>
        <Grid
          className={`container mx-auto gap-8 p-8 text-primary-300 transition dark:text-primary-100 sm:p-16 ${
            config.data?.appearance.glassy &&
            "bg-primary-900/30 backdrop-blur-xl sm:rounded-2xl"
          }`}
        >
          <div className="col-span-full mb-4">
            <Searchbar setAppFilter={setAppFilter} />
          </div>
          <div className="col-span-full mb-2 md:mb-12">
            <Greeting />
          </div>

          <div
            className={`col-span-full ${
              extensions.length ? "sm:mb-12 md:mb-24" : ""
            }`}
          >
            <AppsGrid appNameFilter={appFilter} editMode={editMode} />
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
          open={settingsModalOpen}
          setOpen={setSettingsModalOpen}
        />
      </LazyMotion>
    </MainLayout>
  );
};

export default Home;
