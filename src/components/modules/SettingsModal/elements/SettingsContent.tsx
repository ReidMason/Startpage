import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { Config } from "../../../../backend/routers/config/schemas";
import SettingsSectionWrapper from "../settings sections/SettingsSectionWrapper";
import { SettingsElement, SettingsSection } from "../types";
import { m } from "framer-motion";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import type { UIEvent } from "react";
import type { Control, UseFormRegister } from "react-hook-form";
import type { ConfigSetter } from "../../../../../types/common";

interface SettingsContentProps {
  settingsSearch: string;
  settingsSections: Array<SettingsSection>;
  config: Config;
  updateConfig: ConfigSetter;
  register: UseFormRegister<Config>;
  control: Control<Config, any>;
  menuVisible: boolean;
  onScroll?: (e: UIEvent<HTMLDivElement>) => void;
}

export default function SettingsContent({
  settingsSections,
  config,
  updateConfig,
  settingsSearch,
  control,
  register,
  menuVisible,
  onScroll,
}: SettingsContentProps) {
  const [modifiedConfig, setModifiedConfig] = useState<Config>(config);
  const [scrollContainer, setScrollContainer] =
    useState<HTMLDivElement | null>();
  const [scrollContainerHeight, setScrollContainerHeight] = useState(0);

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

  useEffect(() => {
    setScrollContainerHeight(scrollContainer?.clientHeight ?? 0);
  }, [scrollContainer?.clientHeight]);

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
    <m.div
      layoutScroll
      className={`${
        menuVisible ? "whitespace-nowrap" : ""
      } flex h-full flex-col gap-4 overflow-y-auto scroll-smooth transition md:w-[45rem] lg:px-4`}
      ref={(newRef) => setScrollContainer(newRef)}
      onScroll={onScroll}
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
  );
}
