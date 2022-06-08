import {
  createRef,
  MutableRefObject,
  RefObject,
  UIEventHandler,
  useContext,
  useEffect,
  useRef,
} from "react";
import Button from "../../button/Button";
import { useForm, useWatch } from "react-hook-form";
import { Config } from "../../../services/server/config/types";
import { saveConfig } from "../../../services/client/config/config";
import GlobalContext from "../../../contexts/GlobalContext/GlobalContext";
import SettingsSectionWrapper from "./settings sections/SettingsSectionWrapper";
import { SettingsSection } from "./types";
import { StateSetter } from "../../../types/common";
import { m } from "framer-motion";

interface SettingsContentProps {
  closeModal: () => void;
  config: Config;
  onClick?: () => void;
  onScroll?: UIEventHandler<HTMLDivElement>;
  settingsSections: Array<SettingsSection>;
  setSettingsSections: StateSetter<Array<SettingsSection>>;
}

export default function SettingsContent({
  closeModal,
  config,
  onClick,
  onScroll,
  settingsSections,
  setSettingsSections,
}: SettingsContentProps) {
  const { updateConfig } = useContext(GlobalContext);
  const elementsRef: MutableRefObject<Array<RefObject<HTMLDivElement>>> =
    useRef(settingsSections.map(() => createRef()));

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
  }, [appearance]);

  const saveSettings = async (data: Config) => {
    updateConfig(data);
    await saveConfig(data);
    closeModal();
  };

  useEffect(() => {
    const newSettingsSections = settingsSections.map((x, index) => ({
      ...x,
      ref: elementsRef.current[index],
    }));
    setSettingsSections(newSettingsSections);
  }, []);

  const glassyStyles = config.appearance.glassy
    ? "backdrop-blur-3xl dark:bg-primary-800/30"
    : "dark:bg-primary-800";

  return (
    <form
      className={`${glassyStyles} z-10 flex w-full flex-col justify-between py-4 shadow-xl dark:text-primary-50`}
      onSubmit={handleSubmit(saveSettings)}
    >
      <m.div
        layoutScroll
        className="mt-4 h-full overflow-y-auto scroll-smooth px-4"
        onClick={onClick}
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

      <div className="flex justify-end gap-4 px-4 pt-2">
        <Button type="submit" state="success">
          Save
        </Button>
        <Button state="grey" onClick={closeModal}>
          Exit
        </Button>
      </div>
    </form>
  );
}
