import React from "react";
import { StateSetter } from "../types/common";
import Button from "./button/Button";

interface SettingsButtonProps {
  setSettingsModalOpen: StateSetter<boolean>;
}

export default function SettingsButton({
  setSettingsModalOpen,
}: SettingsButtonProps) {
  const openSettings = () => {
    setSettingsModalOpen(true);
  };

  return (
    <div className="fixed bottom-0 left-0 m-4">
      <Button variant="outline" onClick={openSettings}>
        Settings
      </Button>
    </div>
  );
}
