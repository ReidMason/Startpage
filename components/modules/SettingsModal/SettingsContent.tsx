import { FormEvent, SVGProps, useContext } from "react";
import Button from "../../button/Button";
import { AdjustmentsIcon } from "@heroicons/react/solid";
import { CloudIcon, SearchIcon } from "@heroicons/react/outline";
import GeneralSettings from "./settings sections/GeneralSettings";
import { useForm } from "react-hook-form";
import { Config } from "../../../services/server/config/types";
import { SettingsSectionProps } from "./types";
import SettingsSectionHeader from "./SettingsSectionHeader";
import WeatherSettings from "./settings sections/WeatherSettings";
import Collapse from "../../collapse/Collapse";
import { saveConfig } from "../../../services/client/config/config";
import GlobalContext from "../../../contexts/GlobalContext/GlobalContext";

interface SettingsSection {
  name: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  iconBg: string;
  content: ({}: SettingsSectionProps) => JSX.Element;
}

export const settingsSections: Array<SettingsSection> = [
  {
    name: "General",
    icon: AdjustmentsIcon,
    iconBg: "bg-violet-400",
    content: GeneralSettings,
  },
  {
    name: "Weather",
    icon: CloudIcon,
    iconBg: "bg-green-500",
    content: WeatherSettings,
  },
  {
    name: "Providers",
    icon: SearchIcon,
    iconBg: "bg-sky-400",
    content: GeneralSettings,
  },
];

interface SettingsContentProps {
  closeModal: () => void;
  config: Config;
  onClick?: () => void;
}

export default function SettingsContent({
  closeModal,
  config,
  onClick,
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

  return (
    <form
      className="z-10 flex w-full flex-col justify-between bg-primary-800 py-4 shadow-xl dark:text-primary-50"
      onSubmit={handleSubmit(saveSettings)}
    >
      <div
        className="flex h-full flex-col gap-4 overflow-y-auto px-4"
        onClick={onClick}
      >
        {settingsSections.map((section) => (
          <div key={section.name} className="mb-6 flex flex-col gap-8">
            <div>
              <Collapse
                header={<SettingsSectionHeader {...section} />}
                body={
                  <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2 lg:pl-4 xl:grid-cols-3">
                    <section.content register={register} control={control} />
                  </div>
                }
              />
            </div>

            <div className="flex opacity-80">
              <div className="from h-1 w-1/2 bg-gradient-to-l dark:from-primary-400" />
              <div className="from h-1 w-1/2 bg-gradient-to-r dark:from-primary-400" />
            </div>
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
