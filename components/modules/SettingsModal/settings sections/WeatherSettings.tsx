import Input from "../../../input/Input";
import Toggle from "../../../toggle/Toggle";
import { SettingsSectionProps } from "../types";

export default function WeatherSettings({ register }: SettingsSectionProps) {
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
      <div className="flex flex-col gap-2">
        <p>Detailed weather display</p>
        <Toggle defaultValue={false} setter={() => {}} />
      </div>
    </>
  );
}
