import BaseTextSetting from "../base/BaseTextSetting";
import { SettingsElementComponent } from "../types";

const WeatherApiKey: SettingsElementComponent = ({ register }) => {
  return (
    <BaseTextSetting
      formRegister={register("weather.apiKey")}
      label="Api key"
    />
  );
};

export default WeatherApiKey;
