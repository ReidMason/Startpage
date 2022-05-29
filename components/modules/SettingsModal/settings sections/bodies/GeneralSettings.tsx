import { useState } from "react";
import { Controller } from "react-hook-form";
import { appearances } from "../../../../../services/server/config/types";
import Input from "../../../../input/Input";
import RadioGroup from "../../../../RadioGroup/RadioGroup";
import { SettingsSectionProps } from "../../types";

export default function GeneralSettings({
  register,
  control,
}: SettingsSectionProps) {
  const [plan, setPlan] = useState();

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
      <Input
        label="Custom search url"
        placeholder="Custom search url"
        register={register("general.customSearchUrl")}
      />

      <Controller
        control={control}
        name="general.appearance"
        render={({ field: { ref, ...field } }) => (
          <RadioGroup
            label="Appearance"
            {...field}
            options={[...appearances]}
          />
          // <Toggle label="Detailed weather display" {...field} />
        )}
      />
    </>
  );
}
