import { ChangeEvent, useContext } from "react";
import { Controller } from "react-hook-form";
import GlobalContext from "../../../../../contexts/GlobalContext/GlobalContext";
import { appearances } from "../../../../../services/server/config/types";
import Input from "../../../../input/Input";
import RadioGroup from "../../../../RadioGroup/RadioGroup";
import Toggle from "../../../../toggle/Toggle";
import { SettingsSectionProps } from "../../types";

export default function GeneralSettings({
  register,
  control,
}: SettingsSectionProps) {
  const { updateCacheKey } = useContext(GlobalContext);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const body = new FormData();
      body.append("file", e.target.files[0]);

      fetch("/api/savebg", {
        method: "POST",
        body,
      }).then(() => {
        updateCacheKey();
      });
    }
  };

  return (
    <>
      <input type="file" id="myFile" name="filename" onChange={onFileChange} />

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
        name="general.glassy"
        render={({ field: { ref, ...field } }) => (
          <Toggle label="Glassy theme" {...field} />
        )}
      />

      <Controller
        control={control}
        name="general.backgroundEnabled"
        render={({ field: { ref, ...field } }) => (
          <Toggle label="Background enabled" {...field} />
        )}
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
        )}
      />
    </>
  );
}
