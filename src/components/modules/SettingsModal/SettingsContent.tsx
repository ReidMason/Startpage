import {
  UIEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "../../button/Button";
import { useForm, useWatch } from "react-hook-form";
import { Config, PartialConfig } from "../../../backend/routers/config/schemas";
import SettingsSectionWrapper from "./settings sections/SettingsSectionWrapper";
import { SettingsSection } from "./types";
import { m } from "framer-motion";
import SideMenuIcon from "./SideMenuIcon";
import useConfig from "../../../hooks/useConfig";
import { trpc } from "../../../utils/trpc";
import { updateDarkMode } from "../../../../utils";

interface SettingsContentProps {
  closeModal: () => void;
  onClick?: () => void;
  onScroll?: UIEventHandler<HTMLDivElement>;
  settingsSections: Array<SettingsSection>;
  openMenuBar: () => void;
  isMobile: boolean;
}

export default function SettingsContent({
  closeModal,
  onClick,
  onScroll,
  settingsSections,
  openMenuBar,
  isMobile,
}: SettingsContentProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const { config, configMutation } = useConfig();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<Config>({ defaultValues: config.data });
  const trpcUtils = trpc.useContext();

  const [modifiedConfig, setModifiedConfig] = useState<Config>();

  useEffect(() => {
    if (!config.isLoading && modifiedConfig === undefined) {
      setModifiedConfig(config.data);
      reset(config.data);
    }
  }, [config.isLoading, setModifiedConfig]);

  const saveConfig = useCallback(
    async (newConfig: PartialConfig) => {
      await configMutation.mutateAsync(newConfig, {
        onSuccess: () => {
          trpcUtils.invalidateQueries(["config.get"]);
        },
      });
    },
    [config, configMutation]
  );

  const appearance = useWatch({ name: "appearance", control });

  useEffect(() => {
    if (
      modifiedConfig !== undefined &&
      appearance !== undefined &&
      JSON.stringify(appearance) !== JSON.stringify(modifiedConfig.appearance)
    ) {
      // TODO: Stop this from saving to file, instead this should just update the preview config
      const newConfig = { ...modifiedConfig, appearance };
      setModifiedConfig(newConfig);
      updateDarkMode(newConfig);
      // saveConfig(newConfig);
    }
  }, [appearance, modifiedConfig]);

  // TODO: Add a better loading state
  if (config.isLoading || config.isIdle) return <div>Loading...</div>;

  const saveSettings = async (data: Config) => {
    saveConfig(data);
    await saveConfig(data);
    closeModal();
  };

  const glassyStyles = modifiedConfig?.appearance.glassy
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
            {modifiedConfig && (
              <SettingsSectionWrapper
                section={section}
                sectionProps={{ control, register, config: modifiedConfig }}
              />
            )}
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
