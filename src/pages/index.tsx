import type { NextPage } from "next";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Extension } from "../components/extensions/types";
import Greeting from "../components/modules/Greeting/Greeting";
import Searchbar from "../components/modules/Searchbar/Searchbar";
import AppsGrid from "../components/modules/AppsGrid/AppsGrid";
import type { PartialConfig } from "../backend/routers/config/schemas";
import useConfig from "../hooks/useConfig";
import MainLayout from "../components/layouts/MainLayout";
import { updateGlobalClasses } from "../../utils";
import SettingsFeatures from "../components/modules/SettingsFeatures/SettingsFeatures";

const DynamicExtensionsDisplay = dynamic(
  () => import("../components/extensions/ExtensionsDisplay")
);

const Home: NextPage = () => {
  const { config, configMutation } = useConfig(updateGlobalClasses);

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
      <div className="glasy:sm:rounded-2xl container mx-auto gap-8 p-8 text-primary-300 transition glassy:bg-primary-900/30 glassy:backdrop-blur-xl dark:text-primary-100 sm:p-16">
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
      </div>

      <SettingsFeatures
        {...{ editMode, setEditMode, extensions, setExtensions }}
      />
    </MainLayout>
  );
};

export default Home;
