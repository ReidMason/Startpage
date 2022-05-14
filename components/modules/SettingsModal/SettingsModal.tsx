import React from "react";
import { StateSetter } from "../../../types/common";
import Modal from "../../modal/Modal";
import SideMenu from "./SideMenu";

interface SettingsModalProps {
  open: boolean;
  setOpen: StateSetter<boolean>;
}

export default function SettingsModal({ open, setOpen }: SettingsModalProps) {
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="flex h-full">
        <SideMenu />
        {/* <SettingsContent closeModal={closeModal} /> */}
      </div>
    </Modal>
  );
}
