import { UIEventHandler, useContext, useEffect } from "react";
import Button from "../../button/Button";
import { useForm, useWatch } from "react-hook-form";
import { Config } from "../../../services/server/config/types";
import { saveConfig } from "../../../services/client/config/config";
import GlobalContext from "../../../contexts/GlobalContext/GlobalContext";
import SettingsSectionWrapper from "./settings sections/SettingsSectionWrapper";
import { SettingsSection } from "./types";
import { m } from "framer-motion";
import SideMenuIcon from "./SideMenuIcon";

interface SettingsContentProps {
  closeModal: () => void;
  config: Config;
  onClick?: () => void;
  onScroll?: UIEventHandler<HTMLDivElement>;
  settingsSections: Array<SettingsSection>;
  openMenuBar: () => void;
  isMobile: boolean;
}

export default function SettingsContent({
  closeModal,
  config,
  onClick,
  onScroll,
  settingsSections,
  openMenuBar,
  isMobile,
}: SettingsContentProps) {
  const { updateConfig } = useContext(GlobalContext);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Config>({ defaultValues: config });

  const appearance = useWatch({ name: "appearance", control });

  useEffect(() => {
    if (JSON.stringify(appearance) !== JSON.stringify(config.appearance)) {
      config.appearance = appearance;
      updateConfig(config);
    }
  }, [appearance, config, updateConfig]);

  const saveSettings = async (data: Config) => {
    updateConfig(data);
    await saveConfig(data);
    closeModal();
  };

  const glassyStyles = config.appearance.glassy
    ? "backdrop-blur-3xl dark:bg-primary-800/30"
    : "dark:bg-primary-800";

  return (
    <form
      className={`${glassyStyles} z-10 flex w-full flex-col justify-between pt-4 shadow-xl dark:text-primary-50`}
      onSubmit={handleSubmit(saveSettings)}
      onClick={onClick}
    >
      <m.div
        layoutScroll
        className="mt-4 flex h-full flex-col gap-3 overflow-y-auto scroll-smooth px-4"
        onScroll={onScroll}
      >
        {settingsSections.map((section) => (
          <div
            key={section.name}
            className="last:h-full"
            id={section.name}
            ref={section.ref}
          >
            <SettingsSectionWrapper
              section={section}
              sectionProps={{ control, register, config }}
            />
          </div>
        ))}
      </m.div>

      <div className="bg-primary-200/10 grid grid-cols-3 gap-4 p-2">
        {isMobile && <SideMenuIcon openMenuBar={openMenuBar} />}
        <Button type="submit" state="success">
          Save
        </Button>
        <Button variant="outline" onClick={closeModal}>
          Exit
        </Button>
      </div>
    </form>
  );
}
