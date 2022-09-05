import { Controller } from "react-hook-form";
import FormElementWrapper from "../../../../../FormElementWrapper/FormElementWrapper";
import Switch from "../../../../../switch/Switch";
import { SettingsElementComponent } from "../types";

const BackgroundImage: SettingsElementComponent = ({ control }) => {
  return (
    <Controller
      control={control}
      name="appearance.backgroundEnabled"
      render={({ field: { ref, ...field } }) => (
        <FormElementWrapper label="Background image">
          <Switch {...field} />
        </FormElementWrapper>
      )}
    />
  );
};

export default BackgroundImage;
