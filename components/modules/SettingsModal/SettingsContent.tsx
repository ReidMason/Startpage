import { UIEventHandler, useContext, useRef } from "react";
import Button from "../../button/Button";
import { useForm } from "react-hook-form";
import { Config } from "../../../services/server/config/types";
import { saveConfig } from "../../../services/client/config/config";
import GlobalContext from "../../../contexts/GlobalContext/GlobalContext";
import SettingsSectionWrapper from "./settings sections/SettingsSectionWrapper";
import { settingsSections } from "./settingsSections";

interface SettingsContentProps {
  closeModal: () => void;
  config: Config;
  onClick?: () => void;
  onScroll?: UIEventHandler<HTMLDivElement>;
}

export default function SettingsContent({
  closeModal,
  config,
  onClick,
  onScroll,
}: SettingsContentProps) {
  const { setConfig } = useContext(GlobalContext);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Config>({ defaultValues: config });

  const saveSettings = async (data: Config) => {
    await saveConfig(data);
    setConfig!(data);
    closeModal();
  };

  settingsSections.map((x) => (x.ref = useRef(null)));

  const scrollTest = () => {
    const section = settingsSections.find(
      (x) => x.name.toLowerCase() === "providers"
    );
    if (!section) return;

    const ref = section.ref?.current;
    if (!ref) return;

    ref.scrollIntoView();
  };

  return (
    <form
      className="z-10 flex w-full flex-col justify-between bg-primary-800 py-4 shadow-xl dark:text-primary-50"
      onSubmit={handleSubmit(saveSettings)}
    >
      <div
        className="mt-4 h-full overflow-y-auto scroll-smooth px-4"
        onClick={onClick}
        onScroll={onScroll}
      >
        {settingsSections.map((section) => (
          <div ref={section.ref} key={section.name} className="last:h-full">
            <SettingsSectionWrapper
              section={section}
              sectionProps={{ control, register }}
            />
          </div>
        ))}
      </div>

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
