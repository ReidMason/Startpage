import { SettingsElement } from "../../../types";
import BaseTextSetting from "../base/BaseTextSetting";
import { SettingsElementComponent } from "../types";

const WeatherLocation: SettingsElementComponent = ({ register }) => {
  return (
    <BaseTextSetting
      formRegister={register("weather.location")}
      label="Location"
    />
  );
};

const settingsElement: SettingsElement = {
  component: WeatherLocation,
  name: "Weather Location",
  altNames: [],
};

export default settingsElement;
