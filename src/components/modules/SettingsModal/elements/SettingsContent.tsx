import { UIEventHandler, useEffect, useState } from "react";
import Button from "../../../button/Button";
import { useForm, useWatch } from "react-hook-form";
import { Config } from "../../../../backend/routers/config/schemas";
import SettingsSectionWrapper from "../settings sections/SettingsSectionWrapper";
import { SettingsElement, SettingsSection } from "../types";
import { m } from "framer-motion";
import SideMenuToggleIcon from "./SideMenuToggleIcon";
import type { ConfigSetter } from "../../../../../types/common";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

interface SettingsContentProps {
  settingsSearch: string;
  closeModal: (saved?: boolean) => void;
  onClick?: () => void;
  onScroll?: UIEventHandler<HTMLDivElement>;
  settingsSections: Array<SettingsSection>;
  openMenuBar: () => void;
  isMobile: boolean;
  menuVisible: boolean;
  config: Config;
  updateConfig: ConfigSetter;
}

export default function SettingsContent({
  closeModal,
  onClick,
  onScroll,
  settingsSections,
  openMenuBar,
  menuVisible,
  isMobile,
  config,
  updateConfig,
  settingsSearch,
}: SettingsContentProps) {
  const [modifiedConfig, setModifiedConfig] = useState<Config>(config);
  const [scrollContainer, setScrollContainer] =
    useState<HTMLDivElement | null>();
  const { register, handleSubmit, control } = useForm<Config>({
    defaultValues: config,
  });

  const appearance = useWatch({
    name: "appearance",
    control,
  });

  useEffect(() => {
    const appearanceIsOutdated =
      JSON.stringify(appearance) !== JSON.stringify(modifiedConfig.appearance);
    if (appearanceIsOutdated) {
      const newConfig = { ...modifiedConfig, appearance };

      updateConfig(newConfig, false, false);
      setModifiedConfig(newConfig);
    }
  }, [appearance, modifiedConfig, updateConfig]);

  const saveSettings = async (data: Config) => {
    await updateConfig(data, true, false);
    closeModal(true);
  };

  const scrollContainerHeight = scrollContainer?.clientHeight ?? 0;

  const matchElement = (
    searchTerm: string,
    settingsElement: SettingsElement
  ): boolean => {
    const potentialNames = [...settingsElement.altNames, settingsElement.name];

    // Include names without the spaces
    potentialNames.forEach((x) => {
      if (x.includes(" ")) {
        potentialNames.push(x.replaceAll(" ", ""));
        potentialNames.push(...x.split(" "));
      }
    });

    for (let i = 0; i < potentialNames.length; i++) {
      const potentialName = potentialNames[i].toLowerCase();
      if (potentialName.includes(searchTerm.toLowerCase())) return true;
    }

    return false;
  };

  const filteredSections = settingsSections
    .map(({ ...x }) => {
      x.settingsElements = x.settingsElements.filter((x) =>
        matchElement(settingsSearch, x)
      );
      return x;
    })
    .filter((x) => x.settingsElements.length);

  return (
    <form
      className={`${
        menuVisible ? "whitespace-nowrap" : ""
      } z-10 flex w-[45rem] flex-col justify-between shadow-xl glassy:backdrop-blur-3xl dark:bg-primary-800 dark:text-primary-50 dark:glassy:bg-primary-800/30`}
      onSubmit={handleSubmit(saveSettings)}
      onClick={onClick}
    >
      <m.div
        layoutScroll
        className="flex h-screen flex-col gap-4 overflow-y-auto scroll-smooth sm:mt-4 sm:px-4"
        onScroll={onScroll}
        ref={(newRef) => setScrollContainer(newRef)}
      >
        {filteredSections.length ? (
          filteredSections.map((section, index) => (
            <div
              key={section.name}
              id={section.name}
              ref={section.ref}
              style={
                index == settingsSections.length - 1
                  ? {
                      marginBottom:
                        scrollContainerHeight -
                        (section.ref?.current?.clientHeight ?? 0),
                    }
                  : undefined
              }
            >
              <SettingsSectionWrapper
                section={section}
                sectionProps={{
                  control,
                  register,
                  config,
                  saveConfig: updateConfig,
                }}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center text-center text-xl">
            <p>No results found</p>
            <FaceFrownIcon className="h-12 w-12" />
          </div>
        )}
      </m.div>

      <div className="grid grid-cols-3 gap-4 bg-primary-200/10 p-2">
        {isMobile && <SideMenuToggleIcon openMenuBar={openMenuBar} />}
        <Button type="submit" state="success">
          Save
        </Button>
        <Button variant="outline" onClick={() => closeModal()}>
          Exit
        </Button>
      </div>
    </form>
  );
}
