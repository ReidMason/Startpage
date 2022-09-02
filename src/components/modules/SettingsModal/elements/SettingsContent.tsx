import { UIEventHandler, useEffect, useRef, useState } from "react";
import Button from "../../../button/Button";
import { useForm, useWatch } from "react-hook-form";
import {
  Config,
  PartialConfig,
} from "../../../../backend/routers/config/schemas";
import SettingsSectionWrapper from "../settings sections/SettingsSectionWrapper";
import { SettingsSection } from "../types";
import { m } from "framer-motion";
import SideMenuToggleIcon from "./SideMenuToggleIcon";
import { ConfigSetter } from "../../../../../types/common";

interface SettingsContentProps {
  closeModal: (saved?: boolean) => void;
  onClick?: () => void;
  onScroll?: UIEventHandler<HTMLDivElement>;
  settingsSections: Array<SettingsSection>;
  openMenuBar: () => void;
  isMobile: boolean;
  menuVisible: boolean;
  config: Config;
  setConfig: ConfigSetter;
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
  setConfig,
}: SettingsContentProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, control } = useForm<Config>({
    defaultValues: config,
  });

  const [modifiedConfig, setModifiedConfig] = useState<Config>();

  const appearance = useWatch({
    name: "appearance",
    control,
  });

  useEffect(() => {
    setConfig({ ...modifiedConfig, appearance }, false, false);

    if (
      modifiedConfig !== undefined &&
      appearance !== undefined &&
      JSON.stringify(appearance) !== JSON.stringify(modifiedConfig.appearance)
    ) {
      const newConfig = { ...modifiedConfig, appearance };
      setModifiedConfig(newConfig);
    }
  }, [appearance, modifiedConfig]);

  const saveSettings = async (data: Config) => {
    await setConfig(data, true, false);
    closeModal(true);
  };

  return (
    <form
      className={`${
        menuVisible ? "whitespace-nowrap" : ""
      } z-10 flex w-full flex-col justify-between pt-4 shadow-xl glassy:backdrop-blur-3xl dark:bg-primary-800 dark:text-primary-50 dark:glassy:bg-primary-800/30`}
      onSubmit={handleSubmit(saveSettings)}
      onClick={onClick}
    >
      <m.div
        layoutScroll
        className="mt-4 grid h-screen grid-cols-1 gap-3 self-stretch overflow-y-auto scroll-smooth px-4"
        onScroll={onScroll}
        ref={scrollContainer}
      >
        {settingsSections.map((section, index) => (
          <div
            key={section.name}
            id={section.name}
            ref={section.ref}
            style={
              index == settingsSections.length - 1
                ? { height: scrollContainer.current?.clientHeight }
                : undefined
            }
          >
            <SettingsSectionWrapper
              section={section}
              sectionProps={{
                control,
                register,
                config: config,
                saveConfig: setConfig,
              }}
            />
          </div>
        ))}
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
