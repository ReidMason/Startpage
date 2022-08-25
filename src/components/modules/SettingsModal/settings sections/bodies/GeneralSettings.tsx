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
        label="Search placeholder"
        placeholder="Search placeholder"
        register={register("general.searchPlaceholder")}
      />
      <Input
        label="Calendar Url"
        placeholder="Calendar url"
        register={register("general.calendarUrl")}
      />
      <Input
        label="Search url"
        placeholder="Search url"
        register={register("general.searchUrl")}
      />

      <Controller
        control={control}
        name="general.customSearchEnabled"
        render={({ field: { ref, ...field } }) => (
          <Switch label="Custom search" {...field} />
        )}
      />

      {customSearchEnabled && (
        <Input
          label="Custom search url"
          register={register("general.customSearchUrl")}
          disabled={true}
        />
      )}
    </>
  );
}
