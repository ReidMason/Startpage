import { FormEvent, SVGProps } from "react";
import Button from "../../button/Button";
import { AdjustmentsIcon } from "@heroicons/react/solid";
import { CloudIcon, SearchIcon } from "@heroicons/react/outline";
import GeneralSettings from "./settings sections/GeneralSettings";
import { useForm } from "react-hook-form";
import { Config } from "../../../services/config/types";
import { SettingsSectionProps } from "./types";
import SettingsSectionHeader from "./SettingsSectionHeader";
import WeatherSettings from "./settings sections/WeatherSettings";
import Collapse from "../../collapse/Collapse";

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
}

export default function SettingsContent({
  closeModal,
  config,
}: SettingsContentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Config>({ defaultValues: config });

  const saveSettings = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Validate fields");
    console.log("Save config");
    closeModal();
  };

  return (
    <form
      className="z-10 flex h-full w-full flex-col justify-between bg-primary-800 py-4 shadow-xl dark:text-primary-50"
      onSubmit={saveSettings}
    >
      <div className="flex flex-col gap-4 overflow-y-auto px-4">
        {settingsSections.map((section) => (
          <div key={section.name} className="mb-6 flex flex-col gap-8">
            <div>
              <Collapse
                header={<SettingsSectionHeader {...section} />}
                body={
                  <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2 lg:pl-4 xl:grid-cols-3">
                    <section.content register={register} />
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

{
  /* <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-violet-400 p-1">
              <AdjustmentsIcon className="h-5 w-5" />
            </div>
            <h2 className="mb-1 text-2xl">General</h2>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <Input placeholder="Search placeholder" />
            <Input placeholder="Calendar url" />
            <Input placeholder="Search url" />
            <Input placeholder="Custom search url" />
          </div>
        </div>

        <hr className="opacity-80" />

        <div>
          <div className="flex items-center gap-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-green-400 p-1">
                <CloudIcon className="h-5 w-5" />
              </div>
              <h2 className="mb-1 text-2xl">Weather</h2>
            </div>
            <div className="mb-2">
              <Toggle defaultValue={toggle} setter={setToggle} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <Input placeholder="Api key" />
            <Input placeholder="Location" />
            <div className="flex flex-col gap-2">
              <p>Detailed weather display</p>
              <Toggle defaultValue={toggle} setter={setToggle} />
            </div>
          </div>
        </div>

        <hr className="opacity-80" />

        <div>
          <div className="flex w-1/2 items-center justify-between">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-sky-400 p-1">
                <SearchIcon className="h-5 w-5" />
              </div>
              <h2 className="mb-1 text-2xl">Providers</h2>
            </div>
            <div className="mr-4">
              <Input placeholder="Search..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <Input placeholder="Api key" />
            <Input placeholder="Location" />
          </div>
        </div> */
}
