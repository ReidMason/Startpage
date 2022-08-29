import dynamic from "next/dynamic";
import React, { useState } from "react";
import { StateSetter } from "../../../../types/common";
import { Extension } from "../../extensions/types";
import SettingsButtons from "../../SettingsButtons";

interface SettingsFeaturesProps {
  editMode: boolean;
  setEditMode: StateSetter<boolean>;
  extensions: Array<Extension>;
  setExtensions: StateSetter<Array<Extension>>;
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
        open={settingsModalOpen}
        setOpen={setSettingsModalOpen}
      />
    </>
  );
}
