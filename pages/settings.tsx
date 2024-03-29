import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import GeneralSettings from "../components/modules/settings/General/GeneralSettings";
import AppSettings from "../components/modules/settings/Apps/AppSettings";
import ProviderSettings from "../components/modules/settings/Providers/ProviderSettings";
import WeatherSettings from "../components/modules/settings/Weather/WeatherSettings";
import ConfirmationModal from "../components/ConfirmationModal";
import { Config } from "../interfaces/Config";
import { useRouter } from "next/router";
import { getHost } from "../utils";

export interface SettingsSectionProps {
  config: Config;
  saveNewConfig: Function;
  modifiedConfig: Config;
  setModifiedConfig: Function;
}

interface settingsSection {
  name: string;
  settingsPages: Array<SettingsPage>;
}

interface SettingsPage {
  name: string;
  component: Function;
}

const settingsSections: Array<settingsSection> = [
  {
    name: "",
    settingsPages: [
      { name: "General", component: GeneralSettings },
      { name: "Apps", component: AppSettings },
      { name: "Providers", component: ProviderSettings },
    ],
  },
  {
    name: "Addons",
    settingsPages: [{ name: "Weather", component: WeatherSettings }],
  },
];

interface SettingsProps {
  config: Config;
}

export default function Settings({ config: requestConfig }: SettingsProps) {
  const [config, setConfig] = useState<Config>(requestConfig);
  const [modifiedConfig, setModifiedConfig] = useState<Config>(
    JSON.parse(JSON.stringify(config))
  );
  const [selectedTab, setSelectedTab] = useState<SettingsPage>(
    settingsSections[0].settingsPages[0]
  );
  const [unsavedWarningModalOpen, setUnsavedWarningModalOpen] = useState(false);
  const [nextTabTarget, setNextTabTarget] = useState<string>();
  const [unsavedWarningCallback, setUnsavedWarningCallback] =
    useState<Function>();

  const router = useRouter();

  useEffect(() => {
    // When saved config is updated also update the modified config to match
    setModifiedConfig(JSON.parse(JSON.stringify(config)));
  }, [config]);

  const saveConfigChanges = () => {
    if (config && modifiedConfig) {
      saveNewConfig(modifiedConfig);
    }
  };

  const saveNewConfig = (newConfig: Config) => {
    fetch(`/api/config`, {
      method: "PUT",
      body: JSON.stringify(newConfig),
    }).then((response) => {
      response.json().then((data) => {
        setConfig({ ...data });
      });
    });
  };

  const settingsModified =
    JSON.stringify(config) !== JSON.stringify(modifiedConfig);

  const changeSelectedTab = (tabName: string) => {
    // If settings are modified show the tab switch confirmation
    if (settingsModified) {
      setNextTabTarget(tabName);
      setUnsavedWarningModalOpen(true);
      setUnsavedWarningCallback(goToNextTabTarget);
      return;
    }

    goToNextTabTarget(tabName);
  };

  const goToNextTabTarget = (tabName?: string) => {
    const targetTabName = tabName ?? nextTabTarget;

    for (let i = 0; i < settingsSections.length; i++) {
      const settingsSection = settingsSections[i];
      const newSelectedTab = settingsSection.settingsPages.find(
        (x) => x.name === targetTabName
      );
      if (newSelectedTab) {
        setSelectedTab(newSelectedTab);
        resetModifiedConfig();
        return;
      }
    }
  };

  const resetModifiedConfig = () => {
    if (config) setModifiedConfig(JSON.parse(JSON.stringify(config)));
  };

  const goBackToStartpage = () => {
    // If settings are modified show the tab switch confirmation
    if (settingsModified) {
      setUnsavedWarningModalOpen(true);
      return;
    }

    setUnsavedWarningCallback(() => {
      router.push("/");
    });
  };

  const confirmUnsavedChangesModal = () => {
    if (unsavedWarningCallback) unsavedWarningCallback();
  };

  return (
    <div className="flex h-screen">
      <div className="absolute right-0 top-0 p-2 md:hidden">
        <button className="text-nord-4 active:text-nord-9">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="border-nord-0 bg-nord-1 bt-16 hidden min-w-[24rem] flex-col border-r pb-4 md:flex">
        <h1 className="text-nord-4 py-4 text-center text-xl">Settings</h1>

        <div className="flex flex-col">
          {settingsSections.map((section) => (
            <div key={section.name}>
              <h2 className="text-nord-4 py-2 pl-4 text-xl">{section.name}</h2>
              <ul className="flex flex-col">
                {section.settingsPages.map((page) => (
                  <li className="border-nord-0 border-b" key={page.name}>
                    <button
                      className={`border-nord-4 border border-opacity-0 ${
                        page.name === selectedTab.name
                          ? "border-opacity-100"
                          : ""
                      } bg-nord-3 text-nord-4 hover:bg-nord-2 w-full p-2`}
                      onClick={() => changeSelectedTab(page.name)}
                    >
                      {page.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col">
        <div className="bg-nord-1 flex flex-col gap-2 p-3">
          <h2 className="text-nord-4 text-2xl">{selectedTab.name}</h2>
          <div className="flex gap-4">
            <Button
              disabled={!settingsModified}
              className="w-24"
              onClick={saveConfigChanges}
              colour="green"
            >
              Save
            </Button>
            <Button className="w-24" onClick={goBackToStartpage} colour="blue">
              Exit
            </Button>
          </div>
        </div>

        <div className="h-full overflow-y-auto">
          <selectedTab.component
            config={config}
            modifiedConfig={modifiedConfig}
            setModifiedConfig={setModifiedConfig}
            saveNewConfig={saveNewConfig}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={unsavedWarningModalOpen}
        close={() => setUnsavedWarningModalOpen(false)}
        title="Confirm deletion"
        confirmAction={confirmUnsavedChangesModal}
        denyAction={() => {}}
      >
        <p>Are you sure you want to leave this page?</p>
        <p>All unsaved changes will be lost.</p>
      </ConfirmationModal>
    </div>
  );
}

export const getServerSideProps = async () => {
  const res = await fetch(`${getHost()}/api/config`);
  const config = await res.json();

  return {
    props: {
      config,
    },
  };
};
