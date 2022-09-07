import { Controller } from "react-hook-form";
import { appearances } from "../../../../../../backend/routers/config/schemas";
import FormElementWrapper from "../../../../../FormElementWrapper/FormElementWrapper";
import RadioGroup from "../../../../../RadioGroup/RadioGroup";
import { SettingsElement } from "../../../types";
import { SettingsElementComponent } from "../types";

const Theme: SettingsElementComponent = ({ control }) => {
  return (
    <FormElementWrapper label="Theme">
      <Controller
        control={control}
        name="appearance.appearance"
        render={({ field: { ref, ...field } }) => (
          <RadioGroup {...field} options={[...appearances]} />
        )}
      />
    </FormElementWrapper>
  );
};

const settingsElement: SettingsElement = {
  component: Theme,
  name: "Theme",
  altNames: [],
};

export default settingsElement;
