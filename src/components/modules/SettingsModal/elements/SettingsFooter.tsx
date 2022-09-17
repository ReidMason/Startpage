import React from "react";
import Button from "../../../button/Button";
import SideMenuToggleIcon from "./SideMenuToggleIcon";

interface SettingsFooterProps {
  isMobileView: boolean;
  openMenuBar: () => void;
  closeWithoutSaving: (saved?: boolean) => void;
}

export default function SettingsFooter({
  isMobileView,
  openMenuBar,
  closeWithoutSaving,
}: SettingsFooterProps) {
  return (
    <div className="flex w-full justify-start gap-4 bg-primary-900/40 p-2">
      {isMobileView && (
        <div className="place-self-start">
          <SideMenuToggleIcon openMenuBar={openMenuBar} />
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
