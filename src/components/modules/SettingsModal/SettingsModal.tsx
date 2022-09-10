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
import SideMenuToggleIcon from "./elements/SideMenuToggleIcon";
import Button from "../../button/Button";
import { useForm } from "react-hook-form";

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
      <form
        className="flex flex-col"
        onSubmit={handleSubmit(saveSettings)}
        onClick={handleSettingsContentClicked}
      >
        <div className="flex max-h-full overflow-hidden">
          <AnimatePresence initial={false}>
            {menuVisible && (
              <m.div
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
          <SettingsContent
            settingsSearch={settingsSearch}
            config={config}
            updateConfig={updateConfig}
            settingsSections={settingsSections}
            onScroll={handleScroll}
            control={control}
            register={register}
            menuVisible={menuVisible}
          />
        </div>

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
      </form>
    </Modal>
  );
}
