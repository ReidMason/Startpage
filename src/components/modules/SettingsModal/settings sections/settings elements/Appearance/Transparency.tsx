import React from "react";
import { Controller } from "react-hook-form";
import FormElementWrapper from "../../../../../FormElementWrapper/FormElementWrapper";
import Switch from "../../../../../switch/Switch";
import { SettingsElement } from "../../../types";
import { SettingsElementComponent } from "../types";

const Transparency: SettingsElementComponent = ({ control }) => {
  return (
    <Controller
      control={control}
      name="appearance.glassy"
      render={({ field: { ref, ...field } }) => (
        <FormElementWrapper label="Transparency">
          <Switch {...field} />
        </FormElementWrapper>
      )}
    />
  );
};

const settingsElement: SettingsElement = {
  component: Transparency,
  name: "Transparency",
  altNames: [],
};

export default settingsElement;
