import dynamic from "next/dynamic";
import React, { useState } from "react";
import type { ConfigSetter, StateSetter } from "../../../../types/common";
import type {
  Config,
  PartialConfig,
} from "../../../backend/routers/config/schemas";
import type { Extension } from "../../extensions/types";
import SettingsButtons from "../../SettingsButtons";

interface SettingsFeaturesProps {
  editMode: boolean;
  setEditMode: StateSetter<boolean>;
  extensions: Array<Extension>;
  setExtensions: StateSetter<Array<Extension>>;
  config: Config;
  updateConfig: ConfigSetter;
}

const DynamicSettingsModal = dynamic(
  () => import("../../../components/modules/SettingsModal/SettingsModal")
);

export default function SettingsFeatures(props: SettingsFeaturesProps) {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  return (
    <>
      <SettingsButtons {...props} {...{ setSettingsModalOpen }} />

      {settingsModalOpen && (
        <DynamicSettingsModal
          config={props.config}
          updateConfig={props.updateConfig}
          open={settingsModalOpen}
          setOpen={setSettingsModalOpen}
        />
      )}
    </>
  );
}
