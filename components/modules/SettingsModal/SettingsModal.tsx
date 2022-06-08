import { AnimatePresence, m } from "framer-motion";
import { Config } from "../../../services/server/config/types";
import { StateSetter } from "../../../types/common";
import Modal from "../../modal/Modal";
import SettingsContent from "./SettingsContent";
import SideMenu from "./SideMenu";
import { UIEvent, useEffect, useState } from "react";
import SideMenuIcon from "./SideMenuIcon";
import { settingsSections as defaultSettingsSections } from "./settingsSections";

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
  const [settingsSections, setSettingsSections] = useState(
    defaultSettingsSections
  );
  const [scrolledSectionName, setScrolledSectionName] = useState(
    settingsSections[0].name
  );
  const [width, setWidth] = useState(999);
  const [menuVisible, setMenuVisible] = useState(false);

  const isMobile = (width: number) => {
    const mobileWidth = 922;
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

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.getBoundingClientRect().top;

    for (let i = 0; i < settingsSections.length; i++) {
      const section = settingsSections[i];
      const element = section.ref?.current;

      if (element && isScrolledIntoView(element, scrollTop)) {
        setScrolledSectionName(section.name);
        return;
      }
    }
  };

  const isScrolledIntoView = (el: HTMLDivElement, scrollTop: number) => {
    var rect = el.getBoundingClientRect();
    return rect.bottom >= scrollTop;
  };

  const closeWithoutSaving = () => {
    setOpen(false);
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
            <SideMenu
              config={config}
              settingsSections={settingsSections}
              scrolledSectionName={scrolledSectionName}
              closeMenuBar={closeMenuBar}
            />
          </m.div>
        )}
      </AnimatePresence>

      {isMobile(width) && <SideMenuIcon openMenuBar={openMenuBar} />}

      <SettingsContent
        settingsSections={settingsSections}
        setSettingsSections={setSettingsSections}
        onClick={handleSettingsContentClicked}
        config={config}
        closeModal={closeWithoutSaving}
        onScroll={handleScroll}
      />
    </Modal>
  );
}
