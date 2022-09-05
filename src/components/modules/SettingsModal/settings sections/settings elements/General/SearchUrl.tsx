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

export default SearchUrl;
