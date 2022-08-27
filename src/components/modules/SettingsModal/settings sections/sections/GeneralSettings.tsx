import { Controller, useWatch } from "react-hook-form";
import Input from "../../../../input/Input";
import Switch from "../../../../switch/Switch";
import { SettingsSectionProps } from "../../types";

export default function GeneralSettings({
  register,
  control,
}: SettingsSectionProps) {
  var customSearchEnabled = useWatch({
    name: "general.customSearchEnabled",
    control,
  });

  return (
    <>
      <Input
        className="col-span-full md:col-span-3"
        label="Search placeholder"
        placeholder="Search placeholder"
        register={register("general.searchPlaceholder")}
      />

      <Input
        className="col-span-full md:col-span-3"
        label="Calendar Url"
        placeholder="Calendar url"
        register={register("general.calendarUrl")}
      />

      <div className="col-span-full row-start-4 sm:col-span-4 sm:row-start-auto md:col-span-3">
        <Input
          className={`${customSearchEnabled ? "" : "hidden"}`}
          label="Custom search url"
          placeholder="Search url"
          register={register("general.customSearchUrl")}
        />

        <Input
          className={`${customSearchEnabled ? "hidden" : ""}`}
          label="Search url"
          placeholder="Search url"
          register={register("general.searchUrl")}
        />
      </div>

      <div className="col-span-full sm:col-span-2 md:col-span-3">
        <Controller
          control={control}
          name="general.customSearchEnabled"
          render={({ field: { ref, ...field } }) => (
            <Switch label="Custom search" {...field} />
          )}
        />
      </div>
    </>
  );
}
