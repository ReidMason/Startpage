import { SettingsElement } from "../../../types";
import BaseTextSetting from "../base/BaseTextSetting";
import { SettingsElementComponent } from "../types";

const CalendarUrl: SettingsElementComponent = ({ register }) => {
  return (
    <BaseTextSetting
      label="Calendar URL"
      formRegister={register("general.calendarUrl")}
    />
  );
};

const settingsElement: SettingsElement = {
  component: CalendarUrl,
  name: "Calendar Url",
  altNames: [],
};

export default settingsElement;
