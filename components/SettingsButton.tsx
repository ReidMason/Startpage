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
    <Button variant="outline" onClick={openSettings}>
      Settings
    </Button>
  );
}
