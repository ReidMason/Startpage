import { UIEventHandler, useCallback, useEffect, useRef } from "react";
import Button from "../../button/Button";
import { useForm, useWatch } from "react-hook-form";
import { Config, PartialConfig } from "../../../backend/routers/config/schemas";
import SettingsSectionWrapper from "./settings sections/SettingsSectionWrapper";
import { SettingsSection } from "./types";
import { m } from "framer-motion";
import SideMenuIcon from "./SideMenuIcon";
import { trpc } from "../../../utils/trpc";

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
  const config = trpc.useQuery(["config.get"]);
  const configMutation = trpc.useMutation(["config.save"]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Config>({ defaultValues: config.data });

  const saveConfig = useCallback(
    async (newConfig: PartialConfig) => {
      await configMutation.mutateAsync(newConfig, {
        onSuccess: () => {
          config.refetch();
        },
      });
    },
    [config, configMutation]
  );

  const appearance = useWatch({ name: "appearance", control });

  useEffect(() => {
    if (
      config.data &&
      JSON.stringify(appearance) !== JSON.stringify(config.data.appearance)
    ) {
      config.data.appearance = appearance;
      // TODO: Stop this from saving to file, instead this should just update the preview config
      saveConfig(config.data);
    }
  }, [appearance, config, saveConfig]);

  // TODO: Add a better loading state
  if (config.isLoading || !config.data) return <div>Loading...</div>;

  const saveSettings = async (data: Config) => {
    saveConfig(data);
    await saveConfig(data);
    closeModal();
  };

  const glassyStyles = config.data.appearance.glassy
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
              sectionProps={{ control, register, config: config.data }}
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
