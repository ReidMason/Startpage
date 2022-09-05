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

export default SearchPlaceholder;
