import { Controller } from "react-hook-form";
import FormElementWrapper from "../../../../../FormElementWrapper/FormElementWrapper";
import Switch from "../../../../../switch/Switch";
import { SettingsElementComponent } from "../types";

const DetailedWeatherDisplay: SettingsElementComponent = ({ control }) => {
  return (
    <Controller
      control={control}
      name="weather.enabled"
      render={({ field: { ref, ...field } }) => (
        <FormElementWrapper label="Show weather">
          <Switch {...field} />
        </FormElementWrapper>
      )}
    />
  );
};

export default DetailedWeatherDisplay;
