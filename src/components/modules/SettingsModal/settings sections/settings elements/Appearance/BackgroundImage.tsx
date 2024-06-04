import { Controller } from "react-hook-form";
import FormElementWrapper from "../../../../../FormElementWrapper/FormElementWrapper";
import Switch from "../../../../../switch/Switch";
import { SettingsElement } from "../../../types";
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

const settingsElement: SettingsElement = {
  component: BackgroundImage,
  name: "Background Image",
  altNames: ["background", "image"],
};

export default settingsElement;
