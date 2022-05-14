import React from "react";
import { Config } from "../../../services/config/types";
import { StateSetter } from "../../../types/common";
import Modal from "../../modal/Modal";
import SettingsContent from "./SettingsContent";
import SideMenu from "./SideMenu";

interface SettingsModalProps {
  open: boolean;
  setOpen: StateSetter<boolean>;
  config: Config;
}

export default function SettingsModal({
  open,
  setOpen,
  config,
}: SettingsModalProps) {
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="flex h-full w-full">
        <div className="hidden">
          <SideMenu />
        </div>
        <SettingsContent config={config} closeModal={() => setOpen(false)} />
      </div>
    </Modal>
  );
}
