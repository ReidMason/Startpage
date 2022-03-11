import React, { useState } from "react";
import { App as AppInterface, Config } from "../../../../interfaces/Config";
import App from "../../../App";
import Button from "../../../Button";
import TextInput from "../../../Input";
import IconSearch from "../../IconSearch";

interface AppFormProps {
  config: Config;
  modifiedConfig: Config;
  setModifiedConfig: Function;
  app: AppInterface;
  editEnabled: boolean;
  enableEditing: Function;
}

export default function AppForm({
  config,
  modifiedConfig,
  setModifiedConfig,
  app,
  editEnabled,
  enableEditing,
}: AppFormProps) {
  const savedApp = config.apps.find((x) => x.id === app.id);
  const modified = JSON.stringify(app) != JSON.stringify(savedApp);
  const [iconSearched, setIconSearched] = useState(false);

  const updateApp = (updatedApp: any) => {
    modifiedConfig.apps = modifiedConfig.apps.map((originalApp) =>
      originalApp.id === app.id ? { ...app, ...updatedApp } : originalApp
    );
    setModifiedConfig({ ...modifiedConfig! });
  };

  const removeApp = () => {
    modifiedConfig.apps = modifiedConfig.apps.filter((x) => x.id !== app.id);
    setModifiedConfig({ ...modifiedConfig });
  };

  const resetApp = () => {
    modifiedConfig.apps = modifiedConfig.apps.map((x) =>
      x.id === savedApp.id ? savedApp : x
    );

    setModifiedConfig({ ...modifiedConfig });
  };

  const iconSelected = (iconName: string) => {
    updateApp({ icon: iconName });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4">
        <div className="border-nord-4 rounded border border-opacity-40 p-2">
          <div className="flex flex-col flex-wrap md:flex-row">
            <div className="min-w-[16rem] max-w-[16rem] overflow-hidden">
              <App app={app} preview />
            </div>

            <div
              className={`flex ${iconSearched ? "flex-col" : "flex-wrap"} gap-2
              ${editEnabled ? "" : "hidden md:block"}`}
            >
              <div className="w-full flex-wrap gap-2 md:flex">
                <TextInput
                  className="mt-2 w-full md:mt-0 xl:w-64"
                  placeholder="Name"
                  defaultValue={app.name}
                  setValue={(val: string) => {
                    updateApp({ name: val });
                  }}
                  floatingLabel
                />
                <TextInput
                  className="mt-2 w-full md:mt-0 xl:w-96"
                  placeholder="Url"
                  defaultValue={app.url}
                  setValue={(val: string) => {
                    updateApp({ url: val });
                  }}
                  floatingLabel
                />
                <TextInput
                  className="mt-2 w-full md:mt-0 xl:w-64"
                  placeholder="Icon"
                  defaultValue={app.icon}
                  setValue={(val: string) => {
                    updateApp({ icon: val });
                  }}
                  floatingLabel
                />
              </div>
              <IconSearch
                className="w-full md:w-auto"
                iconSelected={iconSelected}
                selectedIcon={app.icon}
                setIconSearched={setIconSearched}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-4 flex gap-4 md:hidden">
              {editEnabled ? (
                <Button
                  colour="green"
                  className="w-18"
                  onClick={() => enableEditing("")}
                >
                  Close
                </Button>
              ) : (
                <Button
                  colour="green"
                  className="w-120"
                  onClick={() => enableEditing(app.id)}
                >
                  Edit
                </Button>
              )}
            </div>

            <div className="mt-4 flex gap-4">
              <Button className="w-20" onClick={removeApp} colour="red">
                Delete
              </Button>
              <Button className="w-20" onClick={resetApp} disabled={!modified}>
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
