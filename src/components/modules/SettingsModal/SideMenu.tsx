import { Config } from "../../../backend/routers/config/schemas";
import useConfig from "../../../hooks/useConfig";
import Button from "../../button/Button";
import Input from "../../input/Input";
import { SettingsSection } from "./types";

interface SideMenuProps {
  scrolledSectionName: string;
  closeMenuBar: () => void;
  settingsSections: Array<SettingsSection>;
}

export default function SideMenu({
  scrolledSectionName,
  closeMenuBar,
  settingsSections,
}: SideMenuProps) {
  const { config } = useConfig();
  const scrollToSection = (section: SettingsSection) => {
    const current = section.ref?.current;
    if (!current) return;
    current.scrollIntoView();
    if (window.innerWidth < 922) {
      closeMenuBar();
    }
  };

  const glassyStyles = config.data?.appearance.glassy
    ? "backdrop-blur-3xl dark:bg-primary-900/50"
    : "dark:bg-primary-900";

  return (
    <div
      className={`${glassyStyles} sticky top-24 flex h-full w-64 flex-col p-6 pt-12 text-primary-50`}
    >
      <h1 className="mb-4 text-center text-2xl">Settings</h1>
      <Input
        placeholder="Search..."
        pilled
        state="dark"
        noLabel
        noHelperText
        className="mb-8"
      />
      <div className="ml-2 flex flex-col gap-2">
        {settingsSections.map((section, index) => (
          <Button
            className={`text-left 
              ${
                scrolledSectionName === section.name
                  ? "bg-primary-200 dark:bg-primary-500"
                  : ""
              }
            `}
            variant="ghost"
            onClick={() => scrollToSection(section)}
            key={section.name}
          >
            <div className="flex items-center gap-2">
              <div className={`rounded-lg p-1 ${section.iconBg}`}>
                {/* <section.icon /> */}
              </div>
              <span>{section.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
