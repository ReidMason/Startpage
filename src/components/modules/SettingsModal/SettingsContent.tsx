import { UIEventHandler, useContext, useEffect, useRef } from "react";
import Button from "../../button/Button";
import { useForm, useWatch } from "react-hook-form";
import { ConfigSchema } from "../../../backend/routers/config/schemas";
import { saveConfig } from "../../../../services/client/config/config";
import GlobalContext from "../../../../contexts/GlobalContext/GlobalContext";
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
  const scrollContainer = useRef<HTMLDivElement>(null);
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
        className="mt-4 grid h-screen grid-cols-1 gap-3 self-stretch overflow-y-auto scroll-smooth px-4"
        onScroll={onScroll}
        ref={scrollContainer}
      >
        {settingsSections.map((section, index) => (
          <div
            key={section.name}
            id={section.name}
            ref={section.ref}
            className="last:pb-4"
            style={
              index == settingsSections.length - 1
                ? { height: scrollContainer.current?.clientHeight }
                : undefined
            }
          >
            <SettingsSectionWrapper
              section={section}
              sectionProps={{ control, register, config }}
            />
          </div>
        ))}
      </m.div>

      <div className="grid grid-cols-3 gap-4 bg-primary-200/10 p-2">
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
