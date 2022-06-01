import { AnimatePresence, m } from "framer-motion";
import { Config } from "../../../services/server/config/types";
import { StateSetter } from "../../../types/common";
import Modal from "../../modal/Modal";
import SettingsContent from "./SettingsContent";
import SideMenu from "./SideMenu";
import { useEffect, useState } from "react";
import SideMenuIcon from "./SideMenuIcon";
import { settingsSections } from "./settingsSections";

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
  const [scrolledSectionName, setScrolledSectionName] = useState(
    settingsSections[0].name
  );
  const [width, setWidth] = useState(999);
  const [menuVisible, setMenuVisible] = useState(false);
  const mobileWidth = 922;

  const isMobile = (width: number) => {
    return width < mobileWidth;
  };

  const handleWidthChange = () => {
    const windowWidth = window.innerWidth;
    setWidth(windowWidth);

    if (isMobile(windowWidth)) {
      closeMenuBar();
    } else if (!isMobile(windowWidth)) {
      openMenuBar();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleWidthChange);
    handleWidthChange();
  }, [handleWidthChange]);

  const closeMenuBar = () => {
    setMenuVisible(false);
  };

  const openMenuBar = () => {
    setMenuVisible(true);
  };

  const handleSettingsContentClicked = () => {
    if (!isMobile(width) || !menuVisible) return;

    closeMenuBar();
  };

  const handleScroll = () => {
    for (let i = 0; i < settingsSections.length; i++) {
      const section = settingsSections[i];
      const element = section.ref?.current;
      if (element && isScrolledIntoView(element)) {
        setScrolledSectionName(section.name);
        return;
      }
    }
  };

  function isScrolledIntoView(el: HTMLDivElement) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    return elemTop >= 0 && elemBottom <= window.innerHeight;
  }

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
            <SideMenu
              scrolledSectionName={scrolledSectionName}
              closeMenuBar={closeMenuBar}
            />
          </m.div>
        )}
      </AnimatePresence>

      {isMobile(width) && <SideMenuIcon openMenuBar={openMenuBar} />}

      <SettingsContent
        onClick={handleSettingsContentClicked}
        config={config}
        closeModal={() => setOpen(false)}
        onScroll={handleScroll}
      />
    </Modal>
  );
}
