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

export default WeatherLocation;
