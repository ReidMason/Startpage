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
        className="col-span-full"
        label="Search placeholder"
        placeholder="Search placeholder"
        register={register("general.searchPlaceholder")}
      />

      <Input
        className="col-span-full"
        label="Calendar Url"
        placeholder="Calendar url"
        register={register("general.calendarUrl")}
      />

      <div className="col-span-4">
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

      <div className="col-span-2">
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
