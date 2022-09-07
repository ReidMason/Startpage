import { SettingsElement } from "../../../types";
import BaseTextSetting from "../base/BaseTextSetting";
import { SettingsElementComponent } from "../types";

const SearchPlaceholder: SettingsElementComponent = ({ register }) => {
  return (
    <BaseTextSetting
      label="Search placeholder"
      formRegister={register("general.searchPlaceholder")}
    />
  );
};

const settingsElement: SettingsElement = {
  component: SearchPlaceholder,
  name: "Search Placeholder",
  altNames: [],
};

export default settingsElement;
