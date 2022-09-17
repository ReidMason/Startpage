import React from "react";
import { StateSetter } from "../../../../../types/common";
import Button from "../../../button/Button";
import SideMenuToggleIcon from "./SideMenuToggleIcon";

interface SettingsFooterProps {
  isMobileView: boolean;
  closeWithoutSaving: (saved?: boolean) => void;
  setMenuVisible: StateSetter<boolean>;
  menuVisible: boolean;
}

export default function SettingsFooter({
  isMobileView,
  menuVisible,
  setMenuVisible,
  closeWithoutSaving,
}: SettingsFooterProps) {
  const toggleMenuBar = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div className="flex w-full justify-start gap-4 bg-primary-900/40 p-2">
      {isMobileView && (
        <div className="place-self-start">
          <SideMenuToggleIcon toggleMenuBar={toggleMenuBar} />
        </div>
      )}
      <div className="ml-auto flex gap-4">
        <Button type="submit" state="success">
          Save
        </Button>
        <Button variant="outline" onClick={() => closeWithoutSaving()}>
          Exit
        </Button>
      </div>
    </div>
  );
}
