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

export default CalendarUrl;
