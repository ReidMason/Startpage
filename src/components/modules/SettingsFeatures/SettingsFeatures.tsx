import dynamic from "next/dynamic";
import { config } from "process";
import React, { useState } from "react";
import type { StateSetter } from "../../../../types/common";
import type { Config } from "../../../backend/routers/config/schemas";
import type { Extension } from "../../extensions/types";
import SettingsButtons from "../../SettingsButtons";

interface SettingsFeaturesProps {
  editMode: boolean;
  setEditMode: StateSetter<boolean>;
  extensions: Array<Extension>;
  setExtensions: StateSetter<Array<Extension>>;
  config: Config;
  setConfig: StateSetter<Config>;
}

const DynamicSettingsModal = dynamic(
  () => import("../../../components/modules/SettingsModal/SettingsModal")
);

export default function SettingsFeatures(props: SettingsFeaturesProps) {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  return (
    <>
      <SettingsButtons {...props} {...{ setSettingsModalOpen }} />

      <DynamicSettingsModal
        config={props.config}
        setConfig={props.setConfig}
        open={settingsModalOpen}
        setOpen={setSettingsModalOpen}
      />
    </>
  );
}
