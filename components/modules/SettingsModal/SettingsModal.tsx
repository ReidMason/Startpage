import { AnimatePresence, m } from "framer-motion";
import { Config } from "../../../services/config/types";
import { StateSetter } from "../../../types/common";
import Modal from "../../modal/Modal";
import SettingsContent from "./SettingsContent";
import SideMenu from "./SideMenu";
import { MenuIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";

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
  const [width, setWidth] = useState(999);
  const [menuVisible, setMenuVisible] = useState(false);
  const isMobile = width > 992;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  const closeMenuBar = () => {
    setMenuVisible(false);
  };

  const openMenu = () => {
    setMenuVisible(true);
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <AnimatePresence initial={false}>
        {menuVisible && (
          <m.div
            key="menu-sidebar"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { width: "auto" },
              collapsed: { width: 0 },
            }}
            transition={{
              duration: 0.4,
              ease: [0.04, 0.62, 0.23, 0.98],
            }}
          >
            <SideMenu />
          </m.div>
        )}
      </AnimatePresence>

      {!menuVisible && (
        <m.div
          className="fixed bottom-0 z-20"
          key="menu-open-button"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { y: 0 },
            collapsed: { y: 50 },
          }}
          transition={{
            duration: 0.4,
            ease: [0.04, 0.62, 0.23, 0.98],
          }}
        >
          <button
            className="rounded-full bg-primary-900/50 p-2 shadow-xl"
            onClick={openMenu}
          >
            <MenuIcon className="h-8 w-8" />
          </button>
        </m.div>
      )}

      <SettingsContent config={config} closeModal={() => setOpen(false)} />
    </Modal>
  );
}
