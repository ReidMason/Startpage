import { AnimatePresence, m } from "framer-motion";
import { ConfigSetter, StateSetter } from "../../../../types/common";
import Modal from "../../modal/Modal";
import SettingsContent from "./elements/SettingsContent";
import SettingsSideMenu from "./elements/SettingsSideMenu";
import {
  createRef,
  MutableRefObject,
  RefObject,
  UIEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { settingsSections as defaultSettingsSections } from "./settingsSections";
import { Config } from "../../../backend/routers/config/schemas";
import useConfig from "../../../hooks/useConfig";
import { useForm } from "react-hook-form";
import SettingsFooter from "./elements/SettingsFooter";

interface SettingsModalProps {
  open: boolean;
  setOpen: StateSetter<boolean>;
  config: Config;
  updateConfig: ConfigSetter;
}

export default function SettingsModal({
  open,
  setOpen,
  config,
  updateConfig,
}: SettingsModalProps) {
  const elementsRef: MutableRefObject<Array<RefObject<HTMLDivElement>>> =
    useRef(defaultSettingsSections.map(() => createRef()));
  const { config: savedConfig } = useConfig();
  const [settingsSearch, setSettingsSearch] = useState("");

  // Add refs to the settings sections
  const [settingsSections] = useState(
    defaultSettingsSections.map((x, index) => ({
      ...x,
      ref: elementsRef.current[index],
    }))
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

  const handleWidthChange = useCallback(() => {
    const windowWidth = window.innerWidth;
    setWidth(windowWidth);

    if (isMobile(windowWidth)) closeMenuBar();
    else if (!isMobile(windowWidth)) openMenuBar();
  }, []);

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

  const closeWithoutSaving = (saved?: boolean) => {
    setOpen(false);
    if (!saved && savedConfig.data)
      updateConfig(savedConfig.data, false, false);
  };

  // New stuff
  const saveSettings = async (data: Config) => {
    await updateConfig(data, true, false);
    closeWithoutSaving(true);
  };

  const isMobileView = isMobile(width);

  const { register, handleSubmit, control } = useForm<Config>({
    defaultValues: config,
  });

  return (
    <Modal open={open} onClose={closeWithoutSaving}>
      <div
        className={`flex overflow-x-hidden overflow-y-scroll ${
          menuVisible ? "gap-4" : ""
        }`}
        onScroll={handleScroll}
      >
        <div>
          <AnimatePresence initial={false}>
            {menuVisible && (
              <m.div
                className="h-full w-full"
                key="menu-sidebar"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { width: "auto", opacity: 1 },
                  collapsed: { width: 0, opacity: 0 },
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.04, 0.62, 0.23, 0.98],
                }}
              >
                <SettingsSideMenu
                  settingsSearch={settingsSearch}
                  setSettingsSearch={setSettingsSearch}
                  settingsSections={settingsSections}
                  scrolledSectionName={scrolledSectionName}
                  closeMenuBar={closeMenuBar}
                />
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <form
          className="flex scroll-smooth"
          onSubmit={handleSubmit(saveSettings)}
          onClick={handleSettingsContentClicked}
          id="settings-form"
        >
          <SettingsContent
            settingsSearch={settingsSearch}
            config={config}
            updateConfig={updateConfig}
            settingsSections={settingsSections}
            control={control}
            register={register}
            menuVisible={menuVisible}
            onScroll={handleScroll}
          />
        </form>
      </div>

      <SettingsFooter
        isMobileView={isMobileView}
        closeWithoutSaving={closeWithoutSaving}
        setMenuVisible={setMenuVisible}
        menuVisible={menuVisible}
      />
    </Modal>
  );
}
