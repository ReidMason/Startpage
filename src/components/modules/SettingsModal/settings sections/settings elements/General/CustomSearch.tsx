import { Controller } from "react-hook-form";
import FormElementWrapper from "../../../../../FormElementWrapper/FormElementWrapper";
import Switch from "../../../../../switch/Switch";
import { SettingsElementComponent } from "../types";

const CustomSearch: SettingsElementComponent = ({ control }) => {
  return (
    <Controller
      control={control}
      name="general.customSearchEnabled"
      render={({ field: { ref, ...field } }) => (
        <FormElementWrapper label="Custom search">
          <Switch {...field} />
        </FormElementWrapper>
      )}
    />
  );
};

export default CustomSearch;
