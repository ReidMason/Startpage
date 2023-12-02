import React from "react";
import { SettingsSectionProps } from "./types";
import SettingsPanelWrapper from "./SettingsPanelWrapper";
import SettingsGroup from "../Layouts/SettingsGroup";

export default function Appearance({ ...props }: SettingsSectionProps) {
  return (
    <SettingsPanelWrapper {...props}>
      <p className="text-white">Nothing here yet :(</p>
    </SettingsPanelWrapper>
  );
}
