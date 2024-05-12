import React from "react";
import { SettingsSectionProps } from "./types";
import SettingsPanelWrapper from "./SettingsPanelWrapper";

export default function Appearance({
  setActivePage,
  page,
  control,
  loading,
}: SettingsSectionProps) {
  return (
    <SettingsPanelWrapper setActivePage={setActivePage} panel={page}>
      <p className="text-white">Nothing here yet :(</p>
    </SettingsPanelWrapper>
  );
}
