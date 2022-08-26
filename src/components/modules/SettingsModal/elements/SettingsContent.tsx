import {
  UIEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import useConfig from "../../../../hooks/useConfig";
import { trpc } from "../../../../utils/trpc";
import { updateGlobalClasses } from "../../../../../utils";

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

  const { register, handleSubmit, control, reset } = useForm<Config>({
    defaultValues: config.data,
  });
  const trpcUtils = trpc.useContext();

  const [modifiedConfig, setModifiedConfig] = useState<Config>();

  useEffect(() => {
    if (!config.isLoading && modifiedConfig === undefined) {
      setModifiedConfig(config.data);
      reset(config.data);
    }
  }, [config.isLoading, setModifiedConfig, config.data, modifiedConfig, reset]);

  const saveConfig = useCallback(
    async (newConfig: PartialConfig) => {
      await configMutation.mutateAsync(newConfig, {
        onSuccess: () => {
          trpcUtils.invalidateQueries(["config.get"]);
        },
      });
    },
    [configMutation, trpcUtils]
  );

  const appearance = useWatch({
    name: "appearance",
    control,
  });

  useEffect(() => {
    if (
      modifiedConfig !== undefined &&
      appearance !== undefined &&
      JSON.stringify(appearance) !== JSON.stringify(modifiedConfig.appearance)
    ) {
      const newConfig = { ...modifiedConfig, appearance };
      setModifiedConfig(newConfig);
      updateGlobalClasses(newConfig);
    }
  }, [appearance, modifiedConfig]);

  // TODO: Add a better loading state
  if (config.isLoading || config.isIdle) return <div>Loading...</div>;

  const saveSettings = async (data: Config) => {
    saveConfig(data);
    await saveConfig(data);
    closeModal();
  };

  return (
    <form
      className="z-10 flex w-full flex-col justify-between pt-4 shadow-xl glassy:backdrop-blur-3xl dark:bg-primary-800 dark:text-primary-50 dark:glassy:bg-primary-800/30"
      onSubmit={handleSubmit(saveSettings)}
      onClick={onClick}
    >
      <m.div
        layoutScroll
        className="mt-4 flex h-screen flex-col gap-3 self-stretch overflow-y-auto scroll-smooth px-4"
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
        {isMobile && <SideMenuToggleIcon openMenuBar={openMenuBar} />}
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
