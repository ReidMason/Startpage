import { SettingsElement } from "../../../types";
import BaseTextSetting from "../base/BaseTextSetting";
import { SettingsElementComponent } from "../types";

const SearchUrl: SettingsElementComponent = ({ register }) => {
  return (
    <BaseTextSetting
      label="Search URL"
      formRegister={register("general.searchUrl")}
    />
  );
};

const settingsElement: SettingsElement = {
  component: SearchUrl,
  name: "Search Url",
  altNames: [],
};

export default settingsElement;
