import { Controller } from "react-hook-form";
import Input from "../../../../input/Input";
import Switch from "../../../../switch/Switch";
import { SettingsSectionProps } from "../../types";

export default function WeatherSettings({
  register,
  control,
}: SettingsSectionProps) {
  return (
    <>
      <Input
        label="Api key"
        placeholder="Api key"
        register={register("weather.apiKey")}
      />
      <Input
        label="Location"
        placeholder="Location"
        register={register("weather.location")}
      />
      <Controller
        control={control}
        name="weather.detailed"
        render={({ field: { ref, ...field } }) => (
          <Switch label="Detailed weather display" {...field} />
        )}
      />
    </>
  );
}
