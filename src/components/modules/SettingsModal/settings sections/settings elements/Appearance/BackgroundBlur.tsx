import React from "react";
import { Controller } from "react-hook-form";
import FormElementWrapper from "../../../../../FormElementWrapper/FormElementWrapper";
import Switch from "../../../../../switch/Switch";
import { SettingsElementComponent } from "../types";

const BackgroundBlur: SettingsElementComponent = ({ control }) => {
  return (
    <Controller
      control={control}
      name="appearance.backgroundBlur"
      render={({ field: { ref, ...field } }) => (
        <FormElementWrapper label="Background blur">
          <Switch {...field} />
        </FormElementWrapper>
      )}
    />
  );
};

export default BackgroundBlur;
