import { SettingsElement } from "../../../types";
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

const settingsElement: SettingsElement = {
  component: WeatherApiKey,
  name: "Weather API Key",
  altNames: [],
};

export default settingsElement;
